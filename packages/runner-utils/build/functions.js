(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/functions/assertElement.ts":
/*!****************************************!*\
  !*** ./src/functions/assertElement.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
const index_1 = __webpack_require__(/*! ./index */ "./src/functions/index.ts");
async function assertElementAttributes(page, selectors, assertions) {
    await index_1.waitForSelectors(page, selectors);
    const elHandle = await page.$(helper_1.toCrusherSelectorsFormat(selectors));
    let hasPassed = true;
    const logs = [];
    const selector = selectors[0].value;
    for (let i = 0; i < assertions.length; i++) {
        const { validation, operation, field } = assertions[i];
        const elementAttributeValue = await elHandle.getAttribute(field.name);
        if (operation === "matches") {
            if (elementAttributeValue !== validation) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute=" + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute=" + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
        else if (operation === "contains") {
            const doesContain = elementAttributeValue.includes(validation);
            if (!doesContain) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute contains " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute contains " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
        else if (operation === "regex") {
            const rgx = new RegExp(validation);
            if (!rgx.test(elementAttributeValue)) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute matches regex: " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute matches regex: " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
    }
    return [hasPassed, logs];
}
exports.default = assertElementAttributes;


/***/ }),

/***/ "./src/functions/index.ts":
/*!********************************!*\
  !*** ./src/functions/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCrusherSelectorEngine = exports.assertElement = exports.sleep = exports.waitForSelectors = exports.type = exports.scroll = void 0;
const scroll_1 = __importDefault(__webpack_require__(/*! ./scroll */ "./src/functions/scroll.ts"));
exports.scroll = scroll_1.default;
const type_1 = __importDefault(__webpack_require__(/*! ./type */ "./src/functions/type.ts"));
exports.type = type_1.default;
const waitForSelectors_1 = __importDefault(__webpack_require__(/*! ./waitForSelectors */ "./src/functions/waitForSelectors.ts"));
exports.waitForSelectors = waitForSelectors_1.default;
const sleep_1 = __importDefault(__webpack_require__(/*! ./sleep */ "./src/functions/sleep.ts"));
exports.sleep = sleep_1.default;
const assertElement_1 = __importDefault(__webpack_require__(/*! ./assertElement */ "./src/functions/assertElement.ts"));
exports.assertElement = assertElement_1.default;
const registerSelectorEngine_1 = __importDefault(__webpack_require__(/*! ./registerSelectorEngine */ "./src/functions/registerSelectorEngine.ts"));
exports.getCrusherSelectorEngine = registerSelectorEngine_1.default;


/***/ }),

/***/ "./src/functions/registerSelectorEngine.ts":
/*!*************************************************!*\
  !*** ./src/functions/registerSelectorEngine.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getCrusherSelectorEngine() {
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
    return {
        // Returns the first element matching given selector in the root's subtree.
        query(root, selector) {
            const selectorArr = JSON.parse(decodeURIComponent(selector));
            const validSelectorElementInfo = getValidSelectorFromArr(selectorArr);
            return validSelectorElementInfo ? validSelectorElementInfo.element : null;
        },
        // Returns all elements matching given selector in the root's subtree.
        queryAll(root, selector) {
            const selectorArr = JSON.parse(decodeURIComponent(selector));
            const validSelectorElementInfo = getValidSelectorFromArr(selectorArr);
            return validSelectorElementInfo ? Array.from(root.querySelectorAll(validSelectorElementInfo.selector)) : [];
        }
    };
}
;
exports.default = getCrusherSelectorEngine;


/***/ }),

/***/ "./src/functions/scroll.ts":
/*!*********************************!*\
  !*** ./src/functions/scroll.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
async function scroll(page, selectors, scrollDeltaArr, isWindow = true) {
    await page.evaluate(([scrollDeltaArr, selectorKeys, isWindow]) => {
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
        const selectorKeyInfo = getValidSelectorFromArr(selectorKeys);
        if (!selectorKeyInfo && !isWindow)
            throw new Error("No valid selector found");
        const scrollTo = function (element, offset) {
            const fixedOffset = offset.toFixed();
            const onScroll = () => {
                if (element.pageYOffset.toFixed() === fixedOffset) {
                    element.removeEventListener("scroll", onScroll);
                    return true;
                }
                return false;
            };
            element.addEventListener("scroll", onScroll);
            onScroll();
            element.scrollTo({
                top: offset,
                behavior: "smooth",
            });
        };
        const element = isWindow ? window : document.querySelector(selectorKeyInfo.selector);
        for (let i = 0; i < scrollDeltaArr.length; i++) {
            scrollTo(element, scrollDeltaArr[i]);
        }
    }, [scrollDeltaArr, selectors, isWindow]);
}
exports.default = scroll;


/***/ }),

