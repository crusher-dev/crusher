(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/actions/addInput.ts":
/*!*********************************!*\
  !*** ./src/actions/addInput.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function addInput(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const inputKeys = action.payload.meta.value;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`Attempt to press keycodes on element with invalid selector: ${selector}`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await functions_1.type(elementHandle, inputKeys);
            return success({
                message: `Pressed keys on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while adding input to element");
        }
    });
}
exports.default = addInput;


/***/ }),

/***/ "./src/actions/assertElement.ts":
/*!**************************************!*\
  !*** ./src/actions/assertElement.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const functions_2 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function assert(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_2.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const validationRows = action.payload.meta.validationRows;
            const output = await functions_1.assertElement(page, selector, validationRows);
            return success({
                message: `Successfully asserted element ${selector}`,
                meta: { output }
            });
        }
        catch (err) {
            console.error(err);
            return error("Some issue occurred while asserting element");
        }
    });
}
exports.default = assert;


/***/ }),

/***/ "./src/actions/click.ts":
/*!******************************!*\
  !*** ./src/actions/click.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function click(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
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
        }
        catch (err) {
            return error("Some issue occurred while clicking on element");
        }
    });
}
exports.default = click;


/***/ }),

/***/ "./src/actions/elementCustomScript.ts":
/*!********************************************!*\
  !*** ./src/actions/elementCustomScript.ts ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
var __filename = "/index.js";
var __dirname = "/";
/* module decorator */ module = __webpack_require__.nmd(module);

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runScriptOnElement = void 0;
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const runScriptOnElement = (script, elHandle) => {
    return new Function('exports', 'require', 'module', '__filename', '__dirname', 'script', 'elHandle', `return new Promise(async function (resolve, reject) {
				    try{
				        const scriptFunction = ${script};
				        console.log(scriptFunction);
				        resolve(scriptFunction(elHandle));
				    } catch(err){
				      reject(err);
				    }
				});`)(exports, __webpack_require__("./src/actions sync recursive"), module, __filename, __dirname, script, elHandle);
};
exports.runScriptOnElement = runScriptOnElement;
function elementCustomScript(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== 'string') {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`Attempt to capture screenshot of element with invalid selector: ${selector}`);
            }
            const customScript = action.payload.meta.script;
            const scriptOutput = await exports.runScriptOnElement(customScript, elementHandle);
            if (!!scriptOutput) {
                return success({
                    message: `Clicked on the element ${selector}`,
                });
            }
            else {
                return error(`Assertion failed according to the script with output: ${JSON.stringify(scriptOutput)}`);
            }
        }
        catch (err) {
            console.error(err);
            return error("Some issue occurred while running script on element");
        }
    });
}
exports.default = elementCustomScript;


/***/ }),

/***/ "./src/actions/elementScreenshot.ts":
/*!******************************************!*\
  !*** ./src/actions/elementScreenshot.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
function elementScreenshot(action, page, stepIndex) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== 'string') {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`Attempt to capture screenshot of element with invalid selector: ${selector}`);
            }
            const elementScreenshotBuffer = await elementHandle.screenshot();
            return success({
                message: `Captured element screenshot for ${selector}`,
                output: { name: helper_1.generateScreenshotName(selector, stepIndex), value: elementScreenshotBuffer },
            });
        }
        catch (err) {
            return error('Some issue occurred while capturing screenshot of element');
        }
    });
}
exports.default = elementScreenshot;


/***/ }),

/***/ "./src/actions/elementScroll.ts":
/*!**************************************!*\
  !*** ./src/actions/elementScroll.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            if (!selector) {
                return error(`Attempt to scroll element with invalid selector: ${selector}`);
            }
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, selector, scrollDelta);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while scrolling on element");
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/hover.ts":
/*!******************************!*\
  !*** ./src/actions/hover.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
async function hover(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            await page.hover(selector);
            return success({
                message: `Hovered on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while hovering on element");
        }
    });
}
exports.default = hover;


/***/ }),

/***/ "./src/actions/index.ts":
/*!******************************!*\
  !*** ./src/actions/index.ts ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const addInput_1 = __importDefault(__webpack_require__(/*! ./addInput */ "./src/actions/addInput.ts"));
