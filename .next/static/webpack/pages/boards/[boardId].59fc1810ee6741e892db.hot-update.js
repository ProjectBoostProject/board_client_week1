"use strict";
self["webpackHotUpdate_N_E"]("pages/boards/[boardId]",{

/***/ "./src/feature/reply/component/ReplyInput.jsx":
/*!****************************************************!*\
  !*** ./src/feature/reply/component/ReplyInput.jsx ***!
  \****************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__);
/* module decorator */ module = __webpack_require__.hmd(module);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\src\\feature\\reply\\component\\ReplyInput.jsx";



const Container = styled_components__WEBPACK_IMPORTED_MODULE_2__.default.div.withConfig({
  displayName: "ReplyInput__Container",
  componentId: "sc-9wk741-0"
})(["width:100%;height:80px;display:flex;flex-direction:row;justify-content:flex-start;align-items:center;padding:8px;"]);
_c = Container;
const UserInfoSection = styled_components__WEBPACK_IMPORTED_MODULE_2__.default.div.withConfig({
  displayName: "ReplyInput__UserInfoSection",
  componentId: "sc-9wk741-1"
})(["display:flex;flex-direction:column;justify-content:flex-start;align-items:center;margin-right:20px;"]);
_c2 = UserInfoSection;
const UserInfoInput = styled_components__WEBPACK_IMPORTED_MODULE_2__.default.input.withConfig({
  displayName: "ReplyInput__UserInfoInput",
  componentId: "sc-9wk741-2"
})(["width:80px;margin-bottom:8px;"]);
_c3 = UserInfoInput;
const ContentInput = styled_components__WEBPACK_IMPORTED_MODULE_2__.default.textarea.withConfig({
  displayName: "ReplyInput__ContentInput",
  componentId: "sc-9wk741-3"
})(["width:100%;height:80%;"]);
_c4 = ContentInput;

const ReplyInput = ({
  addReply
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)(Container, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)(UserInfoSection, {
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)(UserInfoInput, {
        placeholder: "\uC791\uC131\uC790"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 39,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)(UserInfoInput, {
        placeholder: "\uBE44\uBC00\uBC88\uD638"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 40,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 38,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)(ContentInput, {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 42,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 37,
    columnNumber: 5
  }, undefined);
};

_c5 = ReplyInput;
/* harmony default export */ __webpack_exports__["default"] = (ReplyInput);

var _c, _c2, _c3, _c4, _c5;

$RefreshReg$(_c, "Container");
$RefreshReg$(_c2, "UserInfoSection");
$RefreshReg$(_c3, "UserInfoInput");
$RefreshReg$(_c4, "ContentInput");
$RefreshReg$(_c5, "ReplyInput");

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljL3dlYnBhY2svcGFnZXMvYm9hcmRzL1tib2FyZElkXS41OWZjMTgxMGVlNjc0MWU4OTJkYi5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQSxNQUFNRSxTQUFTLEdBQUdELHFFQUFIO0FBQUE7QUFBQTtBQUFBLHlIQUFmO0tBQU1DO0FBV04sTUFBTUUsZUFBZSxHQUFHSCxxRUFBSDtBQUFBO0FBQUE7QUFBQSwyR0FBckI7TUFBTUc7QUFTTixNQUFNQyxhQUFhLEdBQUdKLHVFQUFIO0FBQUE7QUFBQTtBQUFBLHFDQUFuQjtNQUFNSTtBQU1OLE1BQU1FLFlBQVksR0FBR04sMEVBQUg7QUFBQTtBQUFBO0FBQUEsOEJBQWxCO01BQU1NOztBQUtOLE1BQU1FLFVBQVUsR0FBRyxDQUFDO0FBQUVDLEVBQUFBO0FBQUYsQ0FBRCxLQUFrQjtBQUNuQyxzQkFDRSw4REFBQyxTQUFEO0FBQUEsNEJBQ0UsOERBQUMsZUFBRDtBQUFBLDhCQUNFLDhEQUFDLGFBQUQ7QUFBZSxtQkFBVyxFQUFDO0FBQTNCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREYsZUFFRSw4REFBQyxhQUFEO0FBQWUsbUJBQVcsRUFBQztBQUEzQjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUZGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQUtFLDhEQUFDLFlBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFMRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQVNELENBVkQ7O01BQU1EO0FBWU4sK0RBQWVBLFVBQWYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2ZlYXR1cmUvcmVwbHkvY29tcG9uZW50L1JlcGx5SW5wdXQuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHN0eWxlZCBmcm9tIFwic3R5bGVkLWNvbXBvbmVudHNcIjtcclxuXHJcbmNvbnN0IENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiA4MHB4O1xyXG5cclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcblxyXG4gIHBhZGRpbmc6IDhweDtcclxuYDtcclxuY29uc3QgVXNlckluZm9TZWN0aW9uID0gc3R5bGVkLmRpdmBcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcblxyXG4gIG1hcmdpbi1yaWdodDogMjBweDtcclxuYDtcclxuXHJcbmNvbnN0IFVzZXJJbmZvSW5wdXQgPSBzdHlsZWQuaW5wdXRgXHJcbiAgd2lkdGg6IDgwcHg7XHJcblxyXG4gIG1hcmdpbi1ib3R0b206IDhweDtcclxuYDtcclxuXHJcbmNvbnN0IENvbnRlbnRJbnB1dCA9IHN0eWxlZC50ZXh0YXJlYWBcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDgwJTtcclxuYDtcclxuXHJcbmNvbnN0IFJlcGx5SW5wdXQgPSAoeyBhZGRSZXBseSB9KSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxDb250YWluZXI+XHJcbiAgICAgIDxVc2VySW5mb1NlY3Rpb24+XHJcbiAgICAgICAgPFVzZXJJbmZvSW5wdXQgcGxhY2Vob2xkZXI9XCLsnpHshLHsnpBcIiAvPlxyXG4gICAgICAgIDxVc2VySW5mb0lucHV0IHBsYWNlaG9sZGVyPVwi67mE67CA67KI7Zi4XCIgLz5cclxuICAgICAgPC9Vc2VySW5mb1NlY3Rpb24+XHJcbiAgICAgIDxDb250ZW50SW5wdXQgLz5cclxuICAgIDwvQ29udGFpbmVyPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXBseUlucHV0O1xyXG4iXSwibmFtZXMiOlsiUmVhY3QiLCJzdHlsZWQiLCJDb250YWluZXIiLCJkaXYiLCJVc2VySW5mb1NlY3Rpb24iLCJVc2VySW5mb0lucHV0IiwiaW5wdXQiLCJDb250ZW50SW5wdXQiLCJ0ZXh0YXJlYSIsIlJlcGx5SW5wdXQiLCJhZGRSZXBseSJdLCJzb3VyY2VSb290IjoiIn0=