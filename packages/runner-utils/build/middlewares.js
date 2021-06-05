/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/middlewares/index.ts":
/*!**********************************!*\
  !*** ./src/middlewares/index.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const popup_1 = __webpack_require__(/*! ./popup */ "./src/middlewares/popup.ts");
module.exports = { handlePopup: popup_1.handlePopup };


/***/ }),

/***/ "./src/middlewares/popup.ts":
/*!**********************************!*\
  !*** ./src/middlewares/popup.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handlePopup = void 0;
function handlePopup(page, browserContext) {
    page.on("popup", async (popup) => {
        const popupUrl = await popup.url();
        page.evaluate('window.location.href = "' + popupUrl + '"');
        const pages = await browserContext.pages();
        for (let i = 1; i < pages.length; i++) {
            await pages[i].close();
        }
    });
}
exports.handlePopup = handlePopup;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/middlewares/index.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9taWRkbGV3YXJlcy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9taWRkbGV3YXJlcy9wb3B1cC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaUZBQXNDO0FBRXRDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxXQUFXLEVBQUUsbUJBQVcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ0E5QyxTQUFnQixXQUFXLENBQUMsSUFBVSxFQUFFLGNBQThCO0lBQ3JFLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNoQyxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxDQUFDLDBCQUEwQixHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzRCxNQUFNLEtBQUssR0FBRyxNQUFNLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN2QjtJQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVRELGtDQVNDOzs7Ozs7O1VDWEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtaWRkbGV3YXJlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhbmRsZVBvcHVwIH0gZnJvbSBcIi4vcG9wdXBcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGhhbmRsZVBvcHVwOiBoYW5kbGVQb3B1cCB9O1xuIiwiaW1wb3J0IHsgQnJvd3NlckNvbnRleHQsIFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUG9wdXAocGFnZTogUGFnZSwgYnJvd3NlckNvbnRleHQ6IEJyb3dzZXJDb250ZXh0KSB7XG5cdHBhZ2Uub24oXCJwb3B1cFwiLCBhc3luYyAocG9wdXApID0+IHtcblx0XHRjb25zdCBwb3B1cFVybCA9IGF3YWl0IHBvcHVwLnVybCgpO1xuXHRcdHBhZ2UuZXZhbHVhdGUoJ3dpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCInICsgcG9wdXBVcmwgKyAnXCInKTtcblx0XHRjb25zdCBwYWdlcyA9IGF3YWl0IGJyb3dzZXJDb250ZXh0LnBhZ2VzKCk7XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0YXdhaXQgcGFnZXNbaV0uY2xvc2UoKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21pZGRsZXdhcmVzL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==