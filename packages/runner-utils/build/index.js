/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/actions/addInput.ts":
/*!*********************************!*\
  !*** ./src/actions/addInput.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function addInput(action, page) {
    return new Promise(async (success, error) => {
        const selectors = action.payload.selectors;
        const inputKeys = action.payload.meta.value;
        const selector = await functions_1.waitForSelectors(page, selectors);
        const elementHandle = await page.$(selector);
        if (!elementHandle) {
            return error(`Attempt to press keycodes on element with invalid selector: ${selector}`);
        }
        await elementHandle.scrollIntoViewIfNeeded();
        await functions_1.type(elementHandle, inputKeys);
        return success({
            message: `Pressed keys on the element ${selector}`,
        });
    });
}
exports.default = addInput;


/***/ }),

/***/ "./src/actions/click.ts":
/*!******************************!*\
  !*** ./src/actions/click.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function click(action, page) {
    return new Promise(async (success, error) => {
        const selectors = action.payload.selectors;
        const selector = await functions_1.waitForSelectors(page, selectors);
        const elementHandle = await page.$(selector);
        if (!elementHandle) {
            return error(`No element with selector as ${selector} exists`);
        }
        await elementHandle.scrollIntoViewIfNeeded();
        await elementHandle.dispatchEvent("click");
        // If under navigation wait for load state to complete.
        await page.waitForLoadState();
        return success({
            message: `Clicked on the element ${selector}`,
        });
    });
}
exports.default = click;


/***/ }),

/***/ "./src/actions/elementScreenshot.ts":
/*!******************************************!*\
  !*** ./src/actions/elementScreenshot.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
let screenshotIndex = 0;
function generateScreenshotName(selector) {
    return (selector.replace(/[^\w\s]/gi, "").replace(/ /g, "_") +
        `_${screenshotIndex++}.png`);
}
function elementScreenshot(action, page) {
    return new Promise(async (success, error) => {
        const selectors = action.payload.selectors;
        const selector = await functions_1.waitForSelectors(page, selectors);
        const elementHandle = await page.$(selector);
        if (!elementHandle) {
            return error(`Attempt to capture screenshot of element with invalid selector: ${selector}`);
        }
        await elementHandle.screenshot({
            path: generateScreenshotName(selector),
        });
        return success({
            message: `Captured element screenshot for ${selector}`,
        });
    });
}
exports.default = elementScreenshot;


/***/ }),

/***/ "./src/actions/elementScroll.ts":
/*!**************************************!*\
  !*** ./src/actions/elementScroll.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        const selectors = action.payload.selectors;
        const selector = await functions_1.waitForSelectors(page, selectors);
        if (!selector) {
            return error(`Attempt to scroll element with invalid selector: ${selector}`);
        }
        const scrollDelta = action.payload.meta.value;
        const pageUrl = await page.url();
        await functions_1.scroll(page, selector, scrollDelta);
        return success({
            message: `Scrolled successfully on ${pageUrl}`,
        });
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/hover.ts":
/*!******************************!*\
  !*** ./src/actions/hover.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
async function hover(action, page) {
    return new Promise(async (success, error) => {
        const selectors = action.payload.selectors;
        const selector = await functions_1.waitForSelectors(page, selectors);
        if (!selector)
            return error(`Attempt to hover on element with no valid selector ${selector}`);
        await page.hover(selector);
        return success({
            message: `Hovered on the element ${selector}`,
        });
    });
}
exports.default = hover;


/***/ }),

/***/ "./src/actions/index.ts":
/*!******************************!*\
  !*** ./src/actions/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addInput_1 = __importDefault(__webpack_require__(/*! ./addInput */ "./src/actions/addInput.ts"));
