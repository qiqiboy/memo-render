import React from 'react';
import isEqual from 'react-fast-compare';

const MemoRender = React.memo<{
    children: React.ReactNode;
    disabled?: boolean;
}>(
    ({ children }) => children as React.ReactElement,
    (prevProps, nextProps) => !prevProps.disabled && isEqual(prevProps, nextProps)
);

MemoRender.displayName = 'MemoRender';

export default MemoRender;
