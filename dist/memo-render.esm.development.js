import React from 'react';
import isEqual from 'react-fast-compare';

var MemoRender = React.memo(function (_ref) {
  var children = _ref.children;
  return children;
}, function (prevProps, nextProps) {
  return !nextProps.disabled && (nextProps.deps ? isEqual(prevProps.deps, nextProps.deps) : isEqual(prevProps, nextProps));
});
MemoRender.displayName = 'MemoRender';

export default MemoRender;