const click_1 = __importDefault(__webpack_require__(/*! ./click */ "./src/actions/click.ts"));
const hover_1 = __importDefault(__webpack_require__(/*! ./hover */ "./src/actions/hover.ts"));
const elementScreenshot_1 = __importDefault(__webpack_require__(/*! ./elementScreenshot */ "./src/actions/elementScreenshot.ts"));
const pageScreenshot_1 = __importDefault(__webpack_require__(/*! ./pageScreenshot */ "./src/actions/pageScreenshot.ts"));
const elementScroll_1 = __importDefault(__webpack_require__(/*! ./elementScroll */ "./src/actions/elementScroll.ts"));
const pageScroll_1 = __importDefault(__webpack_require__(/*! ./pageScroll */ "./src/actions/pageScroll.ts"));
const navigateUrl_1 = __importDefault(__webpack_require__(/*! ./navigateUrl */ "./src/actions/navigateUrl.ts"));
const setDevice_1 = __importDefault(__webpack_require__(/*! ./setDevice */ "./src/actions/setDevice.ts"));
module.exports = {
    Element: {
        addInput: addInput_1.default,
        click: click_1.default,
        hover: hover_1.default,
        scroll: elementScroll_1.default,
        screenshot: elementScreenshot_1.default,
        elementScroll: elementScroll_1.default,
    },
    Page: {
        screenshot: pageScreenshot_1.default,
        scroll: pageScroll_1.default,
        navigate: navigateUrl_1.default,
    },
    Browser: {
        setDevice: setDevice_1.default,
    },
};


/***/ }),

/***/ "./src/actions/navigateUrl.ts":
/*!************************************!*\
  !*** ./src/actions/navigateUrl.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function navigateUrl(action, page) {
    return new Promise(async (success, error) => {
        const urlToGo = action.payload.meta.value;
        await page.goto(urlToGo);
        return success({
            message: `Navigated successfully to ${urlToGo}`,
        });
    });
}
exports.default = navigateUrl;


/***/ }),

/***/ "./src/actions/pageScreenshot.ts":
/*!***************************************!*\
  !*** ./src/actions/pageScreenshot.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
let screenshotIndex = 0;
function generatePageScreenshotName(title) {
    return (title.replace(/[^\\w\\s]/gi, "").replace(/ /g, "_") +
        `_${screenshotIndex++}.png`);
}
function capturePageScreenshot(page) {
    return new Promise(async (success, error) => {
        const pageTitle = await page.title();
        const pageUrl = await page.url();
        await page.screenshot({ path: generatePageScreenshotName(pageTitle) });
        return success({
            message: `Clicked page screenshot for ${pageUrl}`,
        });
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/pageScroll.ts":
/*!***********************************!*\
  !*** ./src/actions/pageScroll.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        const scrollDelta = action.payload.meta.value;
        const pageUrl = await page.url();
        await functions_1.scroll(page, "window", scrollDelta);
        return success({
            message: `Scrolled successfully on ${pageUrl}`,
        });
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/setDevice.ts":
/*!**********************************!*\
  !*** ./src/actions/setDevice.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function setDevice(action) {
    return new Promise(async (success, error) => {
        const device = action.payload.meta.device;
        const userAgent = action.payload.meta.userAgent;
        return success({
            message: "Setup device for testing",
            meta: {
                width: device.width,
                height: device.height,
                userAgent: userAgent.value,
            },
        });
    });
}
exports.default = setDevice;


/***/ }),

/***/ "./src/functions/index.ts":
/*!********************************!*\
  !*** ./src/functions/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.waitForSelectors = exports.type = exports.scroll = void 0;
const scroll_1 = __importDefault(__webpack_require__(/*! ./scroll */ "./src/functions/scroll.ts"));
exports.scroll = scroll_1.default;
const type_1 = __importDefault(__webpack_require__(/*! ./type */ "./src/functions/type.ts"));
exports.type = type_1.default;
const waitForSelectors_1 = __importDefault(__webpack_require__(/*! ./waitForSelectors */ "./src/functions/waitForSelectors.ts"));
exports.waitForSelectors = waitForSelectors_1.default;
const sleep_1 = __importDefault(__webpack_require__(/*! ./sleep */ "./src/functions/sleep.ts"));
exports.sleep = sleep_1.default;


/***/ }),

/***/ "./src/functions/scroll.ts":
/*!*********************************!*\
  !*** ./src/functions/scroll.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function scroll(page, selector, scrollDeltaArr) {
    await page.evaluate(async ([scrollDeltaArr, selectorKey]) => {
        const scrollTo = async function (element, offset) {
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
        const element = selectorKey === "window" ? window : document.querySelector(selectorKey);
        for (let i = 0; i < scrollDeltaArr.length; i++) {
            await scrollTo(element, scrollDeltaArr[i]);
        }
    }, [scrollDeltaArr, selector]);
}
exports.default = scroll;


/***/ }),

/***/ "./src/functions/sleep.ts":
/*!********************************!*\
  !*** ./src/functions/sleep.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = __webpack_require__(/*! ../utils/dom */ "./src/utils/dom.ts");
