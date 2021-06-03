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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const actions = __importStar(__webpack_require__(/*! ./actions */ "./src/actions/index.ts"));
module.exports = actions;


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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2FkZElucHV0LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2NsaWNrLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudEN1c3RvbVNjcmlwdC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRGb2N1cy50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudFNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvYWN0aW9ucy9uYXZpZ2F0ZVVybC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvcGFnZVNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3NldERldmljZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3dhaXRGb3JOYXZpZ2F0aW9uLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9hc3NlcnRFbGVtZW50LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvcmVnaXN0ZXJTZWxlY3RvckVuZ2luZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9zbGVlcC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvdHlwZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy91dGlscy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvdXRpbHMvc3RhdGUudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi4vdW5pcXVlLXNlbGVjdG9yL3NyYy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvYWN0aW9uc3xzeW5jIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBR0Esd0ZBQXNEO0FBQ3RELHFGQUEyRDtBQUUzRCxTQUF3QixRQUFRLENBQUMsTUFBZSxFQUFFLElBQVU7SUFDM0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzNDLElBQUk7WUFDSCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQTRCLENBQUM7WUFDOUQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBRTVDLE1BQU0sTUFBTSxHQUFHLE1BQU0sNEJBQWdCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlDQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDaEcsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDbkIsT0FBTyxLQUFLLENBQ1gsK0RBQStELFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FDbkYsQ0FBQzthQUNGO1lBRUQsTUFBTSxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM3QyxNQUFNLGdCQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXJDLE9BQU8sT0FBTyxDQUFDO2dCQUNkLE9BQU8sRUFBRSwrQkFBK0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTthQUM1RCxDQUFDLENBQUM7U0FDSDtRQUFDLE9BQU0sR0FBRyxFQUFDO1lBQ1gsT0FBTyxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUNsRTtJQUNGLENBQUMsQ0FB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QixPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQU1PLGdDQUFVO0FBSmxCLFNBQVMsbUJBQW1CO0lBQzNCLE9BQU8sT0FBTyxDQUFDO0FBQ2hCLENBQUM7QUFFbUIsa0RBQW1COzs7Ozs7Ozs7Ozs7Ozs7QUNWMUIscUJBQWEsR0FBRztJQUM1QixFQUFFLEVBQUUsSUFBSTtJQUNSLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLGNBQWMsRUFBRSxlQUFlO0lBQy9CLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLFdBQVcsRUFBRSxZQUFZO0lBQ3pCLEdBQUcsRUFBRSxLQUFLO0NBQ1YsQ0FBQzs7Ozs7Ozs7Ozs7QUNQRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUM7Ozs7OztVQ1JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N6QkEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFOzs7OztVQ0pBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgdHlwZSwgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4uL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRJbnB1dChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3QgaW5wdXRLZXlzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChvdXRwdXQgPyBvdXRwdXQudmFsdWUgOiB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKFxuXHRcdFx0XHRcdGBBdHRlbXB0IHRvIHByZXNzIGtleWNvZGVzIG9uIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yc1swXS52YWx1ZX1gLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRcdGF3YWl0IHR5cGUoZWxlbWVudEhhbmRsZSwgaW5wdXRLZXlzKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgUHJlc3NlZCBrZXlzIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGFkZGluZyBpbnB1dCB0byBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCIgaW1wb3J0IHthc3NlcnRFbGVtZW50fSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG4gaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG4gaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbiBpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIi4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG4gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXNzZXJ0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHQgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdCB0cnl7XG5cdFx0XHQgY29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblxuXHRcdFx0IGNvbnN0IHZhbGlkYXRpb25Sb3dzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWxpZGF0aW9uUm93cztcblx0XHRcdCBjb25zdCBvdXRwdXQgPSBhd2FpdCBhc3NlcnRFbGVtZW50KHBhZ2UsIHNlbGVjdG9ycywgdmFsaWRhdGlvblJvd3MpO1xuXG5cdFx0XHQgcmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHQgbWVzc2FnZTogYFN1Y2Nlc3NmdWxseSBhc3NlcnRlZCBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHRcdCBtZXRhOiB7b3V0cHV0fVxuXHRcdFx0IH0pO1xuXHRcdCB9IGNhdGNoKGVycil7XG5cdFx0XHQgcmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBhc3NlcnRpbmcgZWxlbWVudFwiKTtcblx0XHQgfVxuXHQgfSk7XG4gfVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuLi9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgc2V0UGFnZVVybCB9IGZyb20gJy4uL3V0aWxzL3N0YXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xpY2soYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHRzZXRQYWdlVXJsKGF3YWl0IHBhZ2UudXJsKCkpO1xuXHRcdHRyeXtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdGNvbnN0IG91dHB1dCA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQob3V0cHV0ID8gb3V0cHV0LnZhbHVlIDogdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0cmV0dXJuIGVycm9yKGBObyBlbGVtZW50IHdpdGggc2VsZWN0b3IgYXMgJHtzZWxlY3RvcnNbMF0udmFsdWV9IGV4aXN0c2ApO1xuXHRcdH1cblxuXHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuZGlzcGF0Y2hFdmVudChcImNsaWNrXCIpO1xuXG5cdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0bWVzc2FnZTogYENsaWNrZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNsaWNraW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IEVsZW1lbnRIYW5kbGUsIFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJy4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4uL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCBjb25zdCBydW5TY3JpcHRPbkVsZW1lbnQgPSAoc2NyaXB0OiBzdHJpbmcsIGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlKTogUHJvbWlzZTxhbnk+ID0+IHtcblx0cmV0dXJuIG5ldyBGdW5jdGlvbihcblx0XHQnZXhwb3J0cycsXG5cdFx0J3JlcXVpcmUnLFxuXHRcdCdtb2R1bGUnLFxuXHRcdCdfX2ZpbGVuYW1lJyxcblx0XHQnX19kaXJuYW1lJyxcblx0XHQnc2NyaXB0Jyxcblx0XHQnZWxIYW5kbGUnLFxuXHRcdGByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHQgICAgdHJ5e1xuXHRcdFx0XHQgICAgICAgIGNvbnN0IHNjcmlwdEZ1bmN0aW9uID0gJHtzY3JpcHR9O1xuXHRcdFx0XHQgICAgICAgIGNvbnNvbGUubG9nKHNjcmlwdEZ1bmN0aW9uKTtcblx0XHRcdFx0ICAgICAgICByZXNvbHZlKGF3YWl0IHNjcmlwdEZ1bmN0aW9uKGVsSGFuZGxlKSk7XG5cdFx0XHRcdCAgICB9IGNhdGNoKGVycil7XG5cdFx0XHRcdCAgICAgIHJlamVjdChlcnIpO1xuXHRcdFx0XHQgICAgfVxuXHRcdFx0XHR9KTtgLFxuXHQpKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBzY3JpcHQsIGVsSGFuZGxlKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVsZW1lbnRDdXN0b21TY3JpcHQoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnl7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gY2FwdHVyZSBzY3JlZW5zaG90IG9mIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yc1swXS52YWx1ZX1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VzdG9tU2NyaXB0ID0gYWN0aW9uLnBheWxvYWQubWV0YS5zY3JpcHQ7XG5cblx0XHRcdGNvbnN0IHNjcmlwdE91dHB1dCA9IGF3YWl0IHJ1blNjcmlwdE9uRWxlbWVudChjdXN0b21TY3JpcHQsIGVsZW1lbnRIYW5kbGUpO1xuXHRcdFx0aWYoISFzY3JpcHRPdXRwdXQpe1xuXHRcdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdFx0bWVzc2FnZTogYENsaWNrZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEFzc2VydGlvbiBmYWlsZWQgYWNjb3JkaW5nIHRvIHRoZSBzY3JpcHQgd2l0aCBvdXRwdXQ6ICR7SlNPTi5zdHJpbmdpZnkoc2NyaXB0T3V0cHV0KX1gKVxuXHRcdFx0fVxuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgcnVubmluZyBzY3JpcHQgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZvY3VzT25FbGVtZW50KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblxuXHRcdFx0YXdhaXQgZWxlbWVudEhhbmRsZT8uZm9jdXMoKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgU3VjY2Vzc2Z1bGx5IGZvY3VzZWQgb24gZWxlbWVudGAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBmb2N1c2luZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAncGxheXdyaWdodCc7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvbic7XG5pbXBvcnQgeyBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lLCB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4uL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVsZW1lbnRTY3JlZW5zaG90KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSwgc3RlcEluZGV4OiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChvdXRwdXQgPyBvdXRwdXQudmFsdWUgOiB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBdHRlbXB0IHRvIGNhcHR1cmUgc2NyZWVuc2hvdCBvZiBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3RvcnNbMF0udmFsdWV9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRTY3JlZW5zaG90QnVmZmVyID0gYXdhaXQgZWxlbWVudEhhbmRsZS5zY3JlZW5zaG90KCk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYENhcHR1cmVkIGVsZW1lbnQgc2NyZWVuc2hvdCBmb3IgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHRcdFx0b3V0cHV0OiB7IG5hbWU6IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUoc2VsZWN0b3JzWzBdLnZhbHVlLCBzdGVwSW5kZXgpLCB2YWx1ZTogZWxlbWVudFNjcmVlbnNob3RCdWZmZXIgfSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjYXB0dXJpbmcgc2NyZWVuc2hvdCBvZiBlbGVtZW50Jyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBzY3JvbGwsIHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FwdHVyZVBhZ2VTY3JlZW5zaG90KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGNvbnN0IHNjcm9sbERlbHRhID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0YXdhaXQgc2Nyb2xsKHBhZ2UsIG91dHB1dCA/IFtvdXRwdXRdIDogc2VsZWN0b3JzLCBzY3JvbGxEZWx0YSwgZmFsc2UpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBzY3JvbGxpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuLi9mdW5jdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBob3ZlcihhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXG5cdFx0XHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cdFx0XHRhd2FpdCBwYWdlLmhvdmVyKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgSG92ZXJlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yc1swXS52YWx1ZX1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBob3ZlcmluZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgYWRkSW5wdXQgZnJvbSBcIi4vYWRkSW5wdXRcIjtcbmltcG9ydCBjbGljayBmcm9tIFwiLi9jbGlja1wiO1xuaW1wb3J0IGhvdmVyIGZyb20gXCIuL2hvdmVyXCI7XG5pbXBvcnQgY2FwdHVyZUVsZW1lbnRTY3JlZW5zaG90IGZyb20gXCIuL2VsZW1lbnRTY3JlZW5zaG90XCI7XG5pbXBvcnQgY2FwdHVyZVBhZ2VTY3JlZW5zaG90IGZyb20gXCIuL3BhZ2VTY3JlZW5zaG90XCI7XG5pbXBvcnQgZWxlbWVudFNjcm9sbCBmcm9tIFwiLi9lbGVtZW50U2Nyb2xsXCI7XG5pbXBvcnQgcGFnZVNjcm9sbCBmcm9tIFwiLi9wYWdlU2Nyb2xsXCI7XG5pbXBvcnQgbmF2aWdhdGVVcmwgZnJvbSBcIi4vbmF2aWdhdGVVcmxcIjtcbmltcG9ydCBzZXREZXZpY2UgZnJvbSBcIi4vc2V0RGV2aWNlXCI7XG5pbXBvcnQgYXNzZXJ0RWxlbWVudCBmcm9tICcuL2Fzc2VydEVsZW1lbnQnO1xuaW1wb3J0IHJ1bkN1c3RvbVNjcmlwdCBmcm9tIFwiLi9lbGVtZW50Q3VzdG9tU2NyaXB0XCI7XG5pbXBvcnQgZm9jdXNPbkVsZW1lbnQgZnJvbSAnLi9lbGVtZW50Rm9jdXMnO1xuaW1wb3J0IHdhaXRGb3JOYXZpZ2F0aW9uIGZyb20gJy4vd2FpdEZvck5hdmlnYXRpb24nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0RWxlbWVudDoge1xuXHRcdGFkZElucHV0LFxuXHRcdGNsaWNrLFxuXHRcdGhvdmVyLFxuXHRcdHNjcm9sbDogZWxlbWVudFNjcm9sbCxcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QsXG5cdFx0ZWxlbWVudFNjcm9sbCxcblx0XHRhc3NlcnRFbGVtZW50LFxuXHRcdHJ1bkN1c3RvbVNjcmlwdDogcnVuQ3VzdG9tU2NyaXB0LFxuXHRcdGZvY3VzOiBmb2N1c09uRWxlbWVudFxuXHR9LFxuXHRQYWdlOiB7XG5cdFx0c2NyZWVuc2hvdDogY2FwdHVyZVBhZ2VTY3JlZW5zaG90LFxuXHRcdHNjcm9sbDogcGFnZVNjcm9sbCxcblx0XHRuYXZpZ2F0ZTogbmF2aWdhdGVVcmwsXG5cdFx0d2FpdEZvck5hdmlnYXRpb246IHdhaXRGb3JOYXZpZ2F0aW9uXG5cdH0sXG5cdEJyb3dzZXI6IHtcblx0XHRzZXREZXZpY2UsXG5cdH0sXG59O1xuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBuYXZpZ2F0ZVVybChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB1cmxUb0dvID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdFx0YXdhaXQgcGFnZS5nb3RvKHVybFRvR28pO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBOYXZpZ2F0ZWQgc3VjY2Vzc2Z1bGx5IHRvICR7dXJsVG9Hb31gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoJ1NvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgbmF2aWdhdGluZyB0byB3ZWJwYWdlJyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QocGFnZTogUGFnZSwgc3RlcEluZGV4OiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBwYWdlVGl0bGUgPSBhd2FpdCBwYWdlLnRpdGxlKCk7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGNvbnN0IHNjcmVlbnNob3RCdWZmZXIgPSBhd2FpdCBwYWdlLnNjcmVlbnNob3QoKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBwYWdlIHNjcmVlbnNob3QgZm9yICR7cGFnZVVybH1gLFxuXHRcdFx0XHRvdXRwdXQ6IHsgbmFtZTogZ2VuZXJhdGVTY3JlZW5zaG90TmFtZShwYWdlVGl0bGUsIHN0ZXBJbmRleCksIHZhbHVlOiBzY3JlZW5zaG90QnVmZmVyIH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjYXB0dXJpbmcgc2NyZWVuc2hvdCBvZiBwYWdlJyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBzY3JvbGwgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBbXSwgc2Nyb2xsRGVsdGEpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBzY3JvbGxpbmcgdGhlIHBhZ2VcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaURldmljZSB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvZXh0ZW5zaW9uL2RldmljZVwiO1xuaW1wb3J0IHsgaVVzZXJBZ2VudCB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvY29uc3RhbnRzL3VzZXJBZ2VudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2V0RGV2aWNlKGFjdGlvbjogaUFjdGlvbikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGRldmljZSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEuZGV2aWNlIGFzIGlEZXZpY2U7XG5cdFx0XHRjb25zdCB1c2VyQWdlbnQgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnVzZXJBZ2VudCBhcyBpVXNlckFnZW50O1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IFwiU2V0dXAgZGV2aWNlIGZvciB0ZXN0aW5nXCIsXG5cdFx0XHRcdG1ldGE6IHtcblx0XHRcdFx0XHR3aWR0aDogZGV2aWNlLndpZHRoLFxuXHRcdFx0XHRcdGhlaWdodDogZGV2aWNlLmhlaWdodCxcblx0XHRcdFx0XHR1c2VyQWdlbnQ6IHVzZXJBZ2VudCAmJiB1c2VyQWdlbnQudmFsdWUgPyB1c2VyQWdlbnQudmFsdWUgOiB1c2VyQWdlbnQsXG5cdFx0XHRcdH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNldHRpbmcgdGhlIGRldmljZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGdldExhc3RTYXZlZFBhZ2VVcmwgfSBmcm9tICcuLi91dGlscy9zdGF0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JOYXZpZ2F0aW9uKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0Y29uc3QgbGFzdFNhdmVkVXJsID0gZ2V0TGFzdFNhdmVkUGFnZVVybCgpO1xuXHRcdFx0aWYoY3VycmVudFVybCA9PT0gbGFzdFNhdmVkVXJsKSB7XG5cdFx0XHRcdGF3YWl0IHBhZ2Uud2FpdEZvck5hdmlnYXRpb24oKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGF3YWl0IHBhZ2Uud2FpdEZvckxvYWRTdGF0ZSgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgV2FpdGVkIGZvciBuYXZpZ2F0aW9uIHN1Y2Nlc3NmdWxseWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJFcnJvciBvY2N1cmVkIHdoaWxlIHdhaXRpbmcgZm9yIG5hdmlnYXRpb25cIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFzc2VydGlvblJvdyB9IGZyb20gJy4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL2Fzc2VydGlvblJvdyc7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4vaW5kZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhc3NlcnRFbGVtZW50QXR0cmlidXRlcyhwYWdlOiBQYWdlLCBzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LCBhc3NlcnRpb25zOiBBcnJheTxpQXNzZXJ0aW9uUm93Pil7XG5cdGNvbnN0IG91dHB1dCA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblx0Y29uc3QgZWxIYW5kbGUgPSBhd2FpdCBwYWdlLiQob3V0cHV0ID8gb3V0cHV0LnZhbHVlIDogdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXHRsZXQgaGFzUGFzc2VkID0gdHJ1ZTtcblx0Y29uc3QgbG9ncyA9IFtdO1xuXG5cdGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzWzBdLnZhbHVlO1xuXG5cdGZvcihsZXQgaSA9IDA7IGkgPCBhc3NlcnRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qge3ZhbGlkYXRpb24sIG9wZXJhdGlvbiwgZmllbGR9ID0gYXNzZXJ0aW9uc1tpXTtcblx0XHRjb25zdCBlbGVtZW50QXR0cmlidXRlVmFsdWUgPSBhd2FpdCBlbEhhbmRsZSEuZ2V0QXR0cmlidXRlKGZpZWxkLm5hbWUpO1xuXHRcdGlmKG9wZXJhdGlvbiA9PT0gXCJtYXRjaGVzXCIpIHtcblx0XHRcdGlmKGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSAhPT0gdmFsaWRhdGlvbil7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZT1cIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlPVwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZihvcGVyYXRpb24gPT09IFwiY29udGFpbnNcIikge1xuXHRcdFx0Y29uc3QgZG9lc0NvbnRhaW4gPSAgZWxlbWVudEF0dHJpYnV0ZVZhbHVlIS5pbmNsdWRlcyh2YWxpZGF0aW9uKTtcblx0XHRcdGlmKCFkb2VzQ29udGFpbiApe1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGUgY29udGFpbnMgXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZSBjb250YWlucyBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYob3BlcmF0aW9uID09PSBcInJlZ2V4XCIgKXtcblx0XHRcdGNvbnN0IHJneCA9IG5ldyBSZWdFeHAodmFsaWRhdGlvbik7XG5cdFx0XHRpZiAoIXJneC50ZXN0KGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSEpKSB7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZSBtYXRjaGVzIHJlZ2V4OiBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGUgbWF0Y2hlcyByZWdleDogXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFtoYXNQYXNzZWQsIGxvZ3NdO1xufVxuIiwiaW1wb3J0IHNjcm9sbCBmcm9tIFwiLi9zY3JvbGxcIjtcbmltcG9ydCB0eXBlIGZyb20gXCIuL3R5cGVcIjtcbmltcG9ydCB3YWl0Rm9yU2VsZWN0b3JzIGZyb20gXCIuL3dhaXRGb3JTZWxlY3RvcnNcIjtcbmltcG9ydCBzbGVlcCBmcm9tIFwiLi9zbGVlcFwiO1xuaW1wb3J0IGFzc2VydEVsZW1lbnQgZnJvbSAnLi9hc3NlcnRFbGVtZW50JztcbmltcG9ydCBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmUgZnJvbSAnLi9yZWdpc3RlclNlbGVjdG9yRW5naW5lJztcblxuZXhwb3J0IHsgc2Nyb2xsLCB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzLCBzbGVlcCwgYXNzZXJ0RWxlbWVudCwgZ2V0Q3J1c2hlclNlbGVjdG9yRW5naW5lIH07XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5cbmZ1bmN0aW9uIGdldENydXNoZXJTZWxlY3RvckVuZ2luZSgpIHtcblx0Y29uc3QgZ2V0RWxlbWVudHNCeVhQYXRoID0gKFxuXHRcdHhwYXRoOiBzdHJpbmcsXG5cdFx0cGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG5cdCk6IE5vZGVbXSA9PiB7XG5cdFx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRcdGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0XHR4cGF0aCxcblx0XHRcdHBhcmVudCB8fCBkb2N1bWVudCxcblx0XHRcdG51bGwsXG5cdFx0XHRYUGF0aFJlc3VsdC5PUkRFUkVEX05PREVfU05BUFNIT1RfVFlQRSxcblx0XHRcdG51bGwsXG5cdFx0KTtcblx0XHRmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcXVlcnkuc25hcHNob3RMZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdFx0Y29uc3QgaXRlbSA9IHF1ZXJ5LnNuYXBzaG90SXRlbShpKTtcblx0XHRcdGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9O1xuXG5cdGNvbnN0IGdlbmVyYXRlUXVlcnlTZWxlY3RvciA9IChlbDogSFRNTEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuXHRcdGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJodG1sXCIpIHJldHVybiBcIkhUTUxcIjtcblx0XHRsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0XHRzdHIgKz0gZWwuaWQgIT0gXCJcIiA/IFwiI1wiICsgZWwuaWQgOiBcIlwiO1xuXHRcdGlmIChlbC5jbGFzc05hbWUpIHtcblx0XHRcdGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHN0ciArPSBcIi5cIiArIGNsYXNzZXNbaV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoKGVsIGFzIGFueSkucGFyZW50Tm9kZSkgKyBcIiA+IFwiICsgc3RyO1xuXHR9O1xuXG5cdGNvbnN0IGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyID0gKHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sIHJvb3Q6IEVsZW1lbnQgfCBEb2N1bWVudCA9IGRvY3VtZW50KSA9PiB7XG5cdFx0Zm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChzZWxlY3Rvci50eXBlID09PSBcInhwYXRoXCIpIHtcblx0XHRcdFx0XHRjb25zdCBlbGVtZW50cyA9IGdldEVsZW1lbnRzQnlYUGF0aChzZWxlY3Rvci52YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoID0gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50c1swXSBhcyBIVE1MRWxlbWVudCxcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdHJldHVybiB7ZWxlbWVudDogZWxlbWVudHNbMF0gYXMgRWxlbWVudCwgc2VsZWN0b3I6IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkpIHtcblx0XHRcdFx0XHRyZXR1cm4ge2VsZW1lbnQ6IHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkhLCBzZWxlY3Rvcjogc2VsZWN0b3IudmFsdWV9O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoe31cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHQvLyBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IG1hdGNoaW5nIGdpdmVuIHNlbGVjdG9yIGluIHRoZSByb290J3Mgc3VidHJlZS5cblx0XHRxdWVyeShyb290OiBFbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvckFyciA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHNlbGVjdG9yKSk7XG5cdFx0XHRjb25zdCB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvckFycik7XG5cblx0XHRcdHJldHVybiB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPyB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8uZWxlbWVudCA6IG51bGw7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIGdpdmVuIHNlbGVjdG9yIGluIHRoZSByb290J3Mgc3VidHJlZS5cblx0XHRxdWVyeUFsbChyb290OiBFbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvckFyciA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHNlbGVjdG9yKSk7XG5cdFx0XHRjb25zdCB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvckFycik7XG5cblx0XHRcdHJldHVybiB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPyBBcnJheS5mcm9tKHJvb3QucXVlcnlTZWxlY3RvckFsbCh2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8uc2VsZWN0b3IpKSA6IFtdO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q3J1c2hlclNlbGVjdG9yRW5naW5lOyIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzY3JvbGwoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sXG5cdHNjcm9sbERlbHRhQXJyOiBBcnJheTxudW1iZXI+LFxuXHRpc1dpbmRvdzogYm9vbGVhbiA9IHRydWVcbikge1xuXHRhd2FpdCBwYWdlLmV2YWx1YXRlKFxuXHRcdCAoW3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcktleXMsIGlzV2luZG93XTogW251bWJlcltdLCBBcnJheTxpU2VsZWN0b3JJbmZvPiwgYm9vbGVhbl0pID0+IHtcblx0XHRcdCBjb25zdCBnZXRFbGVtZW50c0J5WFBhdGggPSAoXG5cdFx0XHRcdCB4cGF0aDogc3RyaW5nLFxuXHRcdFx0XHQgcGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG5cdFx0XHQgKTogTm9kZVtdID0+IHtcblx0XHRcdFx0IGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRcdFx0IGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0XHRcdFx0IHhwYXRoLFxuXHRcdFx0XHRcdCBwYXJlbnQgfHwgZG9jdW1lbnQsXG5cdFx0XHRcdFx0IG51bGwsXG5cdFx0XHRcdFx0IFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLFxuXHRcdFx0XHRcdCBudWxsLFxuXHRcdFx0XHQgKTtcblx0XHRcdFx0IGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0IGNvbnN0IGl0ZW0gPSBxdWVyeS5zbmFwc2hvdEl0ZW0oaSk7XG5cdFx0XHRcdFx0IGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdCB9XG5cdFx0XHRcdCByZXR1cm4gcmVzdWx0cztcblx0XHRcdCB9O1xuXG5cdFx0XHQgY29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdFx0XHRcdCBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaHRtbFwiKSByZXR1cm4gXCJIVE1MXCI7XG5cdFx0XHRcdCBsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0XHRcdFx0IHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdFx0XHRcdCBpZiAoZWwuY2xhc3NOYW1lKSB7XG5cdFx0XHRcdFx0IGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdFx0XHRcdCBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdCBzdHIgKz0gXCIuXCIgKyBjbGFzc2VzW2ldO1xuXHRcdFx0XHRcdCB9XG5cdFx0XHRcdCB9XG5cdFx0XHRcdCByZXR1cm4gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKChlbCBhcyBhbnkpLnBhcmVudE5vZGUpICsgXCIgPiBcIiArIHN0cjtcblx0XHRcdCB9O1xuXG5cdFx0XHQgY29uc3QgZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIgPSAoc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPiwgcm9vdDogRWxlbWVudCB8IERvY3VtZW50ID0gZG9jdW1lbnQpID0+IHtcblx0XHRcdFx0IGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHRcdFx0IHRyeSB7XG5cdFx0XHRcdFx0XHQgaWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdFx0XHQgY29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdFx0XHQgaWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdCBjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdFx0XHQgZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdFx0ICk7XG5cblx0XHRcdFx0XHRcdFx0XHQgcmV0dXJuIHtlbGVtZW50OiBlbGVtZW50c1swXSBhcyBFbGVtZW50LCBzZWxlY3RvcjogZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRofTtcblx0XHRcdFx0XHRcdFx0IH1cblx0XHRcdFx0XHRcdCB9IGVsc2UgaWYgKHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0IHJldHVybiB7ZWxlbWVudDogcm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSEsIHNlbGVjdG9yOiBzZWxlY3Rvci52YWx1ZX07XG5cdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdCB9IGNhdGNoe31cblx0XHRcdFx0IH1cblx0XHRcdFx0IHJldHVybiBudWxsO1xuXHRcdFx0IH07XG5cblx0XHQgXHRjb25zdCBzZWxlY3RvcktleUluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvcktleXMpO1xuXHRcdCBcdGlmKCFzZWxlY3RvcktleUluZm8gJiYgIWlzV2luZG93KSB0aHJvdyBuZXcgRXJyb3IoXCJObyB2YWxpZCBzZWxlY3RvciBmb3VuZFwiKTtcblxuXHRcdFx0Y29uc3Qgc2Nyb2xsVG8gPSAgZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcikge1xuXHRcdFx0XHRjb25zdCBmaXhlZE9mZnNldCA9IG9mZnNldC50b0ZpeGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudCBhcyBhbnkpLnBhZ2VZT2Zmc2V0LnRvRml4ZWQoKSA9PT0gZml4ZWRPZmZzZXQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdG9uU2Nyb2xsKCk7XG5cdFx0XHRcdGVsZW1lbnQuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdHRvcDogb2Zmc2V0LFxuXHRcdFx0XHRcdGJlaGF2aW9yOiBcInNtb290aFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBpc1dpbmRvdz8gd2luZG93IDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcktleUluZm8hLnNlbGVjdG9yKTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzY3JvbGxEZWx0YUFyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZihzY3JvbGxEZWx0YUFycltpXSlcblx0XHRcdFx0IHNjcm9sbFRvKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHNjcm9sbERlbHRhQXJyW2ldKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFtzY3JvbGxEZWx0YUFyciwgc2VsZWN0b3JzLCBpc1dpbmRvd10sXG5cdCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzbGVlcCh0aW1lOiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdH0sIHRpbWUpO1xuXHR9KTtcbn1cbiIsImltcG9ydCB7IEVsZW1lbnRIYW5kbGUgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB0eXBlKFxuXHRlbEhhbmRsZTogRWxlbWVudEhhbmRsZSxcblx0a2V5Q29kZXM6IEFycmF5PHN0cmluZz4sXG4pIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlDb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdGF3YWl0IGVsSGFuZGxlLnByZXNzKGtleUNvZGVzW2ldKTtcblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgU0VMRUNUT1JfVFlQRSB9IGZyb20gJy4uLy4uLy4uL3VuaXF1ZS1zZWxlY3Rvci9zcmMvY29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvclNlbGVjdG9ycyhcblx0cGFnZTogUGFnZSxcblx0c2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPlxuKTogUHJvbWlzZTxpU2VsZWN0b3JJbmZvIHwgdW5kZWZpbmVkPiB7XG5cdGxldCBwbGF5d3JpZ2h0T3V0OiBpU2VsZWN0b3JJbmZvIHwgbnVsbCA9IG51bGw7XG5cdGlmKHNlbGVjdG9yc1swXS50eXBlID09IFNFTEVDVE9SX1RZUEUuUExBWVdSSUdIVCkge1xuXHRcdHRyeSB7XG5cdFx0IGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKHNlbGVjdG9yc1swXS52YWx1ZSwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xuXHRcdCBwbGF5d3JpZ2h0T3V0ID0gc2VsZWN0b3JzWzBdO1xuXHRcdH0gY2F0Y2goZXgpe31cblx0XHRzZWxlY3RvcnMuc2hpZnQoKTtcblx0fVxuXG5cdGlmKHBsYXl3cmlnaHRPdXQpIHtcblx0XHRyZXR1cm4gcGxheXdyaWdodE91dDtcblx0fVxuXG5cdGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblxuXHRyZXR1cm47XG59XG4iLCJpbXBvcnQgKiAgYXMgYWN0aW9ucyBmcm9tIFwiLi9hY3Rpb25zXCI7XG5cbm1vZHVsZS5leHBvcnRzID0gYWN0aW9ucztcbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcblxuY29uc3QgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBzdGVwSW5kZXg6IG51bWJlcik6IHN0cmluZyA9PiB7XG5cdHJldHVybiBzZWxlY3Rvci5yZXBsYWNlKC9bXlxcd1xcc10vZ2ksICcnKS5yZXBsYWNlKC8gL2csICdfJykgKyBgXyR7c3RlcEluZGV4fS5wbmdgO1xufTtcblxuY29uc3QgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0ID0gKHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4pID0+IHtcblx0cmV0dXJuIGBjcnVzaGVyPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNlbGVjdG9ycykpfWA7XG59O1xuXG5jb25zdCBwcm9taXNlVGlsbFN1Y2Nlc3MgPSAocHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55Pj4pID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzLm1hcChwID0+IHtcblx0XHQvLyBJZiBhIHJlcXVlc3QgZmFpbHMsIGNvdW50IHRoYXQgYXMgYSByZXNvbHV0aW9uIHNvIGl0IHdpbGwga2VlcFxuXHRcdC8vIHdhaXRpbmcgZm9yIG90aGVyIHBvc3NpYmxlIHN1Y2Nlc3Nlcy4gSWYgYSByZXF1ZXN0IHN1Y2NlZWRzLFxuXHRcdC8vIHRyZWF0IGl0IGFzIGEgcmVqZWN0aW9uIHNvIFByb21pc2UuYWxsIGltbWVkaWF0ZWx5IGJhaWxzIG91dC5cblx0XHRyZXR1cm4gcC50aGVuKFxuXHRcdFx0dmFsID0+IFByb21pc2UucmVqZWN0KHZhbCksXG5cdFx0XHRlcnIgPT4gUHJvbWlzZS5yZXNvbHZlKGVycilcblx0XHQpO1xuXHR9KSkudGhlbihcblx0XHQvLyBJZiAnLmFsbCcgcmVzb2x2ZWQsIHdlJ3ZlIGp1c3QgZ290IGFuIGFycmF5IG9mIGVycm9ycy5cblx0XHRlcnJvcnMgPT4gUHJvbWlzZS5yZWplY3QoZXJyb3JzKSxcblx0XHQvLyBJZiAnLmFsbCcgcmVqZWN0ZWQsIHdlJ3ZlIGdvdCB0aGUgcmVzdWx0IHdlIHdhbnRlZC5cblx0XHR2YWwgPT4gUHJvbWlzZS5yZXNvbHZlKHZhbClcblx0KTtcbn1cblxuXG5leHBvcnQgeyBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lLCB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQsIHByb21pc2VUaWxsU3VjY2VzcyB9O1xuIiwibGV0IHBhZ2VVcmw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBzZXRQYWdlVXJsKHVybDogc3RyaW5nKSB7XG5cdHBhZ2VVcmwgPSB1cmw7XG59XG5cbmZ1bmN0aW9uIGdldExhc3RTYXZlZFBhZ2VVcmwoKXtcblx0cmV0dXJuIHBhZ2VVcmw7XG59XG5cbmV4cG9ydCB7c2V0UGFnZVVybCwgZ2V0TGFzdFNhdmVkUGFnZVVybH07IiwiZXhwb3J0IGNvbnN0IFNFTEVDVE9SX1RZUEUgPSB7XG5cdElEOiAnaWQnLFxuXHRQTEFZV1JJR0hUOiAncGxheXdyaWdodCcsXG5cdERBVEFfQVRUUklCVVRFOiAnZGF0YUF0dHJpYnV0ZScsXG5cdEFUVFJJQlVURTogJ2F0dHJpYnV0ZScsXG5cdElOTkVSX1ZBTFVFOiAnaW5uZXJWYWx1ZScsXG5cdFBOQzogJ1BuQycsXG59O1xuIiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSAoKSA9PiAoW10pO1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vc3JjL2FjdGlvbnMgc3luYyByZWN1cnNpdmVcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==