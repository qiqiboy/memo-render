# MemoRender

A react-component for optimizing performance when it's parent re-renders.

`MemoRender`是一个非常简单的 react 组件，它是为了某些追求性能场景下，阻止一些已经声明的组件在本身`props`未发生变化（指深度比较 deep diff 后）时频繁重复渲染。

<!-- vim-markdown-toc GFM -->

* [安装](#安装)
* [如何使用](#如何使用)
* [原理](#原理)
* [陷阱](#陷阱)

<!-- vim-markdown-toc -->

## 安装

```bash
$ npm install memo-render --save

// yarn
$ yarn add memo-render
```

## 如何使用

`MemoRender`的使用非常简单，它只有一个可选的`disabled`属性，表示是否启用深度 props diffing 优化。除此之外，你只需要将它包裹需要优化的组件即可。

```diff
-   <HeavyComponent />
+   <MemoRender>
+       <HeavyComponent />
+   </MemoRender>
```

## 原理

频繁的重复渲染是大多数事后导致应用下降的原因，而减少渲染这也正是 react 优化性能的最主要方向：[`Avoid Reconciliation`](https://reactjs.org/docs/optimizing-performance.html#avoid-reconciliation) 。大多数时候，我们应当尽可能的通过优化组件划分、组合逻辑、状态模型等，来避免非必要的组件被迫重复渲染。

但是受限于业务形态或者组件维护、业务逻辑限制等原因，有些组件无法从经常更新的上层组件中抽离。所以这时候就需要适用`shouldComponentUpdate`等优化手段了。`shouldComponentUpdate`仅适用于项目本身的组件，对于第三方组件无法适用该方法优化。

而`MemoRender`就是用于这种优化场景，无需改造原有组件，直接将它放到需要优化的节点上层，即可达到一定的优化效果。这是因为组件传递的各种 props（包括 children），大多都是局部临时变量。对于 object 类型数据，局部临时生成，每次都是新的变量对象，这导致 react 内部的 diffing 比较不一致，持续进入下一层组件的`ceconciliation`阶段，即重复渲染。`MemoRender`正式通过深度比较`children`节点是否有变化来告诉 react 是否跳过本次渲染。

感谢`react-fast-compare`，`ReactRender`借助 react 本身的`react.memo`优化技巧，通过深度比较`children`节点，来告诉 react 是否跳过本次渲染。

**请注意**，这并非意味着`children`节点的组件不会运行，实际上`children`节点的组件依然会调用其`render()`方法，但是如果`render()`生成的`react elements tree`(`Virtual DOM Tree`)与上一次没有变化，则 react 会复用上一次的结果，不进入`协调(Reconciliation)`阶段。

对性能影响更大的是`协调(Reconciliation)`阶段的计算处理，包括更新真实 DOM。仅仅创建`VDOM`的开销相比是可以忽略不计的。

## 陷阱

首先，相信我，绝大多数情况下你都不需要`MemoRender`。

`MemoRender`并不是适用于所有场景，首先第一原则与 `shouldComponentUpdate` / `React.memo` / `React.PureComponent` 的指导思想一致：

**`If the slowdown is noticeable?`**

即，应当仅在应用性能出现明显下降时，再考虑应用这些优化手段。过度优化，可能导致应用存在潜在的 bug（例如组件无法响应 props 或 state 变化的更新）、优化逆反（过度的深度比较可能比 react 本身的 diffing、reconciliation 更慢）等

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

正确的做法是将 `onChange` 放到组件实例（class 组件）或者适用 memoizeation 优化(function 组件、hooks):

```typescript
/**
 * Good 优化后
 */
function APP() {
    const onChange = useCallback(() => {}, []);

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
