/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getValidSelectorFromArr = exports.generateQuerySelector = exports.getElementsByXPath = void 0;
;
const getValidSelectorFromArr = (selectors, root = document) => {
    for (const selector of selectors) {
        try {
            if (selector.type === "xpath") {
                const elements = getElementsByXPath(selector.value);
                if (elements.length) {
                    const elementSelectorFromXpath = generateQuerySelector(elements[0]);
                    return { element: elements[0], selector: elementSelectorFromXpath };
                }
            }
            else if (root.querySelector(selector.value)) {
                return { element: root.querySelector(selector.value), selector: selector.value };
            }
        }
        catch (_a) { }
    }
    return null;
};
exports.getValidSelectorFromArr = getValidSelectorFromArr;
const getElementsByXPath = (xpath, parent = null) => {
    const results = [];
    const query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        const item = query.snapshotItem(i);
        if (item)
            results.push(item);
    }
    return results;
};
exports.getElementsByXPath = getElementsByXPath;
const generateQuerySelector = (el) => {
    if (el.tagName.toLowerCase() == "html")
        return "HTML";
    let str = el.tagName;
    str += el.id != "" ? "#" + el.id : "";
    if (el.className) {
        const classes = el.className.split(/\s/);
        for (let i = 0; i < classes.length; i++) {
            str += "." + classes[i];
        }
    }
    return generateQuerySelector(el.parentNode) + " > " + str;
};
exports.generateQuerySelector = generateQuerySelector;


/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const dom = __importStar(__webpack_require__(/*! ./dom */ "./src/utils/dom.ts"));
module.exports = {
    dom,
};


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/utils/index.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy91dGlscy9kb20udHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvdXRpbHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFLQyxDQUFDO0FBRUYsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLFNBQStCLEVBQUUsT0FBMkIsUUFBUSxFQUFpQyxFQUFFO0lBQ3ZJLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO1FBQ2pDLElBQUk7WUFDSCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUM5QixNQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BELElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDcEIsTUFBTSx3QkFBd0IsR0FBRyxxQkFBcUIsQ0FDckQsUUFBUSxDQUFDLENBQUMsQ0FBZ0IsQ0FDMUIsQ0FBQztvQkFFRixPQUFPLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQVksRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUMsQ0FBQztpQkFDN0U7YUFDRDtpQkFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM5QyxPQUFPLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFDLENBQUM7YUFDaEY7U0FDRDtRQUFDLFdBQUssR0FBRTtLQUNUO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDYixDQUFDLENBQUM7QUFrQ2tELDBEQUF1QjtBQWhDM0UsTUFBTSxrQkFBa0IsR0FBRyxDQUMxQixLQUFhLEVBQ2IsU0FBc0IsSUFBSSxFQUNqQixFQUFFO0lBQ1gsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQzlCLEtBQUssRUFDTCxNQUFNLElBQUksUUFBUSxFQUNsQixJQUFJLEVBQ0osV0FBVyxDQUFDLDBCQUEwQixFQUN0QyxJQUFJLENBQ0osQ0FBQztJQUNGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDL0QsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLElBQUk7WUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBZU8sZ0RBQWtCO0FBYjNCLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxFQUFlLEVBQVUsRUFBRTtJQUN6RCxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksTUFBTTtRQUFFLE9BQU8sTUFBTSxDQUFDO0lBQ3RELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDckIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RDLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRTtRQUNqQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxHQUFHLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QjtLQUNEO0lBQ0QsT0FBTyxxQkFBcUIsQ0FBRSxFQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNwRSxDQUFDLENBQUM7QUFFMkIsc0RBQXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNEbEQsaUZBQTZCO0FBRTdCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDaEIsR0FBRztDQUNILENBQUM7Ozs7Ozs7VUNKRjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJy4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5cbmludGVyZmFjZSBpVmFsaWRTZWxlY3RvckVsZW1lbnQge1xuXHRlbGVtZW50OiBFbGVtZW50LFxuXHRzZWxlY3Rvcjogc3RyaW5nXG59O1xuXG5jb25zdCBnZXRWYWxpZFNlbGVjdG9yRnJvbUFyciA9IChzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LCByb290OiBFbGVtZW50IHwgRG9jdW1lbnQgPSBkb2N1bWVudCkgOiBpVmFsaWRTZWxlY3RvckVsZW1lbnQgfCBudWxsID0+IHtcblx0Zm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRjb25zdCBlbGVtZW50cyA9IGdldEVsZW1lbnRzQnlYUGF0aChzZWxlY3Rvci52YWx1ZSk7XG5cdFx0XHRcdGlmIChlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRlbGVtZW50c1swXSBhcyBIVE1MRWxlbWVudCxcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHtlbGVtZW50OiBlbGVtZW50c1swXSBhcyBFbGVtZW50LCBzZWxlY3RvcjogZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRofTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChyb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiB7ZWxlbWVudDogcm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSEsIHNlbGVjdG9yOiBzZWxlY3Rvci52YWx1ZX07XG5cdFx0XHR9XG5cdFx0fSBjYXRjaHt9XG5cdH1cblx0cmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBnZXRFbGVtZW50c0J5WFBhdGggPSAoXG5cdHhwYXRoOiBzdHJpbmcsXG5cdHBhcmVudDogTm9kZSB8IG51bGwgPSBudWxsLFxuKTogTm9kZVtdID0+IHtcblx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRjb25zdCBxdWVyeSA9IGRvY3VtZW50LmV2YWx1YXRlKFxuXHRcdHhwYXRoLFxuXHRcdHBhcmVudCB8fCBkb2N1bWVudCxcblx0XHRudWxsLFxuXHRcdFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLFxuXHRcdG51bGwsXG5cdCk7XG5cdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0Y29uc3QgaXRlbSA9IHF1ZXJ5LnNuYXBzaG90SXRlbShpKTtcblx0XHRpZiAoaXRlbSkgcmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHR9XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuY29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJodG1sXCIpIHJldHVybiBcIkhUTUxcIjtcblx0bGV0IHN0ciA9IGVsLnRhZ05hbWU7XG5cdHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdGlmIChlbC5jbGFzc05hbWUpIHtcblx0XHRjb25zdCBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLnNwbGl0KC9cXHMvKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHN0ciArPSBcIi5cIiArIGNsYXNzZXNbaV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoKGVsIGFzIGFueSkucGFyZW50Tm9kZSkgKyBcIiA+IFwiICsgc3RyO1xufTtcblxuZXhwb3J0IHsgZ2V0RWxlbWVudHNCeVhQYXRoLCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IsIGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyIH07XG4iLCJpbXBvcnQgKiBhcyBkb20gZnJvbSAnLi9kb20nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0ZG9tLFxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy91dGlscy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=