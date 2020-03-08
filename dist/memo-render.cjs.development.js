'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var isEqual = _interopDefault(require('react-fast-compare'));

var MemoRender = React.memo(function (_ref) {
  var children = _ref.children;
  return children;
}, function (prevProps, nextProps) {
  return !prevProps.disabled && isEqual(prevProps, nextProps);
});
MemoRender.displayName = 'MemoRender';

exports.default = MemoRender;
