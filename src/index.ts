import { memo, ReactElement } from 'react';
import isEqual from 'react-fast-compare';

const MemoRender = memo<{
    children: ReactElement;
}>(
    ({ children }) => children,
    (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

MemoRender.displayName = 'MemoRender';

export default MemoRender;
