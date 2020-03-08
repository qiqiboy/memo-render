# MemoRender

A react-component for optimizing performance when it's parent re-renders.

`MemoRender`是一个非常简单的 react 组件，它是为了某些追求性能场景下，阻止一些已经声明的组件在本身`props`未发生变化（指深度比较deep diff后）时频繁重复渲染。

## 安装

```bash
$ npm install memo-render --save

// yarn
$ yarn add memo-render
```

## 如何使用

`MemoRender`的使用非常简单，它没有任何额外的`props`，除了`children`。你只需要将它包裹需要优化的组件即可。

```diff
-   <HeavyComponent />
+   <MemoRender>
+       <HeavyComponent />
+   </MemoRender>
```

## 原理

感谢`react-fast-compare`，`ReactRender`借助 react 本身的`react.memo`优化技巧，通过深度比较`children`节点，来告诉 react 是否跳过本次渲染。

**请注意**，这并非意味着`children`节点的组件不会运行，实际上`children`节点的组件依然会调用其`render()`方法，但是如果`render()`生成的`react elements tree`(`Virtual DOM Tree`)与上一次没有变化，则 react 会复用上一次的结果，不进入`协调(Reconciliation)`阶段。

对性能影响更大的是`协调(Reconciliation)`阶段的计算处理，包括更新真实 DOM。仅仅创建`VDOM`的开销相比是可以忽略不计的。

## 陷阱

首先，相信我，绝大多数情况下你都不需要`MemoRender`。

`MemoRender`并不是适用于所有场景，首先第一原则与 `shouldComponentUpdate` / `React.memo` / `React.PureComponent` 的指导思想一致：

**`If the slowdown is noticeable?`**

即，应当仅在应用性能出现明显下降时，再考虑应用这些优化手段。过度优化，可能导致应用存在潜在的 bug（例如组件无法响应 props 或 state 变化的更新）、优化逆反（过度的深度比较可能比 react 本身的 diffing、reconciliation 更慢）等.

另外如果`children`节点存在传递了局部内联函数（临时函数），`MemoRender`会无法起到优化作用，甚至起到反作用，导致应用反而更慢。

```typescript
/**
 * Bad 错误示例
 * 下面两个示例套用MemoRender是无效的，甚至会降低性能
 * 因为 onChange 是一个始终变化的函数，而函数是无法深度比较的
 * 第二个例子虽然传递的options是一个对象，但是因为其包含临时函数属性onChange，因此也会导致优化失效
 */
function APP() {
    return (
        <div>
            <MemoRender>
                <HeavyComponent onChange={() => {}} />
            </MemoRender>

            <MemoRender>
                <HeavyComponent options={{ value: 'xx', onChange() {} }} />
            </MemoRender>
        </div>
    );
}
```

正确的做法是将 `onChange` 放到组件实例（class组件）或者适用 memoizeation 优化(function组件、hooks):
```typescript
/**
 * Good 优化后
 */
function APP() {
    const onChange=useCallback(() => {}, []);

    return (
        <div>
            <MemoRender>
                <HeavyComponent onChange={onChange} />
            </MemoRender>

            <MemoRender>
                <HeavyComponent options={{ value: 'xx', onChange }} />
            </MemoRender>
        </div>
    );
}
```
