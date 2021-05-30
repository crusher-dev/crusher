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
            await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(helper_1.toCrusherSelectorsFormat(selectors));
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
function click(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(helper_1.toCrusherSelectorsFormat(selectors));
            if (!elementHandle) {
                return error(`No element with selector as ${selectors[0].value} exists`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await elementHandle.dispatchEvent("click");
            // If under navigation wait for load state to complete.
            await page.waitForLoadState();
            return success({
                message: `Clicked on the element ${selectors[0].value}`,
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
            await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(helper_1.toCrusherSelectorsFormat(selectors));
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
            await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(helper_1.toCrusherSelectorsFormat(selectors));
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
            await functions_1.waitForSelectors(page, selectors);
            const elementHandle = await page.$(helper_1.toCrusherSelectorsFormat(selectors));
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
            await functions_1.waitForSelectors(page, selectors);
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, selectors, scrollDelta, false);
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
            await functions_1.waitForSelectors(page, selectors);
            await page.hover(helper_1.toCrusherSelectorsFormat(selectors));
            return success({
                message: `Hovered on the element ${selectors[0].value}`,
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
const elementFocus_1 = __importDefault(__webpack_require__(/*! ./elementFocus */ "./src/actions/elementFocus.ts"));
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
                else {
                    console.log("Invalid selector", selector);
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

"use strict";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2FkZElucHV0LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2NsaWNrLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudEN1c3RvbVNjcmlwdC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRGb2N1cy50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudFNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvYWN0aW9ucy9uYXZpZ2F0ZVVybC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvcGFnZVNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3NldERldmljZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3JlZ2lzdGVyU2VsZWN0b3JFbmdpbmUudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3Njcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3R5cGUudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvZnVuY3Rpb25zL3dhaXRGb3JTZWxlY3RvcnMudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvdXRpbHMvaGVscGVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnN8c3luYyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLHdGQUFzRDtBQUN0RCxxRkFBMkQ7QUFFM0QsU0FBd0IsUUFBUSxDQUFDLE1BQWUsRUFBRSxJQUFVO0lBQzNELE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMzQyxJQUFJO1lBQ0gsTUFB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QUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLFNBQVMsTUFBTSxDQUFDO0FBQ25GLENBQUMsQ0FBQztBQU1PLHdEQUFzQjtBQUovQixNQUFNLHdCQUF3QixHQUFHLENBQUMsU0FBK0IsRUFBRSxFQUFFO0lBQ3BFLE9BQU8sV0FBVyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNuRSxDQUFDLENBQUM7QUFFK0IsNERBQXdCOzs7Ozs7Ozs7OztBQ1Z6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUM7Ozs7OztVQ1JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N6QkEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFOzs7OztVQ0pBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZElucHV0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBpbnB1dEtleXMgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoXG5cdFx0XHRcdFx0YEF0dGVtcHQgdG8gcHJlc3Mga2V5Y29kZXMgb24gZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdFx0YXdhaXQgdHlwZShlbGVtZW50SGFuZGxlLCBpbnB1dEtleXMpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBQcmVzc2VkIGtleXMgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgYWRkaW5nIGlucHV0IHRvIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsIiBpbXBvcnQge2Fzc2VydEVsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbiBpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbiBpbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuIGltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbiBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhc3NlcnQoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0IHRyeXtcblx0XHRcdCBjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXG5cdFx0XHQgY29uc3QgdmFsaWRhdGlvblJvd3MgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbGlkYXRpb25Sb3dzO1xuXHRcdFx0IGNvbnN0IG91dHB1dCA9IGF3YWl0IGFzc2VydEVsZW1lbnQocGFnZSwgc2VsZWN0b3JzLCB2YWxpZGF0aW9uUm93cyk7XG5cblx0XHRcdCByZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdCBtZXNzYWdlOiBgU3VjY2Vzc2Z1bGx5IGFzc2VydGVkIGVsZW1lbnQgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHRcdFx0IG1ldGE6IHtvdXRwdXR9XG5cdFx0XHQgfSk7XG5cdFx0IH0gY2F0Y2goZXJyKXtcblx0XHRcdCByZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGFzc2VydGluZyBlbGVtZW50XCIpO1xuXHRcdCB9XG5cdCB9KTtcbiB9XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4uL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsaWNrKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5e1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdHJldHVybiBlcnJvcihgTm8gZWxlbWVudCB3aXRoIHNlbGVjdG9yIGFzICR7c2VsZWN0b3JzWzBdLnZhbHVlfSBleGlzdHNgKTtcblx0XHR9XG5cblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLmRpc3BhdGNoRXZlbnQoXCJjbGlja1wiKTtcblxuXHRcdC8vIElmIHVuZGVyIG5hdmlnYXRpb24gd2FpdCBmb3IgbG9hZCBzdGF0ZSB0byBjb21wbGV0ZS5cblx0XHRhd2FpdCBwYWdlLndhaXRGb3JMb2FkU3RhdGUoKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjbGlja2luZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBFbGVtZW50SGFuZGxlLCBQYWdlIH0gZnJvbSAncGxheXdyaWdodCc7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICcuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuLi9mdW5jdGlvbnMnO1xuXG5leHBvcnQgY29uc3QgcnVuU2NyaXB0T25FbGVtZW50ID0gKHNjcmlwdDogc3RyaW5nLCBlbEhhbmRsZTogRWxlbWVudEhhbmRsZSk6IFByb21pc2U8YW55PiA9PiB7XG5cdHJldHVybiBuZXcgRnVuY3Rpb24oXG5cdFx0J2V4cG9ydHMnLFxuXHRcdCdyZXF1aXJlJyxcblx0XHQnbW9kdWxlJyxcblx0XHQnX19maWxlbmFtZScsXG5cdFx0J19fZGlybmFtZScsXG5cdFx0J3NjcmlwdCcsXG5cdFx0J2VsSGFuZGxlJyxcblx0XHRgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0ICAgIHRyeXtcblx0XHRcdFx0ICAgICAgICBjb25zdCBzY3JpcHRGdW5jdGlvbiA9ICR7c2NyaXB0fTtcblx0XHRcdFx0ICAgICAgICBjb25zb2xlLmxvZyhzY3JpcHRGdW5jdGlvbik7XG5cdFx0XHRcdCAgICAgICAgcmVzb2x2ZShhd2FpdCBzY3JpcHRGdW5jdGlvbihlbEhhbmRsZSkpO1xuXHRcdFx0XHQgICAgfSBjYXRjaChlcnIpe1xuXHRcdFx0XHQgICAgICByZWplY3QoZXJyKTtcblx0XHRcdFx0ICAgIH1cblx0XHRcdFx0fSk7YCxcblx0KShleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgc2NyaXB0LCBlbEhhbmRsZSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbGVtZW50Q3VzdG9tU2NyaXB0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5e1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJCh0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBdHRlbXB0IHRvIGNhcHR1cmUgc2NyZWVuc2hvdCBvZiBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3RvcnNbMF0udmFsdWV9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1c3RvbVNjcmlwdCA9IGFjdGlvbi5wYXlsb2FkLm1ldGEuc2NyaXB0O1xuXG5cdFx0XHRjb25zdCBzY3JpcHRPdXRwdXQgPSBhd2FpdCBydW5TY3JpcHRPbkVsZW1lbnQoY3VzdG9tU2NyaXB0LCBlbGVtZW50SGFuZGxlKTtcblx0XHRcdGlmKCEhc2NyaXB0T3V0cHV0KXtcblx0XHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBc3NlcnRpb24gZmFpbGVkIGFjY29yZGluZyB0byB0aGUgc2NyaXB0IHdpdGggb3V0cHV0OiAke0pTT04uc3RyaW5naWZ5KHNjcmlwdE91dHB1dCl9YClcblx0XHRcdH1cblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHJ1bm5pbmcgc2NyaXB0IG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb2N1c09uRWxlbWVudChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0YXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJCh0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cblx0XHRcdGF3YWl0IGVsZW1lbnRIYW5kbGU/LmZvY3VzKCk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFN1Y2Nlc3NmdWxseSBmb2N1c2VkIG9uIGVsZW1lbnRgLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgZm9jdXNpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb24nO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSwgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuLi9mdW5jdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbGVtZW50U2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UsIHN0ZXBJbmRleDogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQodG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXHRcdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXR0ZW1wdCB0byBjYXB0dXJlIHNjcmVlbnNob3Qgb2YgZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IGVsZW1lbnRIYW5kbGUuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDYXB0dXJlZCBlbGVtZW50IHNjcmVlbnNob3QgZm9yICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHRcdG91dHB1dDogeyBuYW1lOiBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lKHNlbGVjdG9yc1swXS52YWx1ZSwgc3RlcEluZGV4KSwgdmFsdWU6IGVsZW1lbnRTY3JlZW5zaG90QnVmZmVyIH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoJ1NvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgY2FwdHVyaW5nIHNjcmVlbnNob3Qgb2YgZWxlbWVudCcpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgc2Nyb2xsLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0YXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBzZWxlY3RvcnMsIHNjcm9sbERlbHRhLCBmYWxzZSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gJy4uL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhvdmVyKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cblx0XHRcdGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblx0XHRcdGF3YWl0IHBhZ2UuaG92ZXIodG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBIb3ZlcmVkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGhvdmVyaW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCBhZGRJbnB1dCBmcm9tIFwiLi9hZGRJbnB1dFwiO1xuaW1wb3J0IGNsaWNrIGZyb20gXCIuL2NsaWNrXCI7XG5pbXBvcnQgaG92ZXIgZnJvbSBcIi4vaG92ZXJcIjtcbmltcG9ydCBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QgZnJvbSBcIi4vZWxlbWVudFNjcmVlbnNob3RcIjtcbmltcG9ydCBjYXB0dXJlUGFnZVNjcmVlbnNob3QgZnJvbSBcIi4vcGFnZVNjcmVlbnNob3RcIjtcbmltcG9ydCBlbGVtZW50U2Nyb2xsIGZyb20gXCIuL2VsZW1lbnRTY3JvbGxcIjtcbmltcG9ydCBwYWdlU2Nyb2xsIGZyb20gXCIuL3BhZ2VTY3JvbGxcIjtcbmltcG9ydCBuYXZpZ2F0ZVVybCBmcm9tIFwiLi9uYXZpZ2F0ZVVybFwiO1xuaW1wb3J0IHNldERldmljZSBmcm9tIFwiLi9zZXREZXZpY2VcIjtcbmltcG9ydCBhc3NlcnRFbGVtZW50IGZyb20gJy4vYXNzZXJ0RWxlbWVudCc7XG5pbXBvcnQgcnVuQ3VzdG9tU2NyaXB0IGZyb20gXCIuL2VsZW1lbnRDdXN0b21TY3JpcHRcIjtcbmltcG9ydCBmb2N1c09uRWxlbWVudCBmcm9tICcuL2VsZW1lbnRGb2N1cyc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRFbGVtZW50OiB7XG5cdFx0YWRkSW5wdXQsXG5cdFx0Y2xpY2ssXG5cdFx0aG92ZXIsXG5cdFx0c2Nyb2xsOiBlbGVtZW50U2Nyb2xsLFxuXHRcdHNjcmVlbnNob3Q6IGNhcHR1cmVFbGVtZW50U2NyZWVuc2hvdCxcblx0XHRlbGVtZW50U2Nyb2xsLFxuXHRcdGFzc2VydEVsZW1lbnQsXG5cdFx0cnVuQ3VzdG9tU2NyaXB0OiBydW5DdXN0b21TY3JpcHQsXG5cdFx0Zm9jdXM6IGZvY3VzT25FbGVtZW50XG5cdH0sXG5cdFBhZ2U6IHtcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlUGFnZVNjcmVlbnNob3QsXG5cdFx0c2Nyb2xsOiBwYWdlU2Nyb2xsLFxuXHRcdG5hdmlnYXRlOiBuYXZpZ2F0ZVVybCxcblx0fSxcblx0QnJvd3Nlcjoge1xuXHRcdHNldERldmljZSxcblx0fSxcbn07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSAncGxheXdyaWdodCc7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRlVXJsKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHVybFRvR28gPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRhd2FpdCBwYWdlLmdvdG8odXJsVG9Hbyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYE5hdmlnYXRlZCBzdWNjZXNzZnVsbHkgdG8gJHt1cmxUb0dvfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBuYXZpZ2F0aW5nIHRvIHdlYnBhZ2UnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChwYWdlOiBQYWdlLCBzdGVwSW5kZXg6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhZ2VUaXRsZSA9IGF3YWl0IHBhZ2UudGl0bGUoKTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0Y29uc3Qgc2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IHBhZ2Uuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIHBhZ2Ugc2NyZWVuc2hvdCBmb3IgJHtwYWdlVXJsfWAsXG5cdFx0XHRcdG91dHB1dDogeyBuYW1lOiBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lKHBhZ2VUaXRsZSwgc3RlcEluZGV4KSwgdmFsdWU6IHNjcmVlbnNob3RCdWZmZXIgfSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKCdTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNhcHR1cmluZyBzY3JlZW5zaG90IG9mIHBhZ2UnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHNjcm9sbCB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FwdHVyZVBhZ2VTY3JlZW5zaG90KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNjcm9sbERlbHRhID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0YXdhaXQgc2Nyb2xsKHBhZ2UsIFtdLCBzY3JvbGxEZWx0YSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyB0aGUgcGFnZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpRGV2aWNlIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9leHRlbnNpb24vZGV2aWNlXCI7XG5pbXBvcnQgeyBpVXNlckFnZW50IH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC9jb25zdGFudHMvdXNlckFnZW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzZXREZXZpY2UoYWN0aW9uOiBpQWN0aW9uKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGV2aWNlID0gYWN0aW9uLnBheWxvYWQubWV0YS5kZXZpY2UgYXMgaURldmljZTtcblx0XHRcdGNvbnN0IHVzZXJBZ2VudCA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudXNlckFnZW50IGFzIGlVc2VyQWdlbnQ7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogXCJTZXR1cCBkZXZpY2UgZm9yIHRlc3RpbmdcIixcblx0XHRcdFx0bWV0YToge1xuXHRcdFx0XHRcdHdpZHRoOiBkZXZpY2Uud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiBkZXZpY2UuaGVpZ2h0LFxuXHRcdFx0XHRcdHVzZXJBZ2VudDogdXNlckFnZW50ICYmIHVzZXJBZ2VudC52YWx1ZSA/IHVzZXJBZ2VudC52YWx1ZSA6IHVzZXJBZ2VudCxcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2V0dGluZyB0aGUgZGV2aWNlXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBc3NlcnRpb25Sb3cgfSBmcm9tICcuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9hc3NlcnRpb25Sb3cnO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXNzZXJ0RWxlbWVudEF0dHJpYnV0ZXMocGFnZTogUGFnZSwgc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPiwgYXNzZXJ0aW9uczogQXJyYXk8aUFzc2VydGlvblJvdz4pe1xuXHRhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cdGNvbnN0IGVsSGFuZGxlID0gYXdhaXQgcGFnZS4kKHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0bGV0IGhhc1Bhc3NlZCA9IHRydWU7XG5cdGNvbnN0IGxvZ3MgPSBbXTtcblxuXHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9yc1swXS52YWx1ZTtcblxuXHRmb3IobGV0IGkgPSAwOyBpIDwgYXNzZXJ0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHt2YWxpZGF0aW9uLCBvcGVyYXRpb24sIGZpZWxkfSA9IGFzc2VydGlvbnNbaV07XG5cdFx0Y29uc3QgZWxlbWVudEF0dHJpYnV0ZVZhbHVlID0gYXdhaXQgZWxIYW5kbGUhLmdldEF0dHJpYnV0ZShmaWVsZC5uYW1lKTtcblx0XHRpZihvcGVyYXRpb24gPT09IFwibWF0Y2hlc1wiKSB7XG5cdFx0XHRpZihlbGVtZW50QXR0cmlidXRlVmFsdWUgIT09IHZhbGlkYXRpb24pe1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGU9XCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZT1cIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYob3BlcmF0aW9uID09PSBcImNvbnRhaW5zXCIpIHtcblx0XHRcdGNvbnN0IGRvZXNDb250YWluID0gIGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSEuaW5jbHVkZXModmFsaWRhdGlvbik7XG5cdFx0XHRpZighZG9lc0NvbnRhaW4gKXtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlIGNvbnRhaW5zIFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGUgY29udGFpbnMgXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG9wZXJhdGlvbiA9PT0gXCJyZWdleFwiICl7XG5cdFx0XHRjb25zdCByZ3ggPSBuZXcgUmVnRXhwKHZhbGlkYXRpb24pO1xuXHRcdFx0aWYgKCFyZ3gudGVzdChlbGVtZW50QXR0cmlidXRlVmFsdWUhKSkge1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGUgbWF0Y2hlcyByZWdleDogXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlIG1hdGNoZXMgcmVnZXg6IFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBbaGFzUGFzc2VkLCBsb2dzXTtcbn1cbiIsImltcG9ydCBzY3JvbGwgZnJvbSBcIi4vc2Nyb2xsXCI7XG5pbXBvcnQgdHlwZSBmcm9tIFwiLi90eXBlXCI7XG5pbXBvcnQgd2FpdEZvclNlbGVjdG9ycyBmcm9tIFwiLi93YWl0Rm9yU2VsZWN0b3JzXCI7XG5pbXBvcnQgc2xlZXAgZnJvbSBcIi4vc2xlZXBcIjtcbmltcG9ydCBhc3NlcnRFbGVtZW50IGZyb20gJy4vYXNzZXJ0RWxlbWVudCc7XG5pbXBvcnQgZ2V0Q3J1c2hlclNlbGVjdG9yRW5naW5lIGZyb20gJy4vcmVnaXN0ZXJTZWxlY3RvckVuZ2luZSc7XG5cbmV4cG9ydCB7IHNjcm9sbCwgdHlwZSwgd2FpdEZvclNlbGVjdG9ycywgc2xlZXAsIGFzc2VydEVsZW1lbnQsIGdldENydXNoZXJTZWxlY3RvckVuZ2luZSB9O1xuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuXG5mdW5jdGlvbiBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmUoKSB7XG5cdGNvbnN0IGdldEVsZW1lbnRzQnlYUGF0aCA9IChcblx0XHR4cGF0aDogc3RyaW5nLFxuXHRcdHBhcmVudDogTm9kZSB8IG51bGwgPSBudWxsLFxuXHQpOiBOb2RlW10gPT4ge1xuXHRcdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRjb25zdCBxdWVyeSA9IGRvY3VtZW50LmV2YWx1YXRlKFxuXHRcdFx0eHBhdGgsXG5cdFx0XHRwYXJlbnQgfHwgZG9jdW1lbnQsXG5cdFx0XHRudWxsLFxuXHRcdFx0WFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEUsXG5cdFx0XHRudWxsLFxuXHRcdCk7XG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHF1ZXJ5LnNuYXBzaG90TGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRcdGNvbnN0IGl0ZW0gPSBxdWVyeS5zbmFwc2hvdEl0ZW0oaSk7XG5cdFx0XHRpZiAoaXRlbSkgcmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fTtcblxuXHRjb25zdCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgPSAoZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nID0+IHtcblx0XHRpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaHRtbFwiKSByZXR1cm4gXCJIVE1MXCI7XG5cdFx0bGV0IHN0ciA9IGVsLnRhZ05hbWU7XG5cdFx0c3RyICs9IGVsLmlkICE9IFwiXCIgPyBcIiNcIiArIGVsLmlkIDogXCJcIjtcblx0XHRpZiAoZWwuY2xhc3NOYW1lKSB7XG5cdFx0XHRjb25zdCBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLnNwbGl0KC9cXHMvKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRzdHIgKz0gXCIuXCIgKyBjbGFzc2VzW2ldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKChlbCBhcyBhbnkpLnBhcmVudE5vZGUpICsgXCIgPiBcIiArIHN0cjtcblx0fTtcblxuXHRjb25zdCBnZXRWYWxpZFNlbGVjdG9yRnJvbUFyciA9IChzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LCByb290OiBFbGVtZW50IHwgRG9jdW1lbnQgPSBkb2N1bWVudCkgPT4ge1xuXHRcdGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoc2VsZWN0b3IudHlwZSA9PT0gXCJ4cGF0aFwiKSB7XG5cdFx0XHRcdFx0Y29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdGlmIChlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aCA9IGdlbmVyYXRlUXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0ZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ge2VsZW1lbnQ6IGVsZW1lbnRzWzBdIGFzIEVsZW1lbnQsIHNlbGVjdG9yOiBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGh9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChyb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtlbGVtZW50OiByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpISwgc2VsZWN0b3I6IHNlbGVjdG9yLnZhbHVlfTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkludmFsaWQgc2VsZWN0b3JcIiwgc2VsZWN0b3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoe31cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHQvLyBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IG1hdGNoaW5nIGdpdmVuIHNlbGVjdG9yIGluIHRoZSByb290J3Mgc3VidHJlZS5cblx0XHRxdWVyeShyb290OiBFbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvckFyciA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHNlbGVjdG9yKSk7XG5cdFx0XHRjb25zdCB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvckFycik7XG5cblx0XHRcdHJldHVybiB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPyB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8uZWxlbWVudCA6IG51bGw7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIGdpdmVuIHNlbGVjdG9yIGluIHRoZSByb290J3Mgc3VidHJlZS5cblx0XHRxdWVyeUFsbChyb290OiBFbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvckFyciA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KHNlbGVjdG9yKSk7XG5cdFx0XHRjb25zdCB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvckFycik7XG5cblx0XHRcdHJldHVybiB2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8gPyBBcnJheS5mcm9tKHJvb3QucXVlcnlTZWxlY3RvckFsbCh2YWxpZFNlbGVjdG9yRWxlbWVudEluZm8uc2VsZWN0b3IpKSA6IFtdO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q3J1c2hlclNlbGVjdG9yRW5naW5lOyIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzY3JvbGwoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sXG5cdHNjcm9sbERlbHRhQXJyOiBBcnJheTxudW1iZXI+LFxuXHRpc1dpbmRvdzogYm9vbGVhbiA9IHRydWVcbikge1xuXHRhd2FpdCBwYWdlLmV2YWx1YXRlKFxuXHRcdCAoW3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcktleXMsIGlzV2luZG93XTogW251bWJlcltdLCBBcnJheTxpU2VsZWN0b3JJbmZvPiwgYm9vbGVhbl0pID0+IHtcblx0XHRcdCBjb25zdCBnZXRFbGVtZW50c0J5WFBhdGggPSAoXG5cdFx0XHRcdCB4cGF0aDogc3RyaW5nLFxuXHRcdFx0XHQgcGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG5cdFx0XHQgKTogTm9kZVtdID0+IHtcblx0XHRcdFx0IGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRcdFx0IGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0XHRcdFx0IHhwYXRoLFxuXHRcdFx0XHRcdCBwYXJlbnQgfHwgZG9jdW1lbnQsXG5cdFx0XHRcdFx0IG51bGwsXG5cdFx0XHRcdFx0IFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLFxuXHRcdFx0XHRcdCBudWxsLFxuXHRcdFx0XHQgKTtcblx0XHRcdFx0IGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0IGNvbnN0IGl0ZW0gPSBxdWVyeS5zbmFwc2hvdEl0ZW0oaSk7XG5cdFx0XHRcdFx0IGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdCB9XG5cdFx0XHRcdCByZXR1cm4gcmVzdWx0cztcblx0XHRcdCB9O1xuXG5cdFx0XHQgY29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdFx0XHRcdCBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaHRtbFwiKSByZXR1cm4gXCJIVE1MXCI7XG5cdFx0XHRcdCBsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0XHRcdFx0IHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdFx0XHRcdCBpZiAoZWwuY2xhc3NOYW1lKSB7XG5cdFx0XHRcdFx0IGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdFx0XHRcdCBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdCBzdHIgKz0gXCIuXCIgKyBjbGFzc2VzW2ldO1xuXHRcdFx0XHRcdCB9XG5cdFx0XHRcdCB9XG5cdFx0XHRcdCByZXR1cm4gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKChlbCBhcyBhbnkpLnBhcmVudE5vZGUpICsgXCIgPiBcIiArIHN0cjtcblx0XHRcdCB9O1xuXG5cdFx0XHQgY29uc3QgZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIgPSAoc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPiwgcm9vdDogRWxlbWVudCB8IERvY3VtZW50ID0gZG9jdW1lbnQpID0+IHtcblx0XHRcdFx0IGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHRcdFx0IHRyeSB7XG5cdFx0XHRcdFx0XHQgaWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdFx0XHQgY29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdFx0XHQgaWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdCBjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdFx0XHQgZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdFx0ICk7XG5cblx0XHRcdFx0XHRcdFx0XHQgcmV0dXJuIHtlbGVtZW50OiBlbGVtZW50c1swXSBhcyBFbGVtZW50LCBzZWxlY3RvcjogZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRofTtcblx0XHRcdFx0XHRcdFx0IH1cblx0XHRcdFx0XHRcdCB9IGVsc2UgaWYgKHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkpIHtcblx0XHRcdFx0XHRcdFx0IHJldHVybiB7ZWxlbWVudDogcm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSEsIHNlbGVjdG9yOiBzZWxlY3Rvci52YWx1ZX07XG5cdFx0XHRcdFx0XHQgfVxuXHRcdFx0XHRcdCB9IGNhdGNoe31cblx0XHRcdFx0IH1cblx0XHRcdFx0IHJldHVybiBudWxsO1xuXHRcdFx0IH07XG5cblx0XHQgXHRjb25zdCBzZWxlY3RvcktleUluZm8gPSBnZXRWYWxpZFNlbGVjdG9yRnJvbUFycihzZWxlY3RvcktleXMpO1xuXHRcdCBcdGlmKCFzZWxlY3RvcktleUluZm8gJiYgIWlzV2luZG93KSB0aHJvdyBuZXcgRXJyb3IoXCJObyB2YWxpZCBzZWxlY3RvciBmb3VuZFwiKTtcblxuXHRcdFx0Y29uc3Qgc2Nyb2xsVG8gPSAgZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcikge1xuXHRcdFx0XHRjb25zdCBmaXhlZE9mZnNldCA9IG9mZnNldC50b0ZpeGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudCBhcyBhbnkpLnBhZ2VZT2Zmc2V0LnRvRml4ZWQoKSA9PT0gZml4ZWRPZmZzZXQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdG9uU2Nyb2xsKCk7XG5cdFx0XHRcdGVsZW1lbnQuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdHRvcDogb2Zmc2V0LFxuXHRcdFx0XHRcdGJlaGF2aW9yOiBcInNtb290aFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBpc1dpbmRvdz8gd2luZG93IDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcktleUluZm8hLnNlbGVjdG9yKTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzY3JvbGxEZWx0YUFyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHQgc2Nyb2xsVG8oZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgc2Nyb2xsRGVsdGFBcnJbaV0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0W3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcnMsIGlzV2luZG93XSxcblx0KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSwgdGltZSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHR5cGUoXG5cdGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlLFxuXHRrZXlDb2RlczogQXJyYXk8c3RyaW5nPixcbikge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleUNvZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXdhaXQgZWxIYW5kbGUucHJlc3Moa2V5Q29kZXNbaV0pO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JTZWxlY3RvcnMoXG5cdHBhZ2U6IFBhZ2UsXG5cdHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz5cbikge1xuXHRhd2FpdCBwYWdlLndhaXRGb3JTZWxlY3Rvcih0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuXG5jb25zdCBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lID0gKHNlbGVjdG9yOiBzdHJpbmcsIHN0ZXBJbmRleDogbnVtYmVyKTogc3RyaW5nID0+IHtcblx0cmV0dXJuIHNlbGVjdG9yLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgJycpLnJlcGxhY2UoLyAvZywgJ18nKSArIGBfJHtzdGVwSW5kZXh9LnBuZ2A7XG59O1xuXG5jb25zdCB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgPSAoc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPikgPT4ge1xuXHRyZXR1cm4gYGNydXNoZXI9JHtlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc2VsZWN0b3JzKSl9YDtcbn07XG5cbmV4cG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUsIHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9O1xuIiwiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSAoKSA9PiAoW10pO1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vc3JjL2FjdGlvbnMgc3luYyByZWN1cnNpdmVcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FjdGlvbnMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9