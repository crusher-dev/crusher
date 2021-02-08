(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
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
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/middlewares/index.ts");
/******/ })()

));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9taWRkbGV3YXJlcy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9taWRkbGV3YXJlcy9wb3B1cC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGlGQUFzQztBQUV0QyxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsV0FBVyxFQUFFLG1CQUFXLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNBOUMsU0FBZ0IsV0FBVyxDQUFDLElBQVUsRUFBRSxjQUE4QjtJQUNyRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDaEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdkI7SUFDRixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFURCxrQ0FTQzs7Ozs7OztVQ1hEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoYW5kbGVQb3B1cCB9IGZyb20gXCIuL3BvcHVwXCI7XG5cbm1vZHVsZS5leHBvcnRzID0geyBoYW5kbGVQb3B1cDogaGFuZGxlUG9wdXAgfTtcbiIsImltcG9ydCB7IEJyb3dzZXJDb250ZXh0LCBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVBvcHVwKHBhZ2U6IFBhZ2UsIGJyb3dzZXJDb250ZXh0OiBCcm93c2VyQ29udGV4dCkge1xuXHRwYWdlLm9uKFwicG9wdXBcIiwgYXN5bmMgKHBvcHVwKSA9PiB7XG5cdFx0Y29uc3QgcG9wdXBVcmwgPSBhd2FpdCBwb3B1cC51cmwoKTtcblx0XHRwYWdlLmV2YWx1YXRlKCd3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiJyArIHBvcHVwVXJsICsgJ1wiJyk7XG5cdFx0Y29uc3QgcGFnZXMgPSBhd2FpdCBicm93c2VyQ29udGV4dC5wYWdlcygpO1xuXHRcdGZvciAobGV0IGkgPSAxOyBpIDwgcGFnZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGF3YWl0IHBhZ2VzW2ldLmNsb3NlKCk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gbW9kdWxlIGV4cG9ydHMgbXVzdCBiZSByZXR1cm5lZCBmcm9tIHJ1bnRpbWUgc28gZW50cnkgaW5saW5pbmcgaXMgZGlzYWJsZWRcbi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xucmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9taWRkbGV3YXJlcy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=