const click_1 = __importDefault(__webpack_require__(/*! ./click */ "./src/actions/click.ts"));
const hover_1 = __importDefault(__webpack_require__(/*! ./hover */ "./src/actions/hover.ts"));
const elementScreenshot_1 = __importDefault(__webpack_require__(/*! ./elementScreenshot */ "./src/actions/elementScreenshot.ts"));
const pageScreenshot_1 = __importDefault(__webpack_require__(/*! ./pageScreenshot */ "./src/actions/pageScreenshot.ts"));
const elementScroll_1 = __importDefault(__webpack_require__(/*! ./elementScroll */ "./src/actions/elementScroll.ts"));
const pageScroll_1 = __importDefault(__webpack_require__(/*! ./pageScroll */ "./src/actions/pageScroll.ts"));
const navigateUrl_1 = __importDefault(__webpack_require__(/*! ./navigateUrl */ "./src/actions/navigateUrl.ts"));
const setDevice_1 = __importDefault(__webpack_require__(/*! ./setDevice */ "./src/actions/setDevice.ts"));
const assertElement_1 = __importDefault(__webpack_require__(/*! ./assertElement */ "./src/actions/assertElement.ts"));
const elementCustomScript_1 = __importDefault(__webpack_require__(/*! ./elementCustomScript */ "./src/actions/elementCustomScript.ts"));
module.exports = {
    Element: {
        addInput: addInput_1.default,
        click: click_1.default,
        hover: hover_1.default,
        scroll: elementScroll_1.default,
        screenshot: elementScreenshot_1.default,
        elementScroll: elementScroll_1.default,
        assertElement: assertElement_1.default,
        runCustomScript: elementCustomScript_1.default
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
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
async function navigateUrl(action, page) {
    return new Promise(async (success, error) => {
        try {
            const urlToGo = action.payload.meta.value;
            await page.goto(urlToGo);
            return success({
                message: `Navigated successfully to ${urlToGo}`,
            });
        }
        catch (err) {
            console.error(err);
            return error('Some issue occurred while navigating to webpage');
        }
    });
}
exports.default = navigateUrl;


/***/ }),

/***/ "./src/actions/pageScreenshot.ts":
/*!***************************************!*\
  !*** ./src/actions/pageScreenshot.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
function capturePageScreenshot(page, stepIndex) {
    return new Promise(async (success, error) => {
        try {
            const pageTitle = await page.title();
            const pageUrl = await page.url();
            const screenshotBuffer = await page.screenshot();
            return success({
                message: `Clicked page screenshot for ${pageUrl}`,
                output: { name: helper_1.generateScreenshotName(pageTitle, stepIndex), value: screenshotBuffer },
            });
        }
        catch (err) {
            return error('Some issue occurred while capturing screenshot of page');
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/pageScroll.ts":
/*!***********************************!*\
  !*** ./src/actions/pageScroll.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        try {
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, "window", scrollDelta);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while scrolling the page");
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/setDevice.ts":
/*!**********************************!*\
  !*** ./src/actions/setDevice.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
async function setDevice(action) {
    return new Promise(async (success, error) => {
        try {
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
        }
        catch (err) {
            return error("Some issue occurred while setting the device");
        }
    });
}
exports.default = setDevice;


/***/ }),

/***/ "./src/functions/assertElement.ts":
/*!****************************************!*\
  !*** ./src/functions/assertElement.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
async function assertElementAttributes(page, selector, assertions) {
    const elHandle = await page.$(selector);
    let hasPassed = true;
    const logs = [];
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

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertElement = exports.sleep = exports.waitForSelectors = exports.type = exports.scroll = void 0;
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


/***/ }),

/***/ "./src/functions/scroll.ts":
/*!*********************************!*\
  !*** ./src/functions/scroll.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
async function scroll(page, selector, scrollDeltaArr) {
    await page.evaluate(([scrollDeltaArr, selectorKey]) => {
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
        const element = selectorKey === "window" ? window : document.querySelector(selectorKey);
        for (let i = 0; i < scrollDeltaArr.length; i++) {
            scrollTo(element, scrollDeltaArr[i]);
        }
    }, [scrollDeltaArr, selector]);
}
exports.default = scroll;


/***/ }),