/***/ "./src/functions/sleep.ts":
/*!********************************!*\
  !*** ./src/functions/sleep.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}
exports.default = sleep;


/***/ }),

/***/ "./src/functions/type.ts":
/*!*******************************!*\
  !*** ./src/functions/type.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
async function type(elHandle, keyCodes) {
    for (let i = 0; i < keyCodes.length; i++) {
        await elHandle.press(String.fromCharCode(keyCodes[i]));
    }
    return true;
}
exports.default = type;


/***/ }),

/***/ "./src/functions/waitForSelectors.ts":
/*!*******************************************!*\
  !*** ./src/functions/waitForSelectors.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
async function waitForSelectors(page, selectors) {
    await page.waitForSelector(helper_1.toCrusherSelectorsFormat(selectors), { state: "attached" });
}
exports.default = waitForSelectors;


/***/ }),

/***/ "./src/utils/helper.ts":
/*!*****************************!*\
  !*** ./src/utils/helper.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCrusherSelectorsFormat = exports.generateScreenshotName = void 0;
const generateScreenshotName = (selector, stepIndex) => {
    return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
};
exports.generateScreenshotName = generateScreenshotName;
const toCrusherSelectorsFormat = (selectors) => {
    return `crusher=${encodeURIComponent(JSON.stringify(selectors))}`;
};
exports.toCrusherSelectorsFormat = toCrusherSelectorsFormat;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/functions/index.ts");
/******/ })()

));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3JlZ2lzdGVyU2VsZWN0b3JFbmdpbmUudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3Njcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3R5cGUudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3dhaXRGb3JTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvdXRpbHMvaGVscGVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBR0EscUZBQTJEO0FBQzNELCtFQUEyQztBQUU1QixLQUFLLFVBQVUsdUJBQXVCLENBQUMsSUFBVSxFQUFFLFNBQStCLEVBQUUsVUFBZ0M7SUFDbEksTUFBTSx3QkFBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLGlDQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JC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QUMsZUFBZSxDQUFDLGlDQUF3QixDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDeEYsQ0FBQztBQUxELG1DQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxRQUFnQixFQUFFLFNBQWlCLEVBQVUsRUFBRTtJQUM5RSxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxTQUFTLE1BQU0sQ0FBQztBQUNuRixDQUFDLENBQUM7QUFNTyx3REFBc0I7QUFKL0IsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLFNBQStCLEVBQUUsRUFBRTtJQUNwRSxPQUFPLFdBQVcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDbkUsQ0FBQyxDQUFDO0FBRStCLDREQUF3Qjs7Ozs7OztVQ1Z6RDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7O1VDckJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImZ1bmN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFzc2VydGlvblJvdyB9IGZyb20gJy4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL2Fzc2VydGlvblJvdyc7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4vaW5kZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhc3NlcnRFbGVtZW50QXR0cmlidXRlcyhwYWdlOiBQYWdlLCBzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LCBhc3NlcnRpb25zOiBBcnJheTxpQXNzZXJ0aW9uUm93Pil7XG5cdGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblx0Y29uc3QgZWxIYW5kbGUgPSBhd2FpdCBwYWdlLiQodG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXHRsZXQgaGFzUGFzc2VkID0gdHJ1ZTtcblx0Y29uc3QgbG9ncyA9IFtdO1xuXG5cdGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzWzBdLnZhbHVlO1xuXG5cdGZvcihsZXQgaSA9IDA7IGkgPCBhc3NlcnRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qge3ZhbGlkYXRpb24sIG9wZXJhdGlvbiwgZmllbGR9ID0gYXNzZXJ0aW9uc1tpXTtcblx0XHRjb25zdCBlbGVtZW50QXR0cmlidXRlVmFsdWUgPSBhd2FpdCBlbEhhbmRsZSEuZ2V0QXR0cmlidXRlKGZpZWxkLm5hbWUpO1xuXHRcdGlmKG9wZXJhdGlvbiA9PT0gXCJtYXRjaGVzXCIpIHtcblx0XHRcdGlmKGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSAhPT0gdmFsaWRhdGlvbil7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZT1cIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlPVwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZihvcGVyYXRpb24gPT09IFwiY29udGFpbnNcIikge1xuXHRcdFx0Y29uc3QgZG9lc0NvbnRhaW4gPSAgZWxlbWVudEF0dHJpYnV0ZVZhbHVlIS5pbmNsdWRlcyh2YWxpZGF0aW9uKTtcblx0XHRcdGlmKCFkb2VzQ29udGFpbiApe1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGUgY29udGFpbnMgXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZSBjb250YWlucyBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYob3BlcmF0aW9uID09PSBcInJlZ2V4XCIgKXtcblx0XHRcdGNvbnN0IHJneCA9IG5ldyBSZWdFeHAodmFsaWRhdGlvbik7XG5cdFx0XHRpZiAoIXJneC50ZXN0KGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSEpKSB7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZSBtYXRjaGVzIHJlZ2V4OiBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGUgbWF0Y2hlcyByZWdleDogXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFtoYXNQYXNzZWQsIGxvZ3NdO1xufVxuIiwiaW1wb3J0IHNjcm9sbCBmcm9tIFwiLi9zY3JvbGxcIjtcbmltcG9ydCB0eXBlIGZyb20gXCIuL3R5cGVcIjtcbmltcG9ydCB3YWl0Rm9yU2VsZWN0b3JzIGZyb20gXCIuL3dhaXRGb3JTZWxlY3RvcnNcIjtcbmltcG9ydCBzbGVlcCBmcm9tIFwiLi9zbGVlcFwiO1xuaW1wb3J0IGFzc2VydEVsZW1lbnQgZnJvbSAnLi9hc3NlcnRFbGVtZW50JztcbmltcG9ydCBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmUgZnJvbSAnLi9yZWdpc3RlclNlbGVjdG9yRW5naW5lJztcblxuZXhwb3J0IHsgc2Nyb2xsLCB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzLCBzbGVlcCwgYXNzZXJ0RWxlbWVudCwgZ2V0Q3J1c2hlclNlbGVjdG9yRW5naW5lIH07XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5cbmZ1bmN0aW9uIGdldENydXNoZXJTZWxlY3RvckVuZ2luZSgpIHtcblx0Y29uc3QgZ2V0RWxlbWVudHNCeVhQYXRoID0gKFxuXHRcdHhwYXRoOiBzdHJpbmcsXG5cdFx0cGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG5cdCk6IE5vZGVbXSA9PiB7XG5cdFx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRcdGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0XHR4cGF0aCxcblx0XHRcdHBhcmVudCB8fCBkb2N1bWVudCxcblx0XHRcdG51bGwsXG5cdFx0XHRYUGF0aFJlc3VsdC5PUkRFUkVEX05PREVfU05BUFNIT1RfVFlQRSxcblx0XHRcdG51bGwsXG5cdFx0KTtcblx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcXVlcnkuc25hcHNob3RMZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdFx0Y29uc3QgaXRlbSA9IHF1ZXJ5LnNuYXBzaG90SXRlbShpKTtcblx0XHRcdGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9O1xuXG5cdGNvbnN0IGdlbmVyYXRlUXVlcnlTZWxlY3RvciA9IChlbDogSFRNTEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuXHRcdGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJodG1sXCIpIHJldHVybiBcIkhUTUxcIjtcblx0XHRsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0XHRzdHIgKz0gZWwuaWQgIT0gXCJcIiA/IFwiI1wiICsgZWwuaWQgOiBcIlwiO1xuXHRcdGlmIChlbC5jbGFzc05hbWUpIHtcblx0XHRcdGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHN0ciArPSBcIi5cIiArIGNsYXNzZXNbaV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoKGVsIGFzIGFueSkucGFyZW50Tm9kZSkgKyBcIiA+IFwiICsgc3RyO1xuXHR9O1xuXG5cdGNvbnN0IGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyID0gKHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sIHJvb3Q6IEVsZW1lbnQgfCBEb2N1bWVudCA9IGRvY3VtZW50KSA9PiB7XG5cdFx0Zm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChzZWxlY3Rvci50eXBlID09PSBcInhwYXRoXCIpIHtcblx0XHRcdFx0XHRjb25zdCBlbGVtZW50cyA9IGdldEVsZW1lbnRzQnlYUGF0aChzZWxlY3Rvci52YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoID0gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50c1swXSBhcyBIVE1MRWxlbWVudCxcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdHJldHVybiB7ZWxlbWVudDogZWxlbWVudHNbMF0gYXMgRWxlbWVudCwgc2VsZWN0b3I6IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkpIHtcblx0XHRcdFx0XHRyZXR1cm4ge2VsZW1lbnQ6IHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkhLCBzZWxlY3Rvcjogc2VsZWN0b3IudmFsdWV9O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoe31cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHQvLyBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IG1hdGNoaW5nIGdpdmVuIHNlbGVjdG9yIGluIHRoZSByb290J3Mgc3VidHJlZS5cblx0XHRxdWVyeShyb290OiBFbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvckFyciA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHNlbGVjdG9yKSk7XG5cdFx0XHRjb25zdCB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvckFycik7XG5cblx0XHRcdHJldHVybiB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPyB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8uZWxlbWVudCA6IG51bGw7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIGdpdmVuIHNlbGVjdG9yIGluIHRoZSByb290J3Mgc3VidHJlZS5cblx0XHRxdWVyeUFsbChyb290OiBFbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvckFyciA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHNlbGVjdG9yKSk7XG5cdFx0XHRjb25zdCB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvckFycik7XG5cblx0XHRcdHJldHVybiB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPyBBcnJheS5mcm9tKHJvb3QucXVlcnlTZWxlY3RvckFsbCh2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8uc2VsZWN0b3IpKSA6IFtdO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q3J1c2hlclNlbGVjdG9yRW5naW5lOyIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzY3JvbGwoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sXG5cdHNjcm9sbERlbHRhQXJyOiBBcnJheTxudW1iZXI+LFxuXHRpc1dpbmRvdzogYm9vbGVhbiA9IHRydWVcbikge1xuXHRhd2FpdCBwYWdlLmV2YWx1YXRlKFxuXHRcdCAoW3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcktleXMsIGlzV2luZG93XTogW251bWJlcltdLCBBcnJheTxpU2VsZWN0b3JJbmZvPiwgYm9vbGVhbl0pID0+IHtcblx0XHRcdCBjb25zdCBnZXRFbGVtZW50c0J5WFBhdGggPSAoXG5cdFx0XHRcdCB4cGF0aDogc3RyaW5nLFxuXHRcdFx0XHQgcGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG5cdFx0XHQgKTogTm9kZVtdID0+IHtcblx0XHRcdFx0IGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRcdFx0IGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0XHRcdFx0IHhwYXRoLFxuXHRcdFx0XHRcdCBwYXJlbnQgfHwgZG9jdW1lbnQsXG5cdFx0XHRcdFx0IG51bGwsXG5cdFx0XHRcdFx0IFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLFxuXHRcdFx0XHRcdCBudWxsLFxuXHRcdFx0XHQgKTtcblx0XHRcdFx0IGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0IGNvbnN0IGl0ZW0gPSBxdWVyeS5zbmFwc2hvdEl0ZW0oaSk7XG5cdFx0XHRcdFx0IGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdCB9XG5cdFx0XHRcdCByZXR1cm4gcmVzdWx0cztcblx0XHRcdCB9O1xuXG5cdFx0XHQgY29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdFx0XHRcdCBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaHRtbFwiKSByZXR1cm4gXCJIVE1MXCI7XG5cdFx0XHRcdCBsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0XHRcdFx0IHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdFx0XHRcdCBpZiAoZWwuY2xhc3NOYW1lKSB7XG5cdFx0XHRcdFx0IGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdFx0XHRcdCBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdCBzdHIgKz0gXCIuXCIgKyBjbGFzc2VzW2ldO1xuXHRcdFx0XHRcdCB9XG5cdFx0XHRcdCB9XG5cdFx0XHRcdCByZXR1cm4gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKChlbCBhcyBhbnkpLnBhcmVudE5vZGUpICsgXCIgPiBcIiArIHN0cjtcblx0XHRcdCB9O1xuXG5cdFx0XHQgY29uc3QgZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIgPSAoc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPiwgcm9vdDogRWxlbWVudCB8IERvY3VtZW50ID0gZG9jdW1lbnQpID0+IHtcblx0XHRcdFx0IGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHRcdFx0IHRyeSB7XG5cdFx0XHRcdFx0XHQgaWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdFx0XHQgY29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdFx0XHQgaWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdCBjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdFx0XHQgZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdFx0ICk7XG5cblx0XHRcdFx0XHRcdFx0XHQgcmV0dXJuIHtlbGVtZW50OiBlbGVtZW50c1swXSBhcyBFbGVtZW50LCBzZWxlY3RvcjogZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRofTtcblx0XHRcdFx0XHRcdFx0IH1cblx0XHRcdFx0XHRcdCB9IGVsc2UgaWYgKHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0IHJldHVybiB7ZWxlbWVudDogcm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSEsIHNlbGVjdG9yOiBzZWxlY3Rvci52YWx1ZX07XG5cdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdCB9IGNhdGNoe31cblx0XHRcdFx0IH1cblx0XHRcdFx0IHJldHVybiBudWxsO1xuXHRcdFx0IH07XG5cblx0XHQgXHRjb25zdCBzZWxlY3RvcktleUluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvcktleXMpO1xuXHRcdCBcdGlmKCFzZWxlY3RvcktleUluZm8gJiYgIWlzV2luZG93KSB0aHJvdyBuZXcgRXJyb3IoXCJObyB2YWxpZCBzZWxlY3RvciBmb3VuZFwiKTtcblxuXHRcdFx0Y29uc3Qgc2Nyb2xsVG8gPSAgZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcikge1xuXHRcdFx0XHRjb25zdCBmaXhlZE9mZnNldCA9IG9mZnNldC50b0ZpeGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudCBhcyBhbnkpLnBhZ2VZT2Zmc2V0LnRvRml4ZWQoKSA9PT0gZml4ZWRPZmZzZXQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdG9uU2Nyb2xsKCk7XG5cdFx0XHRcdGVsZW1lbnQuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdHRvcDogb2Zmc2V0LFxuXHRcdFx0XHRcdGJlaGF2aW9yOiBcInNtb290aFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBpc1dpbmRvdz8gd2luZG93IDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcktleUluZm8hLnNlbGVjdG9yKTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzY3JvbGxEZWx0YUFyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHQgc2Nyb2xsVG8oZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgc2Nyb2xsRGVsdGFBcnJbaV0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0W3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcnMsIGlzV2luZG93XSxcblx0KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSwgdGltZSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHR5cGUoXG5cdGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlLFxuXHRrZXlDb2RlczogQXJyYXk8bnVtYmVyPixcbikge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleUNvZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXdhaXQgZWxIYW5kbGUucHJlc3MoU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2Rlc1tpXSkpO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JTZWxlY3RvcnMoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz5cbikge1xuXHRhd2FpdCBwYWdlLndhaXRGb3JTZWxlY3Rvcih0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuXG5jb25zdCBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lID0gKHNlbGVjdG9yOiBzdHJpbmcsIHN0ZXBJbmRleDogbnVtYmVyKTogc3RyaW5nID0+IHtcblx0cmV0dXJuIHNlbGVjdG9yLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgJycpLnJlcGxhY2UoLyAvZywgJ18nKSArIGBfJHtzdGVwSW5kZXh9LnBuZ2A7XG59O1xuXG5jb25zdCB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgPSAoc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPikgPT4ge1xuXHRyZXR1cm4gYGNydXNoZXI9JHtlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc2VsZWN0b3JzKSl9YDtcbn07XG5cbmV4cG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUsIHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBtb2R1bGUgZXhwb3J0cyBtdXN0IGJlIHJldHVybmVkIGZyb20gcnVudGltZSBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5yZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2Z1bmN0aW9ucy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=