async function waitForSelectors(page, selectors, defaultSelector = null) {
    if (!defaultSelector) {
        defaultSelector = selectors[0].value;
    }
    try {
        await page.waitForSelector(defaultSelector, { state: "attached" });
        return defaultSelector;
    }
    catch (_a) {
        const validSelector = await page.evaluate((selectors) => {
            for (const selector of selectors) {
                try {
                    if (selector.type === "xpath") {
                        const elements = dom_1.getElementsByXPath(selector.value);
                        if (elements.length) {
                            const elementSelectorFromXpath = dom_1.generateQuerySelector(elements[0]);
                            return elementSelectorFromXpath;
                        }
                    }
                    else if (document.querySelector(selector.value)) {
                        return selector.value;
                    }
                }
                catch (ex) {
                    console.debug("Caught exception", ex);
                }
            }
            return null;
        }, selectors);
        if (typeof validSelector === "undefined") {
            throw new Error("This is not working");
        }
        return validSelector;
    }
}
exports.default = waitForSelectors;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
const actions = __importStar(__webpack_require__(/*! ./actions */ "./src/actions/index.ts"));
module.exports = actions;


/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuerySelector = exports.getElementsByXPath = void 0;
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvYWRkSW5wdXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvY2xpY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvZWxlbWVudFNjcmVlbnNob3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvZWxlbWVudFNjcm9sbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9ob3Zlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9uYXZpZ2F0ZVVybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9wYWdlU2NyZWVuc2hvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9wYWdlU2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3NldERldmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZnVuY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Z1bmN0aW9ucy90eXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFD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QztJQUNyQixHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdEMsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLEdBQUcsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hCO0tBQ0Q7SUFDRCxPQUFPLHFCQUFxQixDQUFFLEVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3BFLENBQUMsQ0FBQztBQUUyQixzREFBcUIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZElucHV0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRjb25zdCBpbnB1dEtleXMgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yIGFzIHN0cmluZyk7XG5cdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXG5cdFx0XHRcdGBBdHRlbXB0IHRvIHByZXNzIGtleWNvZGVzIG9uIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWAsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdGF3YWl0IHR5cGUoZWxlbWVudEhhbmRsZSwgaW5wdXRLZXlzKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBQcmVzc2VkIGtleXMgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdH0pO1xuXHR9KTtcbn1cbiIsImltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsaWNrKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQoc2VsZWN0b3IgYXMgc3RyaW5nKTtcblx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdHJldHVybiBlcnJvcihgTm8gZWxlbWVudCB3aXRoIHNlbGVjdG9yIGFzICR7c2VsZWN0b3J9IGV4aXN0c2ApO1xuXHRcdH1cblxuXHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuZGlzcGF0Y2hFdmVudChcImNsaWNrXCIpO1xuXG5cdFx0Ly8gSWYgdW5kZXIgbmF2aWdhdGlvbiB3YWl0IGZvciBsb2FkIHN0YXRlIHRvIGNvbXBsZXRlLlxuXHRcdGF3YWl0IHBhZ2Uud2FpdEZvckxvYWRTdGF0ZSgpO1xuXG5cdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0bWVzc2FnZTogYENsaWNrZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdH0pO1xuXHR9KTtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5cbmxldCBzY3JlZW5zaG90SW5kZXggPSAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lKHNlbGVjdG9yOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdHNlbGVjdG9yLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgXCJcIikucmVwbGFjZSgvIC9nLCBcIl9cIikgK1xuXHRcdGBfJHtzY3JlZW5zaG90SW5kZXgrK30ucG5nYFxuXHQpO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudFNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3RvciBhcyBzdHJpbmcpO1xuXHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0cmV0dXJuIGVycm9yKFxuXHRcdFx0XHRgQXR0ZW1wdCB0byBjYXB0dXJlIHNjcmVlbnNob3Qgb2YgZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCxcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5zY3JlZW5zaG90KHtcblx0XHRcdHBhdGg6IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUoc2VsZWN0b3IgYXMgc3RyaW5nKSxcblx0XHR9KTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBDYXB0dXJlZCBlbGVtZW50IHNjcmVlbnNob3QgZm9yICR7c2VsZWN0b3J9YCxcblx0XHR9KTtcblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgc2Nyb2xsLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRpZiAoIXNlbGVjdG9yKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gc2Nyb2xsIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNjcm9sbERlbHRhID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRhd2FpdCBzY3JvbGwocGFnZSwgc2VsZWN0b3IsIHNjcm9sbERlbHRhKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0fSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaG92ZXIoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0aWYgKCFzZWxlY3Rvcilcblx0XHRcdHJldHVybiBlcnJvcihcblx0XHRcdFx0YEF0dGVtcHQgdG8gaG92ZXIgb24gZWxlbWVudCB3aXRoIG5vIHZhbGlkIHNlbGVjdG9yICR7c2VsZWN0b3J9YCxcblx0XHRcdCk7XG5cblx0XHRhd2FpdCBwYWdlLmhvdmVyKHNlbGVjdG9yKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBIb3ZlcmVkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3J9YCxcblx0XHR9KTtcblx0fSk7XG59XG4iLCJpbXBvcnQgYWRkSW5wdXQgZnJvbSBcIi4vYWRkSW5wdXRcIjtcbmltcG9ydCBjbGljayBmcm9tIFwiLi9jbGlja1wiO1xuaW1wb3J0IGhvdmVyIGZyb20gXCIuL2hvdmVyXCI7XG5pbXBvcnQgY2FwdHVyZUVsZW1lbnRTY3JlZW5zaG90IGZyb20gXCIuL2VsZW1lbnRTY3JlZW5zaG90XCI7XG5pbXBvcnQgY2FwdHVyZVBhZ2VTY3JlZW5zaG90IGZyb20gXCIuL3BhZ2VTY3JlZW5zaG90XCI7XG5pbXBvcnQgZWxlbWVudFNjcm9sbCBmcm9tIFwiLi9lbGVtZW50U2Nyb2xsXCI7XG5pbXBvcnQgcGFnZVNjcm9sbCBmcm9tIFwiLi9wYWdlU2Nyb2xsXCI7XG5pbXBvcnQgbmF2aWdhdGVVcmwgZnJvbSBcIi4vbmF2aWdhdGVVcmxcIjtcbmltcG9ydCBzZXREZXZpY2UgZnJvbSBcIi4vc2V0RGV2aWNlXCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRFbGVtZW50OiB7XG5cdFx0YWRkSW5wdXQsXG5cdFx0Y2xpY2ssXG5cdFx0aG92ZXIsXG5cdFx0c2Nyb2xsOiBlbGVtZW50U2Nyb2xsLFxuXHRcdHNjcmVlbnNob3Q6IGNhcHR1cmVFbGVtZW50U2NyZWVuc2hvdCxcblx0XHRlbGVtZW50U2Nyb2xsLFxuXHR9LFxuXHRQYWdlOiB7XG5cdFx0c2NyZWVuc2hvdDogY2FwdHVyZVBhZ2VTY3JlZW5zaG90LFxuXHRcdHNjcm9sbDogcGFnZVNjcm9sbCxcblx0XHRuYXZpZ2F0ZTogbmF2aWdhdGVVcmwsXG5cdH0sXG5cdEJyb3dzZXI6IHtcblx0XHRzZXREZXZpY2UsXG5cdH0sXG59O1xuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gbmF2aWdhdGVVcmwoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHRjb25zdCB1cmxUb0dvID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdGF3YWl0IHBhZ2UuZ290byh1cmxUb0dvKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBOYXZpZ2F0ZWQgc3VjY2Vzc2Z1bGx5IHRvICR7dXJsVG9Hb31gLFxuXHRcdH0pO1xuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuXG5sZXQgc2NyZWVuc2hvdEluZGV4ID0gMDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVQYWdlU2NyZWVuc2hvdE5hbWUodGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0dGl0bGUucmVwbGFjZSgvW15cXFxcd1xcXFxzXS9naSwgXCJcIikucmVwbGFjZSgvIC9nLCBcIl9cIikgK1xuXHRcdGBfJHtzY3JlZW5zaG90SW5kZXgrK30ucG5nYFxuXHQpO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FwdHVyZVBhZ2VTY3JlZW5zaG90KHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdGNvbnN0IHBhZ2VUaXRsZSA9IGF3YWl0IHBhZ2UudGl0bGUoKTtcblx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRhd2FpdCBwYWdlLnNjcmVlbnNob3QoeyBwYXRoOiBnZW5lcmF0ZVBhZ2VTY3JlZW5zaG90TmFtZShwYWdlVGl0bGUpIH0pO1xuXG5cdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0bWVzc2FnZTogYENsaWNrZWQgcGFnZSBzY3JlZW5zaG90IGZvciAke3BhZ2VVcmx9YCxcblx0XHR9KTtcblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgc2Nyb2xsIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0YXdhaXQgc2Nyb2xsKHBhZ2UsIFwid2luZG93XCIsIHNjcm9sbERlbHRhKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0fSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpRGV2aWNlIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9leHRlbnNpb24vZGV2aWNlXCI7XG5pbXBvcnQgeyBpVXNlckFnZW50IH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC9jb25zdGFudHMvdXNlckFnZW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzZXREZXZpY2UoYWN0aW9uOiBpQWN0aW9uKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHRjb25zdCBkZXZpY2UgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLmRldmljZSBhcyBpRGV2aWNlO1xuXHRcdGNvbnN0IHVzZXJBZ2VudCA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudXNlckFnZW50IGFzIGlVc2VyQWdlbnQ7XG5cblx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRtZXNzYWdlOiBcIlNldHVwIGRldmljZSBmb3IgdGVzdGluZ1wiLFxuXHRcdFx0bWV0YToge1xuXHRcdFx0XHR3aWR0aDogZGV2aWNlLndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IGRldmljZS5oZWlnaHQsXG5cdFx0XHRcdHVzZXJBZ2VudDogdXNlckFnZW50LnZhbHVlLFxuXHRcdFx0fSxcblx0XHR9KTtcblx0fSk7XG59XG4iLCJpbXBvcnQgc2Nyb2xsIGZyb20gXCIuL3Njcm9sbFwiO1xuaW1wb3J0IHR5cGUgZnJvbSBcIi4vdHlwZVwiO1xuaW1wb3J0IHdhaXRGb3JTZWxlY3RvcnMgZnJvbSBcIi4vd2FpdEZvclNlbGVjdG9yc1wiO1xuaW1wb3J0IHNsZWVwIGZyb20gXCIuL3NsZWVwXCI7XG5cbmV4cG9ydCB7IHNjcm9sbCwgdHlwZSwgd2FpdEZvclNlbGVjdG9ycywgc2xlZXAgfTtcbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzY3JvbGwoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yOiBzdHJpbmcsXG5cdHNjcm9sbERlbHRhQXJyOiBBcnJheTxudW1iZXI+LFxuKSB7XG5cdGF3YWl0IHBhZ2UuZXZhbHVhdGUoXG5cdFx0YXN5bmMgKFtzY3JvbGxEZWx0YUFyciwgc2VsZWN0b3JLZXldOiBbbnVtYmVyW10sIHN0cmluZ10pID0+IHtcblx0XHRcdGNvbnN0IHNjcm9sbFRvID0gYXN5bmMgZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcikge1xuXHRcdFx0XHRjb25zdCBmaXhlZE9mZnNldCA9IG9mZnNldC50b0ZpeGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudCBhcyBhbnkpLnBhZ2VZT2Zmc2V0LnRvRml4ZWQoKSA9PT0gZml4ZWRPZmZzZXQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdG9uU2Nyb2xsKCk7XG5cdFx0XHRcdGVsZW1lbnQuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdHRvcDogb2Zmc2V0LFxuXHRcdFx0XHRcdGJlaGF2aW9yOiBcInNtb290aFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPVxuXHRcdFx0XHRzZWxlY3RvcktleSA9PT0gXCJ3aW5kb3dcIiA/IHdpbmRvdyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JLZXkpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNjcm9sbERlbHRhQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGF3YWl0IHNjcm9sbFRvKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHNjcm9sbERlbHRhQXJyW2ldKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFtzY3JvbGxEZWx0YUFyciwgc2VsZWN0b3JdLFxuXHQpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2xlZXAodGltZTogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHR9LCB0aW1lKTtcblx0fSk7XG59XG4iLCJpbXBvcnQgeyBFbGVtZW50SGFuZGxlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gdHlwZShcblx0ZWxIYW5kbGU6IEVsZW1lbnRIYW5kbGUsXG5cdGtleUNvZGVzOiBBcnJheTxudW1iZXI+LFxuKSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwga2V5Q29kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRhd2FpdCBlbEhhbmRsZS5wcmVzcyhTdHJpbmcuZnJvbUNoYXJDb2RlKGtleUNvZGVzW2ldKSk7XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yLCBnZXRFbGVtZW50c0J5WFBhdGggfSBmcm9tIFwiLi4vdXRpbHMvZG9tXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JTZWxlY3RvcnMoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sXG5cdGRlZmF1bHRTZWxlY3RvciA9IG51bGwgYXMgc3RyaW5nIHwgbnVsbCxcbikge1xuXHRpZiAoIWRlZmF1bHRTZWxlY3Rvcikge1xuXHRcdGRlZmF1bHRTZWxlY3RvciA9IHNlbGVjdG9yc1swXS52YWx1ZTtcblx0fVxuXG5cdHRyeSB7XG5cdFx0YXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IoZGVmYXVsdFNlbGVjdG9yLCB7IHN0YXRlOiBcImF0dGFjaGVkXCIgfSk7XG5cdFx0cmV0dXJuIGRlZmF1bHRTZWxlY3Rvcjtcblx0fSBjYXRjaCB7XG5cdFx0Y29uc3QgdmFsaWRTZWxlY3RvciA9IGF3YWl0IHBhZ2UuZXZhbHVhdGUoKHNlbGVjdG9ycykgPT4ge1xuXHRcdFx0Zm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAoc2VsZWN0b3IudHlwZSA9PT0gXCJ4cGF0aFwiKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50cyA9IGdldEVsZW1lbnRzQnlYUGF0aChzZWxlY3Rvci52YWx1ZSk7XG5cdFx0XHRcdFx0XHRpZiAoZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aCA9IGdlbmVyYXRlUXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0XHRlbGVtZW50c1swXSBhcyBIVE1MRWxlbWVudCxcblx0XHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzZWxlY3Rvci52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhcIkNhdWdodCBleGNlcHRpb25cIiwgZXgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9LCBzZWxlY3RvcnMpO1xuXHRcdGlmICh0eXBlb2YgdmFsaWRTZWxlY3RvciA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhpcyBpcyBub3Qgd29ya2luZ1wiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbGlkU2VsZWN0b3I7XG5cdH1cbn1cbiIsImltcG9ydCAqICBhcyBhY3Rpb25zIGZyb20gXCIuL2FjdGlvbnNcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBhY3Rpb25zO1xuIiwiY29uc3QgZ2V0RWxlbWVudHNCeVhQYXRoID0gKFxuXHR4cGF0aDogc3RyaW5nLFxuXHRwYXJlbnQ6IE5vZGUgfCBudWxsID0gbnVsbCxcbik6IE5vZGVbXSA9PiB7XG5cdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0Y29uc3QgcXVlcnkgPSBkb2N1bWVudC5ldmFsdWF0ZShcblx0XHR4cGF0aCxcblx0XHRwYXJlbnQgfHwgZG9jdW1lbnQsXG5cdFx0bnVsbCxcblx0XHRYUGF0aFJlc3VsdC5PUkRFUkVEX05PREVfU05BUFNIT1RfVFlQRSxcblx0XHRudWxsLFxuXHQpO1xuXHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcXVlcnkuc25hcHNob3RMZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdGNvbnN0IGl0ZW0gPSBxdWVyeS5zbmFwc2hvdEl0ZW0oaSk7XG5cdFx0aWYgKGl0ZW0pIHJlc3VsdHMucHVzaChpdGVtKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cbmNvbnN0IGdlbmVyYXRlUXVlcnlTZWxlY3RvciA9IChlbDogSFRNTEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuXHRpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaHRtbFwiKSByZXR1cm4gXCJIVE1MXCI7XG5cdGxldCBzdHIgPSBlbC50YWdOYW1lO1xuXHRzdHIgKz0gZWwuaWQgIT0gXCJcIiA/IFwiI1wiICsgZWwuaWQgOiBcIlwiO1xuXHRpZiAoZWwuY2xhc3NOYW1lKSB7XG5cdFx0Y29uc3QgY2xhc3NlcyA9IGVsLmNsYXNzTmFtZS5zcGxpdCgvXFxzLyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzdHIgKz0gXCIuXCIgKyBjbGFzc2VzW2ldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKChlbCBhcyBhbnkpLnBhcmVudE5vZGUpICsgXCIgPiBcIiArIHN0cjtcbn07XG5cbmV4cG9ydCB7IGdldEVsZW1lbnRzQnlYUGF0aCwgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yIH07XG4iXSwic291cmNlUm9vdCI6IiJ9