/***/ "./src/functions/sleep.ts":
/*!********************************!*\
  !*** ./src/functions/sleep.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

"use strict";

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

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const dom_1 = __webpack_require__(/*! ../utils/dom */ "./src/utils/dom.ts");
async function getValidSelectorFromDOM(page, selectors) {
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
    return validSelector;
}
;
async function waitForSelectors(page, selectors, defaultSelector = null) {
    if (!defaultSelector) {
        defaultSelector = selectors[0].value;
    }
    try {
        const validSelector = await getValidSelectorFromDOM(page, selectors);
        if (validSelector) {
            return validSelector;
        }
        await page.waitForSelector(defaultSelector, { state: "attached" });
        return defaultSelector;
    }
    catch (_a) {
        const validSelector = await getValidSelectorFromDOM(page, selectors);
        if (typeof validSelector === "undefined") {
            throw new Error("This is not working");
        }
        return validSelector;
    }
}
exports.default = waitForSelectors;


/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ }),

/***/ "./src/utils/helper.ts":
/*!*****************************!*\
  !*** ./src/utils/helper.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateScreenshotName = void 0;
const generateScreenshotName = (selector, stepIndex) => {
    return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
};
exports.generateScreenshotName = generateScreenshotName;


/***/ }),

/***/ "./src/actions sync recursive":
/*!***************************!*\
  !*** ./src/actions/ sync ***!
  \***************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./src/actions sync recursive";
module.exports = webpackEmptyContext;

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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/actions/index.ts");
/******/ })()

));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2FkZElucHV0LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2NsaWNrLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudEN1c3RvbVNjcmlwdC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudFNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvYWN0aW9ucy9uYXZpZ2F0ZVVybC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvcGFnZVNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3NldERldmljZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3Njcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3R5cGUudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3dhaXRGb3JTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvdXRpbHMvZG9tLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL3V0aWxzL2hlbHBlci50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zfHN5bmMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBR0Esd0ZBQXNEO0FBRXRELFNBQXdCLFFBQVEsQ0FBQyxNQUFlLEVBQUUsSUFBVTtJQUMzRCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDM0MsSUFBSTtZQUNILE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBNEIsQ0FBQztZQUM5RCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFL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c0IsR0FBRyxDQUFDLFFBQWdCLEVBQUUsU0FBaUIsRUFBVSxFQUFFO0lBQzlFLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLFNBQVMsTUFBTSxDQUFDO0FBQ25GLENBQUMsQ0FBQztBQUVPLHdEQUFzQjs7Ozs7Ozs7Ozs7QUNKL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDOzs7Ozs7VUNSQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3hCQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEU7Ozs7VUNKQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJhY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgdHlwZSwgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkSW5wdXQoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IGlucHV0S2V5cyA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQoc2VsZWN0b3IgYXMgc3RyaW5nKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoXG5cdFx0XHRcdFx0YEF0dGVtcHQgdG8gcHJlc3Mga2V5Y29kZXMgb24gZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCxcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG5cdFx0XHRhd2FpdCB0eXBlKGVsZW1lbnRIYW5kbGUsIGlucHV0S2V5cyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFByZXNzZWQga2V5cyBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGFkZGluZyBpbnB1dCB0byBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCIgaW1wb3J0IHthc3NlcnRFbGVtZW50fSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG4gaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbiBpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbiBpbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuIGltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbiBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhc3NlcnQoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0IHRyeXtcblx0XHRcdCBjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0IGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHQgaWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRcdCByZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdCB9XG5cblx0XHRcdCBjb25zdCB2YWxpZGF0aW9uUm93cyA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsaWRhdGlvblJvd3M7XG5cdFx0XHQgY29uc3Qgb3V0cHV0ID0gYXdhaXQgYXNzZXJ0RWxlbWVudChwYWdlLCBzZWxlY3RvciwgdmFsaWRhdGlvblJvd3MpO1xuXG5cdFx0XHQgcmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHQgbWVzc2FnZTogYFN1Y2Nlc3NmdWxseSBhc3NlcnRlZCBlbGVtZW50ICR7c2VsZWN0b3J9YCxcblx0XHRcdFx0IG1ldGE6IHtvdXRwdXR9XG5cdFx0XHQgfSk7XG5cdFx0IH0gY2F0Y2goZXJyKXtcblx0XHQgXHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHQgcmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBhc3NlcnRpbmcgZWxlbWVudFwiKTtcblx0XHQgfVxuXHQgfSk7XG4gfVxuIiwiaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xpY2soYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnl7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0fVxuXHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQoc2VsZWN0b3IgYXMgc3RyaW5nKTtcblx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdHJldHVybiBlcnJvcihgTm8gZWxlbWVudCB3aXRoIHNlbGVjdG9yIGFzICR7c2VsZWN0b3J9IGV4aXN0c2ApO1xuXHRcdH1cblxuXHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuZGlzcGF0Y2hFdmVudChcImNsaWNrXCIpO1xuXG5cdFx0Ly8gSWYgdW5kZXIgbmF2aWdhdGlvbiB3YWl0IGZvciBsb2FkIHN0YXRlIHRvIGNvbXBsZXRlLlxuXHRcdGF3YWl0IHBhZ2Uud2FpdEZvckxvYWRTdGF0ZSgpO1xuXG5cdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0bWVzc2FnZTogYENsaWNrZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgY2xpY2tpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSwgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuLi9mdW5jdGlvbnMnO1xuXG5leHBvcnQgY29uc3QgcnVuU2NyaXB0T25FbGVtZW50ID0gKHNjcmlwdDogc3RyaW5nLCBlbEhhbmRsZTogRWxlbWVudEhhbmRsZSk6IFByb21pc2U8YW55PiA9PiB7XG5cdHJldHVybiBuZXcgRnVuY3Rpb24oXG5cdFx0J2V4cG9ydHMnLFxuXHRcdCdyZXF1aXJlJyxcblx0XHQnbW9kdWxlJyxcblx0XHQnX19maWxlbmFtZScsXG5cdFx0J19fZGlybmFtZScsXG5cdFx0J3NjcmlwdCcsXG5cdFx0J2VsSGFuZGxlJyxcblx0XHRgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0ICAgIHRyeXtcblx0XHRcdFx0ICAgICAgICBjb25zdCBzY3JpcHRGdW5jdGlvbiA9ICR7c2NyaXB0fTtcblx0XHRcdFx0ICAgICAgICBjb25zb2xlLmxvZyhzY3JpcHRGdW5jdGlvbik7XG5cdFx0XHRcdCAgICAgICAgcmVzb2x2ZShzY3JpcHRGdW5jdGlvbihlbEhhbmRsZSkpO1xuXHRcdFx0XHQgICAgfSBjYXRjaChlcnIpe1xuXHRcdFx0XHQgICAgICByZWplY3QoZXJyKTtcblx0XHRcdFx0ICAgIH1cblx0XHRcdFx0fSk7YCxcblx0KShleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgc2NyaXB0LCBlbEhhbmRsZSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbGVtZW50Q3VzdG9tU2NyaXB0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5e1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRpZiAoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQoc2VsZWN0b3IgYXMgc3RyaW5nKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gY2FwdHVyZSBzY3JlZW5zaG90IG9mIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjdXN0b21TY3JpcHQgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnNjcmlwdDtcblxuXHRcdFx0Y29uc3Qgc2NyaXB0T3V0cHV0ID0gYXdhaXQgcnVuU2NyaXB0T25FbGVtZW50KGN1c3RvbVNjcmlwdCwgZWxlbWVudEhhbmRsZSk7XG5cdFx0XHRpZighIXNjcmlwdE91dHB1dCl7XG5cdFx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBc3NlcnRpb24gZmFpbGVkIGFjY29yZGluZyB0byB0aGUgc2NyaXB0IHdpdGggb3V0cHV0OiAke0pTT04uc3RyaW5naWZ5KHNjcmlwdE91dHB1dCl9YClcblx0XHRcdH1cblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHJ1bm5pbmcgc2NyaXB0IG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuLi9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb24nO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVsZW1lbnRTY3JlZW5zaG90KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSwgc3RlcEluZGV4OiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGlmICghc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3RvciBhcyBzdHJpbmcpO1xuXHRcdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXR0ZW1wdCB0byBjYXB0dXJlIHNjcmVlbnNob3Qgb2YgZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRTY3JlZW5zaG90QnVmZmVyID0gYXdhaXQgZWxlbWVudEhhbmRsZS5zY3JlZW5zaG90KCk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYENhcHR1cmVkIGVsZW1lbnQgc2NyZWVuc2hvdCBmb3IgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0XHRvdXRwdXQ6IHsgbmFtZTogZ2VuZXJhdGVTY3JlZW5zaG90TmFtZShzZWxlY3Rvciwgc3RlcEluZGV4KSwgdmFsdWU6IGVsZW1lbnRTY3JlZW5zaG90QnVmZmVyIH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjYXB0dXJpbmcgc2NyZWVuc2hvdCBvZiBlbGVtZW50Jyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBzY3JvbGwsIHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FwdHVyZVBhZ2VTY3JlZW5zaG90KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0aWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXNlbGVjdG9yKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXR0ZW1wdCB0byBzY3JvbGwgZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNjcm9sbERlbHRhID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0YXdhaXQgc2Nyb2xsKHBhZ2UsIHNlbGVjdG9yLCBzY3JvbGxEZWx0YSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2Nyb2xsaW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhvdmVyKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXG5cdFx0XHRpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IHBhZ2UuaG92ZXIoc2VsZWN0b3IpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBIb3ZlcmVkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3J9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgaG92ZXJpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IGFkZElucHV0IGZyb20gXCIuL2FkZElucHV0XCI7XG5pbXBvcnQgY2xpY2sgZnJvbSBcIi4vY2xpY2tcIjtcbmltcG9ydCBob3ZlciBmcm9tIFwiLi9ob3ZlclwiO1xuaW1wb3J0IGNhcHR1cmVFbGVtZW50U2NyZWVuc2hvdCBmcm9tIFwiLi9lbGVtZW50U2NyZWVuc2hvdFwiO1xuaW1wb3J0IGNhcHR1cmVQYWdlU2NyZWVuc2hvdCBmcm9tIFwiLi9wYWdlU2NyZWVuc2hvdFwiO1xuaW1wb3J0IGVsZW1lbnRTY3JvbGwgZnJvbSBcIi4vZWxlbWVudFNjcm9sbFwiO1xuaW1wb3J0IHBhZ2VTY3JvbGwgZnJvbSBcIi4vcGFnZVNjcm9sbFwiO1xuaW1wb3J0IG5hdmlnYXRlVXJsIGZyb20gXCIuL25hdmlnYXRlVXJsXCI7XG5pbXBvcnQgc2V0RGV2aWNlIGZyb20gXCIuL3NldERldmljZVwiO1xuaW1wb3J0IGFzc2VydEVsZW1lbnQgZnJvbSAnLi9hc3NlcnRFbGVtZW50JztcbmltcG9ydCBydW5DdXN0b21TY3JpcHQgZnJvbSBcIi4vZWxlbWVudEN1c3RvbVNjcmlwdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0RWxlbWVudDoge1xuXHRcdGFkZElucHV0LFxuXHRcdGNsaWNrLFxuXHRcdGhvdmVyLFxuXHRcdHNjcm9sbDogZWxlbWVudFNjcm9sbCxcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QsXG5cdFx0ZWxlbWVudFNjcm9sbCxcblx0XHRhc3NlcnRFbGVtZW50LFxuXHRcdHJ1bkN1c3RvbVNjcmlwdDogcnVuQ3VzdG9tU2NyaXB0XG5cdH0sXG5cdFBhZ2U6IHtcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlUGFnZVNjcmVlbnNob3QsXG5cdFx0c2Nyb2xsOiBwYWdlU2Nyb2xsLFxuXHRcdG5hdmlnYXRlOiBuYXZpZ2F0ZVVybCxcblx0fSxcblx0QnJvd3Nlcjoge1xuXHRcdHNldERldmljZSxcblx0fSxcbn07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSAncGxheXdyaWdodCc7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRlVXJsKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHVybFRvR28gPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRhd2FpdCBwYWdlLmdvdG8odXJsVG9Hbyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYE5hdmlnYXRlZCBzdWNjZXNzZnVsbHkgdG8gJHt1cmxUb0dvfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBuYXZpZ2F0aW5nIHRvIHdlYnBhZ2UnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChwYWdlOiBQYWdlLCBzdGVwSW5kZXg6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhZ2VUaXRsZSA9IGF3YWl0IHBhZ2UudGl0bGUoKTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0Y29uc3Qgc2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IHBhZ2Uuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIHBhZ2Ugc2NyZWVuc2hvdCBmb3IgJHtwYWdlVXJsfWAsXG5cdFx0XHRcdG91dHB1dDogeyBuYW1lOiBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lKHBhZ2VUaXRsZSwgc3RlcEluZGV4KSwgdmFsdWU6IHNjcmVlbnNob3RCdWZmZXIgfSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKCdTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNhcHR1cmluZyBzY3JlZW5zaG90IG9mIHBhZ2UnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHNjcm9sbCB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FwdHVyZVBhZ2VTY3JlZW5zaG90KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNjcm9sbERlbHRhID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0YXdhaXQgc2Nyb2xsKHBhZ2UsIFwid2luZG93XCIsIHNjcm9sbERlbHRhKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgU2Nyb2xsZWQgc3VjY2Vzc2Z1bGx5IG9uICR7cGFnZVVybH1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBzY3JvbGxpbmcgdGhlIHBhZ2VcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaURldmljZSB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvZXh0ZW5zaW9uL2RldmljZVwiO1xuaW1wb3J0IHsgaVVzZXJBZ2VudCB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvY29uc3RhbnRzL3VzZXJBZ2VudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2V0RGV2aWNlKGFjdGlvbjogaUFjdGlvbikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGRldmljZSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEuZGV2aWNlIGFzIGlEZXZpY2U7XG5cdFx0XHRjb25zdCB1c2VyQWdlbnQgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnVzZXJBZ2VudCBhcyBpVXNlckFnZW50O1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IFwiU2V0dXAgZGV2aWNlIGZvciB0ZXN0aW5nXCIsXG5cdFx0XHRcdG1ldGE6IHtcblx0XHRcdFx0XHR3aWR0aDogZGV2aWNlLndpZHRoLFxuXHRcdFx0XHRcdGhlaWdodDogZGV2aWNlLmhlaWdodCxcblx0XHRcdFx0XHR1c2VyQWdlbnQ6IHVzZXJBZ2VudC52YWx1ZSxcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2V0dGluZyB0aGUgZGV2aWNlXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBc3NlcnRpb25Sb3cgfSBmcm9tICcuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9hc3NlcnRpb25Sb3cnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhc3NlcnRFbGVtZW50QXR0cmlidXRlcyhwYWdlOiBQYWdlLCBzZWxlY3Rvcjogc3RyaW5nLCBhc3NlcnRpb25zOiBBcnJheTxpQXNzZXJ0aW9uUm93Pil7XG5cdGNvbnN0IGVsSGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yKTtcblx0bGV0IGhhc1Bhc3NlZCA9IHRydWU7XG5cdGNvbnN0IGxvZ3MgPSBbXTtcblxuXHRmb3IobGV0IGkgPSAwOyBpIDwgYXNzZXJ0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHt2YWxpZGF0aW9uLCBvcGVyYXRpb24sIGZpZWxkfSA9IGFzc2VydGlvbnNbaV07XG5cdFx0Y29uc3QgZWxlbWVudEF0dHJpYnV0ZVZhbHVlID0gYXdhaXQgZWxIYW5kbGUhLmdldEF0dHJpYnV0ZShmaWVsZC5uYW1lKTtcblx0XHRpZihvcGVyYXRpb24gPT09IFwibWF0Y2hlc1wiKSB7XG5cdFx0XHRpZihlbGVtZW50QXR0cmlidXRlVmFsdWUgIT09IHZhbGlkYXRpb24pe1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGU9XCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZT1cIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYob3BlcmF0aW9uID09PSBcImNvbnRhaW5zXCIpIHtcblx0XHRcdGNvbnN0IGRvZXNDb250YWluID0gIGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSEuaW5jbHVkZXModmFsaWRhdGlvbik7XG5cdFx0XHRpZighZG9lc0NvbnRhaW4gKXtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlIGNvbnRhaW5zIFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGUgY29udGFpbnMgXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG9wZXJhdGlvbiA9PT0gXCJyZWdleFwiICl7XG5cdFx0XHRjb25zdCByZ3ggPSBuZXcgUmVnRXhwKHZhbGlkYXRpb24pO1xuXHRcdFx0aWYgKCFyZ3gudGVzdChlbGVtZW50QXR0cmlidXRlVmFsdWUhKSkge1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGUgbWF0Y2hlcyByZWdleDogXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlIG1hdGNoZXMgcmVnZXg6IFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBbaGFzUGFzc2VkLCBsb2dzXTtcbn1cbiIsImltcG9ydCBzY3JvbGwgZnJvbSBcIi4vc2Nyb2xsXCI7XG5pbXBvcnQgdHlwZSBmcm9tIFwiLi90eXBlXCI7XG5pbXBvcnQgd2FpdEZvclNlbGVjdG9ycyBmcm9tIFwiLi93YWl0Rm9yU2VsZWN0b3JzXCI7XG5pbXBvcnQgc2xlZXAgZnJvbSBcIi4vc2xlZXBcIjtcbmltcG9ydCBhc3NlcnRFbGVtZW50IGZyb20gJy4vYXNzZXJ0RWxlbWVudCc7XG5cbmV4cG9ydCB7IHNjcm9sbCwgdHlwZSwgd2FpdEZvclNlbGVjdG9ycywgc2xlZXAsIGFzc2VydEVsZW1lbnQgfTtcbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzY3JvbGwoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yOiBzdHJpbmcsXG5cdHNjcm9sbERlbHRhQXJyOiBBcnJheTxudW1iZXI+LFxuKSB7XG5cdGF3YWl0IHBhZ2UuZXZhbHVhdGUoXG5cdFx0IChbc2Nyb2xsRGVsdGFBcnIsIHNlbGVjdG9yS2V5XTogW251bWJlcltdLCBzdHJpbmddKSA9PiB7XG5cdFx0XHRjb25zdCBzY3JvbGxUbyA9ICBmdW5jdGlvbiAoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9mZnNldDogbnVtYmVyKSB7XG5cdFx0XHRcdGNvbnN0IGZpeGVkT2Zmc2V0ID0gb2Zmc2V0LnRvRml4ZWQoKTtcblx0XHRcdFx0Y29uc3Qgb25TY3JvbGwgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKChlbGVtZW50IGFzIGFueSkucGFnZVlPZmZzZXQudG9GaXhlZCgpID09PSBmaXhlZE9mZnNldCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsKTtcblx0XHRcdFx0b25TY3JvbGwoKTtcblx0XHRcdFx0ZWxlbWVudC5zY3JvbGxUbyh7XG5cdFx0XHRcdFx0dG9wOiBvZmZzZXQsXG5cdFx0XHRcdFx0YmVoYXZpb3I6IFwic21vb3RoXCIsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgZWxlbWVudCA9XG5cdFx0XHRcdHNlbGVjdG9yS2V5ID09PSBcIndpbmRvd1wiID8gd2luZG93IDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcktleSk7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2Nyb2xsRGVsdGFBcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0IHNjcm9sbFRvKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHNjcm9sbERlbHRhQXJyW2ldKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFtzY3JvbGxEZWx0YUFyciwgc2VsZWN0b3JdLFxuXHQpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2xlZXAodGltZTogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHR9LCB0aW1lKTtcblx0fSk7XG59XG4iLCJpbXBvcnQgeyBFbGVtZW50SGFuZGxlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gdHlwZShcblx0ZWxIYW5kbGU6IEVsZW1lbnRIYW5kbGUsXG5cdGtleUNvZGVzOiBBcnJheTxudW1iZXI+LFxuKSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwga2V5Q29kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRhd2FpdCBlbEhhbmRsZS5wcmVzcyhTdHJpbmcuZnJvbUNoYXJDb2RlKGtleUNvZGVzW2ldKSk7XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yLCBnZXRFbGVtZW50c0J5WFBhdGggfSBmcm9tIFwiLi4vdXRpbHMvZG9tXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFZhbGlkU2VsZWN0b3JGcm9tRE9NKHBhZ2U6IFBhZ2UsIHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4pIHtcblx0Y29uc3QgdmFsaWRTZWxlY3RvciA9IGF3YWl0IHBhZ2UuZXZhbHVhdGUoKHNlbGVjdG9ycykgPT4ge1xuXHRcdGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoc2VsZWN0b3IudHlwZSA9PT0gXCJ4cGF0aFwiKSB7XG5cdFx0XHRcdFx0Y29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdGlmIChlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aCA9IGdlbmVyYXRlUXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0ZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSkge1xuXHRcdFx0XHRcdHJldHVybiBzZWxlY3Rvci52YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoZXgpIHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhcIkNhdWdodCBleGNlcHRpb25cIiwgZXgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fSwgc2VsZWN0b3JzKTtcblx0cmV0dXJuIHZhbGlkU2VsZWN0b3I7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3JzKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LFxuXHRkZWZhdWx0U2VsZWN0b3IgPSBudWxsIGFzIHN0cmluZyB8IG51bGwsXG4pIHtcblx0aWYgKCFkZWZhdWx0U2VsZWN0b3IpIHtcblx0XHRkZWZhdWx0U2VsZWN0b3IgPSBzZWxlY3RvcnNbMF0udmFsdWU7XG5cdH1cblxuXHR0cnkge1xuXHRcdGNvbnN0IHZhbGlkU2VsZWN0b3IgPSBhd2FpdCBnZXRWYWxpZFNlbGVjdG9yRnJvbURPTShwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdGlmKHZhbGlkU2VsZWN0b3Ipe1xuXHRcdFx0cmV0dXJuIHZhbGlkU2VsZWN0b3I7XG5cdFx0fVxuXHRcdGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKGRlZmF1bHRTZWxlY3RvciwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xuXHRcdHJldHVybiBkZWZhdWx0U2VsZWN0b3I7XG5cdH0gY2F0Y2gge1xuXHRcdGNvbnN0IHZhbGlkU2VsZWN0b3IgPSBhd2FpdCBnZXRWYWxpZFNlbGVjdG9yRnJvbURPTShwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdGlmICh0eXBlb2YgdmFsaWRTZWxlY3RvciA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhpcyBpcyBub3Qgd29ya2luZ1wiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbGlkU2VsZWN0b3I7XG5cdH1cbn1cbiIsImNvbnN0IGdldEVsZW1lbnRzQnlYUGF0aCA9IChcblx0eHBhdGg6IHN0cmluZyxcblx0cGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG4pOiBOb2RlW10gPT4ge1xuXHRjb25zdCByZXN1bHRzID0gW107XG5cdGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0eHBhdGgsXG5cdFx0cGFyZW50IHx8IGRvY3VtZW50LFxuXHRcdG51bGwsXG5cdFx0WFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEUsXG5cdFx0bnVsbCxcblx0KTtcblx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHF1ZXJ5LnNuYXBzaG90TGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRjb25zdCBpdGVtID0gcXVlcnkuc25hcHNob3RJdGVtKGkpO1xuXHRcdGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG5jb25zdCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgPSAoZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nID0+IHtcblx0aWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIikgcmV0dXJuIFwiSFRNTFwiO1xuXHRsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0c3RyICs9IGVsLmlkICE9IFwiXCIgPyBcIiNcIiArIGVsLmlkIDogXCJcIjtcblx0aWYgKGVsLmNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3RyICs9IFwiLlwiICsgY2xhc3Nlc1tpXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGdlbmVyYXRlUXVlcnlTZWxlY3RvcigoZWwgYXMgYW55KS5wYXJlbnROb2RlKSArIFwiID4gXCIgKyBzdHI7XG59O1xuXG5leHBvcnQgeyBnZXRFbGVtZW50c0J5WFBhdGgsIGdlbmVyYXRlUXVlcnlTZWxlY3RvciB9O1xuIiwiY29uc3QgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBzdGVwSW5kZXg6IG51bWJlcik6IHN0cmluZyA9PiB7XG5cdHJldHVybiBzZWxlY3Rvci5yZXBsYWNlKC9bXlxcd1xcc10vZ2ksICcnKS5yZXBsYWNlKC8gL2csICdfJykgKyBgXyR7c3RlcEluZGV4fS5wbmdgO1xufTtcblxuZXhwb3J0IHsgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSB9O1xuIiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSAoKSA9PiAoW10pO1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vc3JjL2FjdGlvbnMgc3luYyByZWN1cnNpdmVcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBtb2R1bGUgZXhwb3J0cyBtdXN0IGJlIHJldHVybmVkIGZyb20gcnVudGltZSBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5yZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FjdGlvbnMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9