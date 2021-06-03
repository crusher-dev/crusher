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
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
function addInput(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const inputKeys = action.payload.meta.value;
            const output = await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(output ? output.value : helper_1.toCrusherSelectorsFormat(selectors));
            if (!elementHandle) {
                return error(`Attempt to press keycodes on element with invalid selector: ${selectors[0].value}`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await functions_1.type(elementHandle, inputKeys);
            return success({
                message: `Pressed keys on the element ${selectors[0].value}`,
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
function assert(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const validationRows = action.payload.meta.validationRows;
            const output = await functions_1.assertElement(page, selectors, validationRows);
            return success({
                message: `Successfully asserted element ${selectors[0].value}`,
                meta: { output }
            });
        }
        catch (err) {
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
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const state_1 = __webpack_require__(/*! ../utils/state */ "./src/utils/state.ts");
function click(action, page) {
    return new Promise(async (success, error) => {
        state_1.setPageUrl(await page.url());
        try {
            const selectors = action.payload.selectors;
            const output = await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(output ? output.value : helper_1.toCrusherSelectorsFormat(selectors));
            if (!elementHandle) {
                return error(`No element with selector as ${selectors[0].value} exists`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await elementHandle.dispatchEvent("click");
            return success({
                message: `Clicked on the element ${selectors[0].value}`,
            });
        }
        catch (err) {
            console.error(err);
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
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const runScriptOnElement = (script, elHandle) => {
    return new Function('exports', 'require', 'module', '__filename', '__dirname', 'script', 'elHandle', `return new Promise(async function (resolve, reject) {
				    try{
				        const scriptFunction = ${script};
				        console.log(scriptFunction);
				        resolve(await scriptFunction(elHandle));
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
            const output = await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(output ? output.value : helper_1.toCrusherSelectorsFormat(selectors));
            if (!elementHandle) {
                return error(`Attempt to capture screenshot of element with invalid selector: ${selectors[0].value}`);
            }
            const customScript = action.payload.meta.script;
            const scriptOutput = await exports.runScriptOnElement(customScript, elementHandle);
            if (!!scriptOutput) {
                return success({
                    message: `Clicked on the element ${selectors[0].value}`,
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

/***/ "./src/actions/elementFocus.ts":
/*!*************************************!*\
  !*** ./src/actions/elementFocus.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
function focusOnElement(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const output = await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(output ? output.value : helper_1.toCrusherSelectorsFormat(selectors));
            await (elementHandle === null || elementHandle === void 0 ? void 0 : elementHandle.focus());
            return success({
                message: `Successfully focused on element`,
            });
        }
        catch (err) {
            console.log(err);
            return error("Some issue occurred while focusing on element");
        }
    });
}
exports.default = focusOnElement;


/***/ }),

/***/ "./src/actions/elementScreenshot.ts":
/*!******************************************!*\
  !*** ./src/actions/elementScreenshot.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function elementScreenshot(action, page, stepIndex) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const output = await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(output ? output.value : helper_1.toCrusherSelectorsFormat(selectors));
            if (!elementHandle) {
                return error(`Attempt to capture screenshot of element with invalid selector: ${selectors[0].value}`);
            }
            const elementScreenshotBuffer = await elementHandle.screenshot();
            return success({
                message: `Captured element screenshot for ${selectors[0].value}`,
                output: { name: helper_1.generateScreenshotName(selectors[0].value, stepIndex), value: elementScreenshotBuffer },
            });
        }
        catch (err) {
            console.log(err);
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
            const output = await functions_1.waitForSelectors(page, selectors);
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, output ? [output] : selectors, scrollDelta, false);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            console.log(err);
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
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
async function hover(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const output = await functions_1.waitForSelectors(page, selectors);
            await page.hover(output ? output.value : helper_1.toCrusherSelectorsFormat(selectors));
            return success({
                message: `Hovered on the element ${selectors[0].value}`,
            });
        }
        catch (err) {
            console.error(err);
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
const elementFocus_1 = __importDefault(__webpack_require__(/*! ./elementFocus */ "./src/actions/elementFocus.ts"));
const waitForNavigation_1 = __importDefault(__webpack_require__(/*! ./waitForNavigation */ "./src/actions/waitForNavigation.ts"));
module.exports = {
    Element: {
        addInput: addInput_1.default,
        click: click_1.default,
        hover: hover_1.default,
        scroll: elementScroll_1.default,
        screenshot: elementScreenshot_1.default,
        elementScroll: elementScroll_1.default,
        assertElement: assertElement_1.default,
        runCustomScript: elementCustomScript_1.default,
        focus: elementFocus_1.default
    },
    Page: {
        screenshot: pageScreenshot_1.default,
        scroll: pageScroll_1.default,
        navigate: navigateUrl_1.default,
        waitForNavigation: waitForNavigation_1.default
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
            await functions_1.scroll(page, [], scrollDelta);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            console.log(err);
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
                    userAgent: userAgent && userAgent.value ? userAgent.value : userAgent,
                },
            });
        }
        catch (err) {
            console.error(err);
            return error("Some issue occurred while setting the device");
        }
    });
}
exports.default = setDevice;


/***/ }),

/***/ "./src/actions/waitForNavigation.ts":
/*!******************************************!*\
  !*** ./src/actions/waitForNavigation.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const state_1 = __webpack_require__(/*! ../utils/state */ "./src/utils/state.ts");
async function waitForNavigation(action, page) {
    return new Promise(async (success, error) => {
        try {
            const currentUrl = await page.url();
            const lastSavedUrl = state_1.getLastSavedPageUrl();
            if (currentUrl === lastSavedUrl) {
                await page.waitForNavigation();
            }
            else {
                await page.waitForLoadState();
            }
            return success({
                message: `Waited for navigation successfully`,
            });
        }
        catch (err) {
            console.error(err);
            return error("Error occured while waiting for navigation");
        }
    });
}
exports.default = waitForNavigation;


/***/ }),

/***/ "./src/functions/assertElement.ts":
/*!****************************************!*\
  !*** ./src/functions/assertElement.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
const index_1 = __webpack_require__(/*! ./index */ "./src/functions/index.ts");
async function assertElementAttributes(page, selectors, assertions) {
    const output = await index_1.waitForSelectors(page, selectors);
    const elHandle = await page.$(output ? output.value : helper_1.toCrusherSelectorsFormat(selectors));
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

"use strict";

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

"use strict";

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

"use strict";

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
            if (scrollDeltaArr[i])
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
        await elHandle.press(keyCodes[i]);
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
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
const constants_1 = __webpack_require__(/*! ../../../unique-selector/src/constants */ "../unique-selector/src/constants.ts");
async function waitForSelectors(page, selectors) {
    let playwrightOut = null;
    if (selectors[0].type == constants_1.SELECTOR_TYPE.PLAYWRIGHT) {
        try {
            await page.waitForSelector(selectors[0].value, { state: "attached" });
            playwrightOut = selectors[0];
        }
        catch (ex) { }
        selectors.shift();
    }
    if (playwrightOut) {
        return playwrightOut;
    }
    await page.waitForSelector(helper_1.toCrusherSelectorsFormat(selectors));
    return;
}
exports.default = waitForSelectors;


/***/ }),

/***/ "./src/utils/helper.ts":
/*!*****************************!*\
  !*** ./src/utils/helper.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.promiseTillSuccess = exports.toCrusherSelectorsFormat = exports.generateScreenshotName = void 0;
const generateScreenshotName = (selector, stepIndex) => {
    return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
};
exports.generateScreenshotName = generateScreenshotName;
const toCrusherSelectorsFormat = (selectors) => {
    return `crusher=${encodeURIComponent(JSON.stringify(selectors))}`;
};
exports.toCrusherSelectorsFormat = toCrusherSelectorsFormat;
const promiseTillSuccess = (promises) => {
    return Promise.all(promises.map(p => {
        // If a request fails, count that as a resolution so it will keep
        // waiting for other possible successes. If a request succeeds,
        // treat it as a rejection so Promise.all immediately bails out.
        return p.then(val => Promise.reject(val), err => Promise.resolve(err));
    })).then(
    // If '.all' resolved, we've just got an array of errors.
    errors => Promise.reject(errors), 
    // If '.all' rejected, we've got the result we wanted.
    val => Promise.resolve(val));
};
exports.promiseTillSuccess = promiseTillSuccess;


/***/ }),

/***/ "./src/utils/state.ts":
/*!****************************!*\
  !*** ./src/utils/state.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLastSavedPageUrl = exports.setPageUrl = void 0;
let pageUrl = null;
function setPageUrl(url) {
    pageUrl = url;
}
exports.setPageUrl = setPageUrl;
function getLastSavedPageUrl() {
    return pageUrl;
}
exports.getLastSavedPageUrl = getLastSavedPageUrl;


/***/ }),

/***/ "../unique-selector/src/constants.ts":
/*!*******************************************!*\
  !*** ../unique-selector/src/constants.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SELECTOR_TYPE = void 0;
exports.SELECTOR_TYPE = {
    ID: 'id',
    PLAYWRIGHT: 'playwright',
    DATA_ATTRIBUTE: 'dataAttribute',
    ATTRIBUTE: 'attribute',
    INNER_VALUE: 'innerValue',
    PNC: 'PnC',
};


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
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/actions/index.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2FkZElucHV0LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2NsaWNrLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudEN1c3RvbVNjcmlwdC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRGb2N1cy50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudFNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvYWN0aW9ucy9uYXZpZ2F0ZVVybC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvcGFnZVNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3NldERldmljZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3dhaXRGb3JOYXZpZ2F0aW9uLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9hc3NlcnRFbGVtZW50LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvcmVnaXN0ZXJTZWxlY3RvckVuZ2luZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9zbGVlcC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvdHlwZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy91dGlscy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvdXRpbHMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi4vdW5pcXVlLXNlbGVjdG9yL3NyYy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvYWN0aW9uc3xzeW5jIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJw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QWEsR0FBRztJQUM1QixFQUFFLEVBQUUsSUFBSTtJQUNSLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLGNBQWMsRUFBRSxlQUFlO0lBQy9CLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLFdBQVcsRUFBRSxZQUFZO0lBQ3pCLEdBQUcsRUFBRSxLQUFLO0NBQ1YsQ0FBQzs7Ozs7Ozs7Ozs7QUNQRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUM7Ozs7OztVQ1JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N6QkEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFOzs7OztVQ0pBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZElucHV0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBpbnB1dEtleXMgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoXG5cdFx0XHRcdFx0YEF0dGVtcHQgdG8gcHJlc3Mga2V5Y29kZXMgb24gZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdFx0YXdhaXQgdHlwZShlbGVtZW50SGFuZGxlLCBpbnB1dEtleXMpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBQcmVzc2VkIGtleXMgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgYWRkaW5nIGlucHV0IHRvIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsIiBpbXBvcnQge2Fzc2VydEVsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbiBpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbiBpbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuIGltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbiBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhc3NlcnQoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0IHRyeXtcblx0XHRcdCBjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXG5cdFx0XHQgY29uc3QgdmFsaWRhdGlvblJvd3MgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbGlkYXRpb25Sb3dzO1xuXHRcdFx0IGNvbnN0IG91dHB1dCA9IGF3YWl0IGFzc2VydEVsZW1lbnQocGFnZSwgc2VsZWN0b3JzLCB2YWxpZGF0aW9uUm93cyk7XG5cblx0XHRcdCByZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdCBtZXNzYWdlOiBgU3VjY2Vzc2Z1bGx5IGFzc2VydGVkIGVsZW1lbnQgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHRcdFx0IG1ldGE6IHtvdXRwdXR9XG5cdFx0XHQgfSk7XG5cdFx0IH0gY2F0Y2goZXJyKXtcblx0XHRcdCByZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGFzc2VydGluZyBlbGVtZW50XCIpO1xuXHRcdCB9XG5cdCB9KTtcbiB9XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4uL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBzZXRQYWdlVXJsIH0gZnJvbSAnLi4vdXRpbHMvc3RhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGljayhhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHNldFBhZ2VVcmwoYXdhaXQgcGFnZS51cmwoKSk7XG5cdFx0dHJ5e1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChvdXRwdXQgPyBvdXRwdXQudmFsdWUgOiB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoYE5vIGVsZW1lbnQgd2l0aCBzZWxlY3RvciBhcyAke3NlbGVjdG9yc1swXS52YWx1ZX0gZXhpc3RzYCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG5cdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5kaXNwYXRjaEV2ZW50KFwiY2xpY2tcIik7XG5cblx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yc1swXS52YWx1ZX1gLFxuXHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgY2xpY2tpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSwgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcblxuZXhwb3J0IGNvbnN0IHJ1blNjcmlwdE9uRWxlbWVudCA9IChzY3JpcHQ6IHN0cmluZywgZWxIYW5kbGU6IEVsZW1lbnRIYW5kbGUpOiBQcm9taXNlPGFueT4gPT4ge1xuXHRyZXR1cm4gbmV3IEZ1bmN0aW9uKFxuXHRcdCdleHBvcnRzJyxcblx0XHQncmVxdWlyZScsXG5cdFx0J21vZHVsZScsXG5cdFx0J19fZmlsZW5hbWUnLFxuXHRcdCdfX2Rpcm5hbWUnLFxuXHRcdCdzY3JpcHQnLFxuXHRcdCdlbEhhbmRsZScsXG5cdFx0YHJldHVybiBuZXcgUHJvbWlzZShhc3luYyBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdCAgICB0cnl7XG5cdFx0XHRcdCAgICAgICAgY29uc3Qgc2NyaXB0RnVuY3Rpb24gPSAke3NjcmlwdH07XG5cdFx0XHRcdCAgICAgICAgY29uc29sZS5sb2coc2NyaXB0RnVuY3Rpb24pO1xuXHRcdFx0XHQgICAgICAgIHJlc29sdmUoYXdhaXQgc2NyaXB0RnVuY3Rpb24oZWxIYW5kbGUpKTtcblx0XHRcdFx0ICAgIH0gY2F0Y2goZXJyKXtcblx0XHRcdFx0ICAgICAgcmVqZWN0KGVycik7XG5cdFx0XHRcdCAgICB9XG5cdFx0XHRcdH0pO2AsXG5cdCkoZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHNjcmlwdCwgZWxIYW5kbGUpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudEN1c3RvbVNjcmlwdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeXtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQob3V0cHV0ID8gb3V0cHV0LnZhbHVlIDogdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXHRcdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXR0ZW1wdCB0byBjYXB0dXJlIHNjcmVlbnNob3Qgb2YgZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjdXN0b21TY3JpcHQgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnNjcmlwdDtcblxuXHRcdFx0Y29uc3Qgc2NyaXB0T3V0cHV0ID0gYXdhaXQgcnVuU2NyaXB0T25FbGVtZW50KGN1c3RvbVNjcmlwdCwgZWxlbWVudEhhbmRsZSk7XG5cdFx0XHRpZighIXNjcmlwdE91dHB1dCl7XG5cdFx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yc1swXS52YWx1ZX1gLFxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXNzZXJ0aW9uIGZhaWxlZCBhY2NvcmRpbmcgdG8gdGhlIHNjcmlwdCB3aXRoIG91dHB1dDogJHtKU09OLnN0cmluZ2lmeShzY3JpcHRPdXRwdXQpfWApXG5cdFx0XHR9XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBydW5uaW5nIHNjcmlwdCBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9jdXNPbkVsZW1lbnQoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IG91dHB1dCA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQob3V0cHV0ID8gb3V0cHV0LnZhbHVlIDogdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXG5cdFx0XHRhd2FpdCBlbGVtZW50SGFuZGxlPy5mb2N1cygpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBTdWNjZXNzZnVsbHkgZm9jdXNlZCBvbiBlbGVtZW50YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGZvY3VzaW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uJztcbmltcG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUsIHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudFNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlLCBzdGVwSW5kZXg6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gY2FwdHVyZSBzY3JlZW5zaG90IG9mIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yc1swXS52YWx1ZX1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZWxlbWVudFNjcmVlbnNob3RCdWZmZXIgPSBhd2FpdCBlbGVtZW50SGFuZGxlLnNjcmVlbnNob3QoKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgQ2FwdHVyZWQgZWxlbWVudCBzY3JlZW5zaG90IGZvciAke3NlbGVjdG9yc1swXS52YWx1ZX1gLFxuXHRcdFx0XHRvdXRwdXQ6IHsgbmFtZTogZ2VuZXJhdGVTY3JlZW5zaG90TmFtZShzZWxlY3RvcnNbMF0udmFsdWUsIHN0ZXBJbmRleCksIHZhbHVlOiBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlciB9LFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKCdTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNhcHR1cmluZyBzY3JlZW5zaG90IG9mIGVsZW1lbnQnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHNjcm9sbCwgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IG91dHB1dCA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRGVsdGEgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXHRcdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRhd2FpdCBzY3JvbGwocGFnZSwgb3V0cHV0ID8gW291dHB1dF0gOiBzZWxlY3RvcnMsIHNjcm9sbERlbHRhLCBmYWxzZSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4uL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhvdmVyKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cblx0XHRcdGNvbnN0IG91dHB1dCA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblx0XHRcdGF3YWl0IHBhZ2UuaG92ZXIob3V0cHV0ID8gb3V0cHV0LnZhbHVlIDogdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBIb3ZlcmVkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGhvdmVyaW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCBhZGRJbnB1dCBmcm9tIFwiLi9hZGRJbnB1dFwiO1xuaW1wb3J0IGNsaWNrIGZyb20gXCIuL2NsaWNrXCI7XG5pbXBvcnQgaG92ZXIgZnJvbSBcIi4vaG92ZXJcIjtcbmltcG9ydCBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QgZnJvbSBcIi4vZWxlbWVudFNjcmVlbnNob3RcIjtcbmltcG9ydCBjYXB0dXJlUGFnZVNjcmVlbnNob3QgZnJvbSBcIi4vcGFnZVNjcmVlbnNob3RcIjtcbmltcG9ydCBlbGVtZW50U2Nyb2xsIGZyb20gXCIuL2VsZW1lbnRTY3JvbGxcIjtcbmltcG9ydCBwYWdlU2Nyb2xsIGZyb20gXCIuL3BhZ2VTY3JvbGxcIjtcbmltcG9ydCBuYXZpZ2F0ZVVybCBmcm9tIFwiLi9uYXZpZ2F0ZVVybFwiO1xuaW1wb3J0IHNldERldmljZSBmcm9tIFwiLi9zZXREZXZpY2VcIjtcbmltcG9ydCBhc3NlcnRFbGVtZW50IGZyb20gJy4vYXNzZXJ0RWxlbWVudCc7XG5pbXBvcnQgcnVuQ3VzdG9tU2NyaXB0IGZyb20gXCIuL2VsZW1lbnRDdXN0b21TY3JpcHRcIjtcbmltcG9ydCBmb2N1c09uRWxlbWVudCBmcm9tICcuL2VsZW1lbnRGb2N1cyc7XG5pbXBvcnQgd2FpdEZvck5hdmlnYXRpb24gZnJvbSAnLi93YWl0Rm9yTmF2aWdhdGlvbic7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRFbGVtZW50OiB7XG5cdFx0YWRkSW5wdXQsXG5cdFx0Y2xpY2ssXG5cdFx0aG92ZXIsXG5cdFx0c2Nyb2xsOiBlbGVtZW50U2Nyb2xsLFxuXHRcdHNjcmVlbnNob3Q6IGNhcHR1cmVFbGVtZW50U2NyZWVuc2hvdCxcblx0XHRlbGVtZW50U2Nyb2xsLFxuXHRcdGFzc2VydEVsZW1lbnQsXG5cdFx0cnVuQ3VzdG9tU2NyaXB0OiBydW5DdXN0b21TY3JpcHQsXG5cdFx0Zm9jdXM6IGZvY3VzT25FbGVtZW50XG5cdH0sXG5cdFBhZ2U6IHtcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlUGFnZVNjcmVlbnNob3QsXG5cdFx0c2Nyb2xsOiBwYWdlU2Nyb2xsLFxuXHRcdG5hdmlnYXRlOiBuYXZpZ2F0ZVVybCxcblx0XHR3YWl0Rm9yTmF2aWdhdGlvbjogd2FpdEZvck5hdmlnYXRpb25cblx0fSxcblx0QnJvd3Nlcjoge1xuXHRcdHNldERldmljZSxcblx0fSxcbn07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSAncGxheXdyaWdodCc7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRlVXJsKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHVybFRvR28gPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRhd2FpdCBwYWdlLmdvdG8odXJsVG9Hbyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYE5hdmlnYXRlZCBzdWNjZXNzZnVsbHkgdG8gJHt1cmxUb0dvfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBuYXZpZ2F0aW5nIHRvIHdlYnBhZ2UnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChwYWdlOiBQYWdlLCBzdGVwSW5kZXg6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhZ2VUaXRsZSA9IGF3YWl0IHBhZ2UudGl0bGUoKTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0Y29uc3Qgc2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IHBhZ2Uuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIHBhZ2Ugc2NyZWVuc2hvdCBmb3IgJHtwYWdlVXJsfWAsXG5cdFx0XHRcdG91dHB1dDogeyBuYW1lOiBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lKHBhZ2VUaXRsZSwgc3RlcEluZGV4KSwgdmFsdWU6IHNjcmVlbnNob3RCdWZmZXIgfSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKCdTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNhcHR1cmluZyBzY3JlZW5zaG90IG9mIHBhZ2UnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHNjcm9sbCB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FwdHVyZVBhZ2VTY3JlZW5zaG90KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNjcm9sbERlbHRhID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0YXdhaXQgc2Nyb2xsKHBhZ2UsIFtdLCBzY3JvbGxEZWx0YSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyB0aGUgcGFnZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpRGV2aWNlIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9leHRlbnNpb24vZGV2aWNlXCI7XG5pbXBvcnQgeyBpVXNlckFnZW50IH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC9jb25zdGFudHMvdXNlckFnZW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzZXREZXZpY2UoYWN0aW9uOiBpQWN0aW9uKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGV2aWNlID0gYWN0aW9uLnBheWxvYWQubWV0YS5kZXZpY2UgYXMgaURldmljZTtcblx0XHRcdGNvbnN0IHVzZXJBZ2VudCA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudXNlckFnZW50IGFzIGlVc2VyQWdlbnQ7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogXCJTZXR1cCBkZXZpY2UgZm9yIHRlc3RpbmdcIixcblx0XHRcdFx0bWV0YToge1xuXHRcdFx0XHRcdHdpZHRoOiBkZXZpY2Uud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiBkZXZpY2UuaGVpZ2h0LFxuXHRcdFx0XHRcdHVzZXJBZ2VudDogdXNlckFnZW50ICYmIHVzZXJBZ2VudC52YWx1ZSA/IHVzZXJBZ2VudC52YWx1ZSA6IHVzZXJBZ2VudCxcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2V0dGluZyB0aGUgZGV2aWNlXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0TGFzdFNhdmVkUGFnZVVybCB9IGZyb20gJy4uL3V0aWxzL3N0YXRlJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvck5hdmlnYXRpb24oYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY3VycmVudFVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRjb25zdCBsYXN0U2F2ZWRVcmwgPSBnZXRMYXN0U2F2ZWRQYWdlVXJsKCk7XG5cdFx0XHRpZihjdXJyZW50VXJsID09PSBsYXN0U2F2ZWRVcmwpIHtcblx0XHRcdFx0YXdhaXQgcGFnZS53YWl0Rm9yTmF2aWdhdGlvbigpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YXdhaXQgcGFnZS53YWl0Rm9yTG9hZFN0YXRlKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBXYWl0ZWQgZm9yIG5hdmlnYXRpb24gc3VjY2Vzc2Z1bGx5YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIkVycm9yIG9jY3VyZWQgd2hpbGUgd2FpdGluZyBmb3IgbmF2aWdhdGlvblwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQXNzZXJ0aW9uUm93IH0gZnJvbSAnLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvYXNzZXJ0aW9uUm93JztcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGFzc2VydEVsZW1lbnRBdHRyaWJ1dGVzKHBhZ2U6IFBhZ2UsIHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sIGFzc2VydGlvbnM6IEFycmF5PGlBc3NlcnRpb25Sb3c+KXtcblx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXHRjb25zdCBlbEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChvdXRwdXQgPyBvdXRwdXQudmFsdWUgOiB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cdGxldCBoYXNQYXNzZWQgPSB0cnVlO1xuXHRjb25zdCBsb2dzID0gW107XG5cblx0Y29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvcnNbMF0udmFsdWU7XG5cblx0Zm9yKGxldCBpID0gMDsgaSA8IGFzc2VydGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB7dmFsaWRhdGlvbiwgb3BlcmF0aW9uLCBmaWVsZH0gPSBhc3NlcnRpb25zW2ldO1xuXHRcdGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSA9IGF3YWl0IGVsSGFuZGxlIS5nZXRBdHRyaWJ1dGUoZmllbGQubmFtZSk7XG5cdFx0aWYob3BlcmF0aW9uID09PSBcIm1hdGNoZXNcIikge1xuXHRcdFx0aWYoZWxlbWVudEF0dHJpYnV0ZVZhbHVlICE9PSB2YWxpZGF0aW9uKXtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlPVwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGU9XCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG9wZXJhdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG5cdFx0XHRjb25zdCBkb2VzQ29udGFpbiA9ICBlbGVtZW50QXR0cmlidXRlVmFsdWUhLmluY2x1ZGVzKHZhbGlkYXRpb24pO1xuXHRcdFx0aWYoIWRvZXNDb250YWluICl7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZSBjb250YWlucyBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlIGNvbnRhaW5zIFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZihvcGVyYXRpb24gPT09IFwicmVnZXhcIiApe1xuXHRcdFx0Y29uc3Qgcmd4ID0gbmV3IFJlZ0V4cCh2YWxpZGF0aW9uKTtcblx0XHRcdGlmICghcmd4LnRlc3QoZWxlbWVudEF0dHJpYnV0ZVZhbHVlISkpIHtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlIG1hdGNoZXMgcmVnZXg6IFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZSBtYXRjaGVzIHJlZ2V4OiBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW2hhc1Bhc3NlZCwgbG9nc107XG59XG4iLCJpbXBvcnQgc2Nyb2xsIGZyb20gXCIuL3Njcm9sbFwiO1xuaW1wb3J0IHR5cGUgZnJvbSBcIi4vdHlwZVwiO1xuaW1wb3J0IHdhaXRGb3JTZWxlY3RvcnMgZnJvbSBcIi4vd2FpdEZvclNlbGVjdG9yc1wiO1xuaW1wb3J0IHNsZWVwIGZyb20gXCIuL3NsZWVwXCI7XG5pbXBvcnQgYXNzZXJ0RWxlbWVudCBmcm9tICcuL2Fzc2VydEVsZW1lbnQnO1xuaW1wb3J0IGdldENydXNoZXJTZWxlY3RvckVuZ2luZSBmcm9tICcuL3JlZ2lzdGVyU2VsZWN0b3JFbmdpbmUnO1xuXG5leHBvcnQgeyBzY3JvbGwsIHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMsIHNsZWVwLCBhc3NlcnRFbGVtZW50LCBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmUgfTtcbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcblxuZnVuY3Rpb24gZ2V0Q3J1c2hlclNlbGVjdG9yRW5naW5lKCkge1xuXHRjb25zdCBnZXRFbGVtZW50c0J5WFBhdGggPSAoXG5cdFx0eHBhdGg6IHN0cmluZyxcblx0XHRwYXJlbnQ6IE5vZGUgfCBudWxsID0gbnVsbCxcblx0KTogTm9kZVtdID0+IHtcblx0XHRjb25zdCByZXN1bHRzID0gW107XG5cdFx0Y29uc3QgcXVlcnkgPSBkb2N1bWVudC5ldmFsdWF0ZShcblx0XHRcdHhwYXRoLFxuXHRcdFx0cGFyZW50IHx8IGRvY3VtZW50LFxuXHRcdFx0bnVsbCxcblx0XHRcdFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLFxuXHRcdFx0bnVsbCxcblx0XHQpO1xuXHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0XHRjb25zdCBpdGVtID0gcXVlcnkuc25hcHNob3RJdGVtKGkpO1xuXHRcdFx0aWYgKGl0ZW0pIHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH07XG5cblx0Y29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdFx0aWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIikgcmV0dXJuIFwiSFRNTFwiO1xuXHRcdGxldCBzdHIgPSBlbC50YWdOYW1lO1xuXHRcdHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdFx0aWYgKGVsLmNsYXNzTmFtZSkge1xuXHRcdFx0Y29uc3QgY2xhc3NlcyA9IGVsLmNsYXNzTmFtZS5zcGxpdCgvXFxzLyk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c3RyICs9IFwiLlwiICsgY2xhc3Nlc1tpXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGdlbmVyYXRlUXVlcnlTZWxlY3RvcigoZWwgYXMgYW55KS5wYXJlbnROb2RlKSArIFwiID4gXCIgKyBzdHI7XG5cdH07XG5cblx0Y29uc3QgZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIgPSAoc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPiwgcm9vdDogRWxlbWVudCB8IERvY3VtZW50ID0gZG9jdW1lbnQpID0+IHtcblx0XHRmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdGNvbnN0IGVsZW1lbnRzID0gZ2V0RWxlbWVudHNCeVhQYXRoKHNlbGVjdG9yLnZhbHVlKTtcblx0XHRcdFx0XHRpZiAoZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnRzWzBdIGFzIEhUTUxFbGVtZW50LFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHtlbGVtZW50OiBlbGVtZW50c1swXSBhcyBFbGVtZW50LCBzZWxlY3RvcjogZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRofTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAocm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSkge1xuXHRcdFx0XHRcdHJldHVybiB7ZWxlbWVudDogcm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSEsIHNlbGVjdG9yOiBzZWxlY3Rvci52YWx1ZX07XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2h7fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdC8vIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgbWF0Y2hpbmcgZ2l2ZW4gc2VsZWN0b3IgaW4gdGhlIHJvb3QncyBzdWJ0cmVlLlxuXHRcdHF1ZXJ5KHJvb3Q6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcblx0XHRcdGNvbnN0IHNlbGVjdG9yQXJyID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoc2VsZWN0b3IpKTtcblx0XHRcdGNvbnN0IHZhbGlkU2VsZWN0b3JFbGVtZW50SW5mbyA9IGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyKHNlbGVjdG9yQXJyKTtcblxuXHRcdFx0cmV0dXJuIHZhbGlkU2VsZWN0b3JFbGVtZW50SW5mbyA/IHZhbGlkU2VsZWN0b3JFbGVtZW50SW5mby5lbGVtZW50IDogbnVsbDtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgZ2l2ZW4gc2VsZWN0b3IgaW4gdGhlIHJvb3QncyBzdWJ0cmVlLlxuXHRcdHF1ZXJ5QWxsKHJvb3Q6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcblx0XHRcdGNvbnN0IHNlbGVjdG9yQXJyID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoc2VsZWN0b3IpKTtcblx0XHRcdGNvbnN0IHZhbGlkU2VsZWN0b3JFbGVtZW50SW5mbyA9IGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyKHNlbGVjdG9yQXJyKTtcblxuXHRcdFx0cmV0dXJuIHZhbGlkU2VsZWN0b3JFbGVtZW50SW5mbyA/IEFycmF5LmZyb20ocm9vdC5xdWVyeVNlbGVjdG9yQWxsKHZhbGlkU2VsZWN0b3JFbGVtZW50SW5mby5zZWxlY3RvcikpIDogW107XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmU7IiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHNjcm9sbChcblx0cGFnZTogUGFnZSxcblx0c2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPixcblx0c2Nyb2xsRGVsdGFBcnI6IEFycmF5PG51bWJlcj4sXG5cdGlzV2luZG93OiBib29sZWFuID0gdHJ1ZVxuKSB7XG5cdGF3YWl0IHBhZ2UuZXZhbHVhdGUoXG5cdFx0IChbc2Nyb2xsRGVsdGFBcnIsIHNlbGVjdG9yS2V5cywgaXNXaW5kb3ddOiBbbnVtYmVyW10sIEFycmF5PGlTZWxlY3RvckluZm8+LCBib29sZWFuXSkgPT4ge1xuXHRcdFx0IGNvbnN0IGdldEVsZW1lbnRzQnlYUGF0aCA9IChcblx0XHRcdFx0IHhwYXRoOiBzdHJpbmcsXG5cdFx0XHRcdCBwYXJlbnQ6IE5vZGUgfCBudWxsID0gbnVsbCxcblx0XHRcdCApOiBOb2RlW10gPT4ge1xuXHRcdFx0XHQgY29uc3QgcmVzdWx0cyA9IFtdO1xuXHRcdFx0XHQgY29uc3QgcXVlcnkgPSBkb2N1bWVudC5ldmFsdWF0ZShcblx0XHRcdFx0XHQgeHBhdGgsXG5cdFx0XHRcdFx0IHBhcmVudCB8fCBkb2N1bWVudCxcblx0XHRcdFx0XHQgbnVsbCxcblx0XHRcdFx0XHQgWFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEUsXG5cdFx0XHRcdFx0IG51bGwsXG5cdFx0XHRcdCApO1xuXHRcdFx0XHQgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHF1ZXJ5LnNuYXBzaG90TGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHQgY29uc3QgaXRlbSA9IHF1ZXJ5LnNuYXBzaG90SXRlbShpKTtcblx0XHRcdFx0XHQgaWYgKGl0ZW0pIHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHRcdFx0IH1cblx0XHRcdFx0IHJldHVybiByZXN1bHRzO1xuXHRcdFx0IH07XG5cblx0XHRcdCBjb25zdCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgPSAoZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nID0+IHtcblx0XHRcdFx0IGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJodG1sXCIpIHJldHVybiBcIkhUTUxcIjtcblx0XHRcdFx0IGxldCBzdHIgPSBlbC50YWdOYW1lO1xuXHRcdFx0XHQgc3RyICs9IGVsLmlkICE9IFwiXCIgPyBcIiNcIiArIGVsLmlkIDogXCJcIjtcblx0XHRcdFx0IGlmIChlbC5jbGFzc05hbWUpIHtcblx0XHRcdFx0XHQgY29uc3QgY2xhc3NlcyA9IGVsLmNsYXNzTmFtZS5zcGxpdCgvXFxzLyk7XG5cdFx0XHRcdFx0IGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0IHN0ciArPSBcIi5cIiArIGNsYXNzZXNbaV07XG5cdFx0XHRcdFx0IH1cblx0XHRcdFx0IH1cblx0XHRcdFx0IHJldHVybiBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoKGVsIGFzIGFueSkucGFyZW50Tm9kZSkgKyBcIiA+IFwiICsgc3RyO1xuXHRcdFx0IH07XG5cblx0XHRcdCBjb25zdCBnZXRWYWxpZFNlbGVjdG9yRnJvbUFyciA9IChzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LCByb290OiBFbGVtZW50IHwgRG9jdW1lbnQgPSBkb2N1bWVudCkgPT4ge1xuXHRcdFx0XHQgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcblx0XHRcdFx0XHQgdHJ5IHtcblx0XHRcdFx0XHRcdCBpZiAoc2VsZWN0b3IudHlwZSA9PT0gXCJ4cGF0aFwiKSB7XG5cdFx0XHRcdFx0XHRcdCBjb25zdCBlbGVtZW50cyA9IGdldEVsZW1lbnRzQnlYUGF0aChzZWxlY3Rvci52YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdCBpZiAoZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0IGNvbnN0IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aCA9IGdlbmVyYXRlUXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0XHRcdCBlbGVtZW50c1swXSBhcyBIVE1MRWxlbWVudCxcblx0XHRcdFx0XHRcdFx0XHQgKTtcblxuXHRcdFx0XHRcdFx0XHRcdCByZXR1cm4ge2VsZW1lbnQ6IGVsZW1lbnRzWzBdIGFzIEVsZW1lbnQsIHNlbGVjdG9yOiBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGh9O1xuXHRcdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdFx0IH0gZWxzZSBpZiAocm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHQgcmV0dXJuIHtlbGVtZW50OiByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpISwgc2VsZWN0b3I6IHNlbGVjdG9yLnZhbHVlfTtcblx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0IH0gY2F0Y2h7fVxuXHRcdFx0XHQgfVxuXHRcdFx0XHQgcmV0dXJuIG51bGw7XG5cdFx0XHQgfTtcblxuXHRcdCBcdGNvbnN0IHNlbGVjdG9yS2V5SW5mbyA9IGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyKHNlbGVjdG9yS2V5cyk7XG5cdFx0IFx0aWYoIXNlbGVjdG9yS2V5SW5mbyAmJiAhaXNXaW5kb3cpIHRocm93IG5ldyBFcnJvcihcIk5vIHZhbGlkIHNlbGVjdG9yIGZvdW5kXCIpO1xuXG5cdFx0XHRjb25zdCBzY3JvbGxUbyA9ICBmdW5jdGlvbiAoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9mZnNldDogbnVtYmVyKSB7XG5cdFx0XHRcdGNvbnN0IGZpeGVkT2Zmc2V0ID0gb2Zmc2V0LnRvRml4ZWQoKTtcblx0XHRcdFx0Y29uc3Qgb25TY3JvbGwgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKChlbGVtZW50IGFzIGFueSkucGFnZVlPZmZzZXQudG9GaXhlZCgpID09PSBmaXhlZE9mZnNldCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsKTtcblx0XHRcdFx0b25TY3JvbGwoKTtcblx0XHRcdFx0ZWxlbWVudC5zY3JvbGxUbyh7XG5cdFx0XHRcdFx0dG9wOiBvZmZzZXQsXG5cdFx0XHRcdFx0YmVoYXZpb3I6IFwic21vb3RoXCIsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGlzV2luZG93PyB3aW5kb3cgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yS2V5SW5mbyEuc2VsZWN0b3IpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNjcm9sbERlbHRhQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmKHNjcm9sbERlbHRhQXJyW2ldKVxuXHRcdFx0XHQgc2Nyb2xsVG8oZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgc2Nyb2xsRGVsdGFBcnJbaV0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0W3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcnMsIGlzV2luZG93XSxcblx0KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSwgdGltZSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHR5cGUoXG5cdGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlLFxuXHRrZXlDb2RlczogQXJyYXk8c3RyaW5nPixcbikge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleUNvZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXdhaXQgZWxIYW5kbGUucHJlc3Moa2V5Q29kZXNbaV0pO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgeyBTRUxFQ1RPUl9UWVBFIH0gZnJvbSAnLi4vLi4vLi4vdW5pcXVlLXNlbGVjdG9yL3NyYy9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3JzKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+XG4pOiBQcm9taXNlPGlTZWxlY3RvckluZm8gfCB1bmRlZmluZWQ+IHtcblx0bGV0IHBsYXl3cmlnaHRPdXQ6IGlTZWxlY3RvckluZm8gfCBudWxsID0gbnVsbDtcblx0aWYoc2VsZWN0b3JzWzBdLnR5cGUgPT0gU0VMRUNUT1JfVFlQRS5QTEFZV1JJR0hUKSB7XG5cdFx0dHJ5IHtcblx0XHQgYXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3Ioc2VsZWN0b3JzWzBdLnZhbHVlLCB7IHN0YXRlOiBcImF0dGFjaGVkXCIgfSk7XG5cdFx0IHBsYXl3cmlnaHRPdXQgPSBzZWxlY3RvcnNbMF07XG5cdFx0fSBjYXRjaChleCl7fVxuXHRcdHNlbGVjdG9ycy5zaGlmdCgpO1xuXHR9XG5cblx0aWYocGxheXdyaWdodE91dCkge1xuXHRcdHJldHVybiBwbGF5d3JpZ2h0T3V0O1xuXHR9XG5cblx0YXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IodG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXG5cdHJldHVybjtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcblxuY29uc3QgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBzdGVwSW5kZXg6IG51bWJlcik6IHN0cmluZyA9PiB7XG5cdHJldHVybiBzZWxlY3Rvci5yZXBsYWNlKC9bXlxcd1xcc10vZ2ksICcnKS5yZXBsYWNlKC8gL2csICdfJykgKyBgXyR7c3RlcEluZGV4fS5wbmdgO1xufTtcblxuY29uc3QgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0ID0gKHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4pID0+IHtcblx0cmV0dXJuIGBjcnVzaGVyPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNlbGVjdG9ycykpfWA7XG59O1xuXG5jb25zdCBwcm9taXNlVGlsbFN1Y2Nlc3MgPSAocHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55Pj4pID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzLm1hcChwID0+IHtcblx0XHQvLyBJZiBhIHJlcXVlc3QgZmFpbHMsIGNvdW50IHRoYXQgYXMgYSByZXNvbHV0aW9uIHNvIGl0IHdpbGwga2VlcFxuXHRcdC8vIHdhaXRpbmcgZm9yIG90aGVyIHBvc3NpYmxlIHN1Y2Nlc3Nlcy4gSWYgYSByZXF1ZXN0IHN1Y2NlZWRzLFxuXHRcdC8vIHRyZWF0IGl0IGFzIGEgcmVqZWN0aW9uIHNvIFByb21pc2UuYWxsIGltbWVkaWF0ZWx5IGJhaWxzIG91dC5cblx0XHRyZXR1cm4gcC50aGVuKFxuXHRcdFx0dmFsID0+IFByb21pc2UucmVqZWN0KHZhbCksXG5cdFx0XHRlcnIgPT4gUHJvbWlzZS5yZXNvbHZlKGVycilcblx0XHQpO1xuXHR9KSkudGhlbihcblx0XHQvLyBJZiAnLmFsbCcgcmVzb2x2ZWQsIHdlJ3ZlIGp1c3QgZ290IGFuIGFycmF5IG9mIGVycm9ycy5cblx0XHRlcnJvcnMgPT4gUHJvbWlzZS5yZWplY3QoZXJyb3JzKSxcblx0XHQvLyBJZiAnLmFsbCcgcmVqZWN0ZWQsIHdlJ3ZlIGdvdCB0aGUgcmVzdWx0IHdlIHdhbnRlZC5cblx0XHR2YWwgPT4gUHJvbWlzZS5yZXNvbHZlKHZhbClcblx0KTtcbn1cblxuXG5leHBvcnQgeyBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lLCB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQsIHByb21pc2VUaWxsU3VjY2VzcyB9O1xuIiwibGV0IHBhZ2VVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBzZXRQYWdlVXJsKHVybDogc3RyaW5nKSB7XG5cdHBhZ2VVcmwgPSB1cmw7XG59XG5cbmZ1bmN0aW9uIGdldExhc3RTYXZlZFBhZ2VVcmwoKXtcblx0cmV0dXJuIHBhZ2VVcmw7XG59XG5cbmV4cG9ydCB7c2V0UGFnZVVybCwgZ2V0TGFzdFNhdmVkUGFnZVVybH07IiwiZXhwb3J0IGNvbnN0IFNFTEVDVE9SX1RZUEUgPSB7XG5cdElEOiAnaWQnLFxuXHRQTEFZV1JJR0hUOiAncGxheXdyaWdodCcsXG5cdERBVEFfQVRUUklCVVRFOiAnZGF0YUF0dHJpYnV0ZScsXG5cdEFUVFJJQlVURTogJ2F0dHJpYnV0ZScsXG5cdElOTkVSX1ZBTFVFOiAnaW5uZXJWYWx1ZScsXG5cdFBOQzogJ1BuQycsXG59O1xuIiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSAoKSA9PiAoW10pO1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vc3JjL2FjdGlvbnMgc3luYyByZWN1cnNpdmVcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FjdGlvbnMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9