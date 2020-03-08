import { memo } from 'react';
import isEqual from 'react-fast-compare';

var MemoRender = memo(function (_ref) {
  var children = _ref.children;
  return children;
}, function (prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
});
MemoRender.displayName = 'MemoRender';

export default MemoRender;
