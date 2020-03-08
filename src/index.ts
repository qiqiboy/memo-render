import React from 'react';
import isEqual from 'react-fast-compare';

const MemoRender = React.memo<{
    children: React.ReactNode;
    disabled?: boolean;
    deps?: any[];
}>(
    ({ children }) => children as React.ReactElement,
    (prevProps, nextProps) =>
        !nextProps.disabled &&
        (nextProps.deps ? isEqual(prevProps.deps, nextProps.deps) : isEqual(prevProps, nextProps))
);

MemoRender.displayName = 'MemoRender';

export default MemoRender;
