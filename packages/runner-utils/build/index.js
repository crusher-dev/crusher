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
                meta: { output },
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
    return new Function("exports", "require", "module", "__filename", "__dirname", "script", "elHandle", `return new Promise(async function (resolve, reject) {
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
                output: {
                    name: helper_1.generateScreenshotName(selectors[0].value, stepIndex),
                    value: elementScreenshotBuffer,
                },
            });
        }
        catch (err) {
            console.log(err);
            return error("Some issue occurred while capturing screenshot of element");
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
            return error("Some issue occurred while navigating to webpage");
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
                output: {
                    name: helper_1.generateScreenshotName(pageTitle, stepIndex),
                    value: screenshotBuffer,
                },
            });
        }
        catch (err) {
            return error("Some issue occurred while capturing screenshot of page");
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
                        return {
                            element: elements[0],
                            selector: elementSelectorFromXpath,
                        };
                    }
                }
                else if (root.querySelector(selector.value)) {
                    return {
                        element: root.querySelector(selector.value),
                        selector: selector.value,
                    };
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
        },
    };
}
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
exports.Utils = exports.Functions = exports.Middlewares = exports.Actions = void 0;
const Actions = __importStar(__webpack_require__(/*! ./actions */ "./src/actions/index.ts"));
exports.Actions = Actions;
const Middlewares = __importStar(__webpack_require__(/*! ./middlewares */ "./src/middlewares/index.ts"));
exports.Middlewares = Middlewares;
const Functions = __importStar(__webpack_require__(/*! ./functions */ "./src/functions/index.ts"));
exports.Functions = Functions;
const Utils = __importStar(__webpack_require__(/*! ./utils */ "./src/utils/index.ts"));
exports.Utils = Utils;


/***/ }),

/***/ "./src/middlewares/index.ts":
/*!**********************************!*\
  !*** ./src/middlewares/index.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const popup_1 = __webpack_require__(/*! ./popup */ "./src/middlewares/popup.ts");
module.exports = { handlePopup: popup_1.handlePopup };


/***/ }),

/***/ "./src/middlewares/popup.ts":
/*!**********************************!*\
  !*** ./src/middlewares/popup.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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


/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getValidSelectorFromArr = exports.generateQuerySelector = exports.getElementsByXPath = void 0;
const getValidSelectorFromArr = (selectors, root = document) => {
    for (const selector of selectors) {
        try {
            if (selector.type === "xpath") {
                const elements = getElementsByXPath(selector.value);
                if (elements.length) {
                    const elementSelectorFromXpath = generateQuerySelector(elements[0]);
                    return {
                        element: elements[0],
                        selector: elementSelectorFromXpath,
                    };
                }
            }
            else if (root.querySelector(selector.value)) {
                return {
                    element: root.querySelector(selector.value),
                    selector: selector.value,
                };
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

/***/ "./src/utils/helper.ts":
/*!*****************************!*\
  !*** ./src/utils/helper.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.promiseTillSuccess = exports.toCrusherSelectorsFormat = exports.generateScreenshotName = void 0;
const generateScreenshotName = (selector, stepIndex) => {
    return selector.replace(/[^\w\s]/gi, "").replace(/ /g, "_") + `_${stepIndex}.png`;
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

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
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
const dom = __importStar(__webpack_require__(/*! ./dom */ "./src/utils/dom.ts"));
module.exports = {
    dom,
};


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2FkZElucHV0LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2NsaWNrLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudEN1c3RvbVNjcmlwdC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRGb2N1cy50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2VsZW1lbnRTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvZWxlbWVudFNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvYWN0aW9ucy9uYXZpZ2F0ZVVybC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnMvcGFnZVNjcm9sbC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3NldERldmljZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9hY3Rpb25zL3dhaXRGb3JOYXZpZ2F0aW9uLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9hc3NlcnRFbGVtZW50LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvcmVnaXN0ZXJTZWxlY3RvckVuZ2luZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2Z1bmN0aW9ucy9zbGVlcC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvdHlwZS50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9taWRkbGV3YXJlcy9pbmRleC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy9taWRkbGV3YXJlcy9wb3B1cC50cyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy8uL3NyYy91dGlscy9kb20udHMiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvLi9zcmMvdXRpbHMvaGVscGVyLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL3V0aWxzL3N0YXRlLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4uL3VuaXF1ZS1zZWxlY3Rvci9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzLy4vc3JjL2FjdGlvbnN8c3luYyIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jcnVzaGVyLXJ1bm5lci11dGlscy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NydXNoZXItcnVubmVyLXV0aWxzL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vY3J1c2hlci1ydW5uZXItdXRpbHMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLHdGQUFzRDtBQUN0RCxxRkFBMkQ7QUFFM0QsU0FBd0IsUUFBUSxDQUFDLE1BQWUsRUFBRSxJQUFVO0lBQzNELE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMzQyxJQUFJO1lBQ0gsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUE0QixDQUFDO1lBQzlELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUU1QyxNQUFNLE1BQU0sR0FBRyxNQUFNLDRCQUFnQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN2RCxNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQ0FBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hHLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ25CLE9BQU8sS0FBSyxDQUFDLCtEQUErRCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNsRztZQUVELE1BQU0sYUFBYSxDQUFDLHNCQUFzQixFQUFFLENB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bEIsU0FBUyxtQkFBbUI7SUFDM0IsT0FBTyxPQUFPLENBQUM7QUFDaEIsQ0FBQztBQUVtQixrREFBbUI7Ozs7Ozs7Ozs7Ozs7OztBQ1YxQixxQkFBYSxHQUFHO0lBQzVCLEVBQUUsRUFBRSxJQUFJO0lBQ1IsVUFBVSxFQUFFLFlBQVk7SUFDeEIsY0FBYyxFQUFFLGVBQWU7SUFDL0IsU0FBUyxFQUFFLFdBQVc7SUFDdEIsV0FBVyxFQUFFLFlBQVk7SUFDekIsR0FBRyxFQUFFLEtBQUs7Q0FDVixDQUFDOzs7Ozs7Ozs7OztBQ1BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQzs7Ozs7O1VDUkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3pCQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEU7Ozs7O1VDSkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSBcIi4uL3V0aWxzL2hlbHBlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRJbnB1dChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3QgaW5wdXRLZXlzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChvdXRwdXQgPyBvdXRwdXQudmFsdWUgOiB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBdHRlbXB0IHRvIHByZXNzIGtleWNvZGVzIG9uIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yc1swXS52YWx1ZX1gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG5cdFx0XHRhd2FpdCB0eXBlKGVsZW1lbnRIYW5kbGUsIGlucHV0S2V5cyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFByZXNzZWQga2V5cyBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yc1swXS52YWx1ZX1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGFkZGluZyBpbnB1dCB0byBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBhc3NlcnRFbGVtZW50IH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXNzZXJ0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cblx0XHRcdGNvbnN0IHZhbGlkYXRpb25Sb3dzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWxpZGF0aW9uUm93cztcblx0XHRcdGNvbnN0IG91dHB1dCA9IGF3YWl0IGFzc2VydEVsZW1lbnQocGFnZSwgc2VsZWN0b3JzLCB2YWxpZGF0aW9uUm93cyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFN1Y2Nlc3NmdWxseSBhc3NlcnRlZCBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHRcdG1ldGE6IHsgb3V0cHV0IH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgYXNzZXJ0aW5nIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcbmltcG9ydCB7IHNldFBhZ2VVcmwgfSBmcm9tICcuLi91dGlscy9zdGF0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsaWNrKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0c2V0UGFnZVVybChhd2FpdCBwYWdlLnVybCgpKTtcblx0XHR0cnl7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdHJldHVybiBlcnJvcihgTm8gZWxlbWVudCB3aXRoIHNlbGVjdG9yIGFzICR7c2VsZWN0b3JzWzBdLnZhbHVlfSBleGlzdHNgKTtcblx0XHR9XG5cblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLmRpc3BhdGNoRXZlbnQoXCJjbGlja1wiKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjbGlja2luZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBFbGVtZW50SGFuZGxlLCBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gXCIuLi91dGlscy9oZWxwZXJcIjtcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBjb25zdCBydW5TY3JpcHRPbkVsZW1lbnQgPSAoc2NyaXB0OiBzdHJpbmcsIGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlKTogUHJvbWlzZTxhbnk+ID0+IHtcblx0cmV0dXJuIG5ldyBGdW5jdGlvbihcblx0XHRcImV4cG9ydHNcIixcblx0XHRcInJlcXVpcmVcIixcblx0XHRcIm1vZHVsZVwiLFxuXHRcdFwiX19maWxlbmFtZVwiLFxuXHRcdFwiX19kaXJuYW1lXCIsXG5cdFx0XCJzY3JpcHRcIixcblx0XHRcImVsSGFuZGxlXCIsXG5cdFx0YHJldHVybiBuZXcgUHJvbWlzZShhc3luYyBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdCAgICB0cnl7XG5cdFx0XHRcdCAgICAgICAgY29uc3Qgc2NyaXB0RnVuY3Rpb24gPSAke3NjcmlwdH07XG5cdFx0XHRcdCAgICAgICAgY29uc29sZS5sb2coc2NyaXB0RnVuY3Rpb24pO1xuXHRcdFx0XHQgICAgICAgIHJlc29sdmUoYXdhaXQgc2NyaXB0RnVuY3Rpb24oZWxIYW5kbGUpKTtcblx0XHRcdFx0ICAgIH0gY2F0Y2goZXJyKXtcblx0XHRcdFx0ICAgICAgcmVqZWN0KGVycik7XG5cdFx0XHRcdCAgICB9XG5cdFx0XHRcdH0pO2AsXG5cdCkoZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHNjcmlwdCwgZWxIYW5kbGUpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudEN1c3RvbVNjcmlwdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gY2FwdHVyZSBzY3JlZW5zaG90IG9mIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yc1swXS52YWx1ZX1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VzdG9tU2NyaXB0ID0gYWN0aW9uLnBheWxvYWQubWV0YS5zY3JpcHQ7XG5cblx0XHRcdGNvbnN0IHNjcmlwdE91dHB1dCA9IGF3YWl0IHJ1blNjcmlwdE9uRWxlbWVudChjdXN0b21TY3JpcHQsIGVsZW1lbnRIYW5kbGUpO1xuXHRcdFx0aWYgKCEhc2NyaXB0T3V0cHV0KSB7XG5cdFx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yc1swXS52YWx1ZX1gLFxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXNzZXJ0aW9uIGZhaWxlZCBhY2NvcmRpbmcgdG8gdGhlIHNjcmlwdCB3aXRoIG91dHB1dDogJHtKU09OLnN0cmluZ2lmeShzY3JpcHRPdXRwdXQpfWApO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBydW5uaW5nIHNjcmlwdCBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSBcIi4uL3V0aWxzL2hlbHBlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb2N1c09uRWxlbWVudChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChvdXRwdXQgPyBvdXRwdXQudmFsdWUgOiB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cblx0XHRcdGF3YWl0IGVsZW1lbnRIYW5kbGU/LmZvY3VzKCk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFN1Y2Nlc3NmdWxseSBmb2N1c2VkIG9uIGVsZW1lbnRgLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBmb2N1c2luZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lLCB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tIFwiLi4vdXRpbHMvaGVscGVyXCI7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbGVtZW50U2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UsIHN0ZXBJbmRleDogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IG91dHB1dCA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQob3V0cHV0ID8gb3V0cHV0LnZhbHVlIDogdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0KHNlbGVjdG9ycykpO1xuXHRcdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXR0ZW1wdCB0byBjYXB0dXJlIHNjcmVlbnNob3Qgb2YgZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3JzWzBdLnZhbHVlfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IGVsZW1lbnRIYW5kbGUuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDYXB0dXJlZCBlbGVtZW50IHNjcmVlbnNob3QgZm9yICR7c2VsZWN0b3JzWzBdLnZhbHVlfWAsXG5cdFx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRcdG5hbWU6IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUoc2VsZWN0b3JzWzBdLnZhbHVlLCBzdGVwSW5kZXgpLFxuXHRcdFx0XHRcdHZhbHVlOiBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlcixcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgY2FwdHVyaW5nIHNjcmVlbnNob3Qgb2YgZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHNjcm9sbCwgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IG91dHB1dCA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRGVsdGEgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXHRcdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRhd2FpdCBzY3JvbGwocGFnZSwgb3V0cHV0ID8gW291dHB1dF0gOiBzZWxlY3RvcnMsIHNjcm9sbERlbHRhLCBmYWxzZSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2Nyb2xsaW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdCB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaG92ZXIoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblxuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXHRcdFx0YXdhaXQgcGFnZS5ob3ZlcihvdXRwdXQgPyBvdXRwdXQudmFsdWUgOiB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQoc2VsZWN0b3JzKSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYEhvdmVyZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3RvcnNbMF0udmFsdWV9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgaG92ZXJpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IGFkZElucHV0IGZyb20gXCIuL2FkZElucHV0XCI7XG5pbXBvcnQgY2xpY2sgZnJvbSBcIi4vY2xpY2tcIjtcbmltcG9ydCBob3ZlciBmcm9tIFwiLi9ob3ZlclwiO1xuaW1wb3J0IGNhcHR1cmVFbGVtZW50U2NyZWVuc2hvdCBmcm9tIFwiLi9lbGVtZW50U2NyZWVuc2hvdFwiO1xuaW1wb3J0IGNhcHR1cmVQYWdlU2NyZWVuc2hvdCBmcm9tIFwiLi9wYWdlU2NyZWVuc2hvdFwiO1xuaW1wb3J0IGVsZW1lbnRTY3JvbGwgZnJvbSBcIi4vZWxlbWVudFNjcm9sbFwiO1xuaW1wb3J0IHBhZ2VTY3JvbGwgZnJvbSBcIi4vcGFnZVNjcm9sbFwiO1xuaW1wb3J0IG5hdmlnYXRlVXJsIGZyb20gXCIuL25hdmlnYXRlVXJsXCI7XG5pbXBvcnQgc2V0RGV2aWNlIGZyb20gXCIuL3NldERldmljZVwiO1xuaW1wb3J0IGFzc2VydEVsZW1lbnQgZnJvbSAnLi9hc3NlcnRFbGVtZW50JztcbmltcG9ydCBydW5DdXN0b21TY3JpcHQgZnJvbSBcIi4vZWxlbWVudEN1c3RvbVNjcmlwdFwiO1xuaW1wb3J0IGZvY3VzT25FbGVtZW50IGZyb20gJy4vZWxlbWVudEZvY3VzJztcbmltcG9ydCB3YWl0Rm9yTmF2aWdhdGlvbiBmcm9tICcuL3dhaXRGb3JOYXZpZ2F0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdEVsZW1lbnQ6IHtcblx0XHRhZGRJbnB1dCxcblx0XHRjbGljayxcblx0XHRob3Zlcixcblx0XHRzY3JvbGw6IGVsZW1lbnRTY3JvbGwsXG5cdFx0c2NyZWVuc2hvdDogY2FwdHVyZUVsZW1lbnRTY3JlZW5zaG90LFxuXHRcdGVsZW1lbnRTY3JvbGwsXG5cdFx0YXNzZXJ0RWxlbWVudCxcblx0XHRydW5DdXN0b21TY3JpcHQ6IHJ1bkN1c3RvbVNjcmlwdCxcblx0XHRmb2N1czogZm9jdXNPbkVsZW1lbnRcblx0fSxcblx0UGFnZToge1xuXHRcdHNjcmVlbnNob3Q6IGNhcHR1cmVQYWdlU2NyZWVuc2hvdCxcblx0XHRzY3JvbGw6IHBhZ2VTY3JvbGwsXG5cdFx0bmF2aWdhdGU6IG5hdmlnYXRlVXJsLFxuXHRcdHdhaXRGb3JOYXZpZ2F0aW9uOiB3YWl0Rm9yTmF2aWdhdGlvblxuXHR9LFxuXHRCcm93c2VyOiB7XG5cdFx0c2V0RGV2aWNlLFxuXHR9LFxufTtcbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRlVXJsKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHVybFRvR28gPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRhd2FpdCBwYWdlLmdvdG8odXJsVG9Hbyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYE5hdmlnYXRlZCBzdWNjZXNzZnVsbHkgdG8gJHt1cmxUb0dvfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgbmF2aWdhdGluZyB0byB3ZWJwYWdlXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUgfSBmcm9tIFwiLi4vdXRpbHMvaGVscGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChwYWdlOiBQYWdlLCBzdGVwSW5kZXg6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhZ2VUaXRsZSA9IGF3YWl0IHBhZ2UudGl0bGUoKTtcblx0XHRcdGNvbnN0IHBhZ2VVcmwgPSBhd2FpdCBwYWdlLnVybCgpO1xuXHRcdFx0Y29uc3Qgc2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IHBhZ2Uuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIHBhZ2Ugc2NyZWVuc2hvdCBmb3IgJHtwYWdlVXJsfWAsXG5cdFx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRcdG5hbWU6IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUocGFnZVRpdGxlLCBzdGVwSW5kZXgpLFxuXHRcdFx0XHRcdHZhbHVlOiBzY3JlZW5zaG90QnVmZmVyLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNhcHR1cmluZyBzY3JlZW5zaG90IG9mIHBhZ2VcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBzY3JvbGwgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBbXSwgc2Nyb2xsRGVsdGEpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyB0aGUgcGFnZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpRGV2aWNlIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9leHRlbnNpb24vZGV2aWNlXCI7XG5pbXBvcnQgeyBpVXNlckFnZW50IH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC9jb25zdGFudHMvdXNlckFnZW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzZXREZXZpY2UoYWN0aW9uOiBpQWN0aW9uKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGV2aWNlID0gYWN0aW9uLnBheWxvYWQubWV0YS5kZXZpY2UgYXMgaURldmljZTtcblx0XHRcdGNvbnN0IHVzZXJBZ2VudCA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudXNlckFnZW50IGFzIGlVc2VyQWdlbnQ7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogXCJTZXR1cCBkZXZpY2UgZm9yIHRlc3RpbmdcIixcblx0XHRcdFx0bWV0YToge1xuXHRcdFx0XHRcdHdpZHRoOiBkZXZpY2Uud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiBkZXZpY2UuaGVpZ2h0LFxuXHRcdFx0XHRcdHVzZXJBZ2VudDogdXNlckFnZW50ICYmIHVzZXJBZ2VudC52YWx1ZSA/IHVzZXJBZ2VudC52YWx1ZSA6IHVzZXJBZ2VudCxcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBzZXR0aW5nIHRoZSBkZXZpY2VcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRMYXN0U2F2ZWRQYWdlVXJsIH0gZnJvbSAnLi4vdXRpbHMvc3RhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3YWl0Rm9yTmF2aWdhdGlvbihhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjdXJyZW50VXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGNvbnN0IGxhc3RTYXZlZFVybCA9IGdldExhc3RTYXZlZFBhZ2VVcmwoKTtcblx0XHRcdGlmKGN1cnJlbnRVcmwgPT09IGxhc3RTYXZlZFVybCkge1xuXHRcdFx0XHRhd2FpdCBwYWdlLndhaXRGb3JOYXZpZ2F0aW9uKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhd2FpdCBwYWdlLndhaXRGb3JMb2FkU3RhdGUoKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFdhaXRlZCBmb3IgbmF2aWdhdGlvbiBzdWNjZXNzZnVsbHlgLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiRXJyb3Igb2NjdXJlZCB3aGlsZSB3YWl0aW5nIGZvciBuYXZpZ2F0aW9uXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBc3NlcnRpb25Sb3cgfSBmcm9tICcuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9hc3NlcnRpb25Sb3cnO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm8nO1xuaW1wb3J0IHsgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXNzZXJ0RWxlbWVudEF0dHJpYnV0ZXMocGFnZTogUGFnZSwgc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPiwgYXNzZXJ0aW9uczogQXJyYXk8aUFzc2VydGlvblJvdz4pe1xuXHRjb25zdCBvdXRwdXQgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cdGNvbnN0IGVsSGFuZGxlID0gYXdhaXQgcGFnZS4kKG91dHB1dCA/IG91dHB1dC52YWx1ZSA6IHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblx0bGV0IGhhc1Bhc3NlZCA9IHRydWU7XG5cdGNvbnN0IGxvZ3MgPSBbXTtcblxuXHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9yc1swXS52YWx1ZTtcblxuXHRmb3IobGV0IGkgPSAwOyBpIDwgYXNzZXJ0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IHt2YWxpZGF0aW9uLCBvcGVyYXRpb24sIGZpZWxkfSA9IGFzc2VydGlvbnNbaV07XG5cdFx0Y29uc3QgZWxlbWVudEF0dHJpYnV0ZVZhbHVlID0gYXdhaXQgZWxIYW5kbGUhLmdldEF0dHJpYnV0ZShmaWVsZC5uYW1lKTtcblx0XHRpZihvcGVyYXRpb24gPT09IFwibWF0Y2hlc1wiKSB7XG5cdFx0XHRpZihlbGVtZW50QXR0cmlidXRlVmFsdWUgIT09IHZhbGlkYXRpb24pe1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGU9XCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZT1cIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYob3BlcmF0aW9uID09PSBcImNvbnRhaW5zXCIpIHtcblx0XHRcdGNvbnN0IGRvZXNDb250YWluID0gIGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSEuaW5jbHVkZXModmFsaWRhdGlvbik7XG5cdFx0XHRpZighZG9lc0NvbnRhaW4gKXtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlIGNvbnRhaW5zIFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGUgY29udGFpbnMgXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG9wZXJhdGlvbiA9PT0gXCJyZWdleFwiICl7XG5cdFx0XHRjb25zdCByZ3ggPSBuZXcgUmVnRXhwKHZhbGlkYXRpb24pO1xuXHRcdFx0aWYgKCFyZ3gudGVzdChlbGVtZW50QXR0cmlidXRlVmFsdWUhKSkge1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGUgbWF0Y2hlcyByZWdleDogXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlIG1hdGNoZXMgcmVnZXg6IFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBbaGFzUGFzc2VkLCBsb2dzXTtcbn1cbiIsImltcG9ydCBzY3JvbGwgZnJvbSBcIi4vc2Nyb2xsXCI7XG5pbXBvcnQgdHlwZSBmcm9tIFwiLi90eXBlXCI7XG5pbXBvcnQgd2FpdEZvclNlbGVjdG9ycyBmcm9tIFwiLi93YWl0Rm9yU2VsZWN0b3JzXCI7XG5pbXBvcnQgc2xlZXAgZnJvbSBcIi4vc2xlZXBcIjtcbmltcG9ydCBhc3NlcnRFbGVtZW50IGZyb20gXCIuL2Fzc2VydEVsZW1lbnRcIjtcbmltcG9ydCBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmUgZnJvbSBcIi4vcmVnaXN0ZXJTZWxlY3RvckVuZ2luZVwiO1xuXG5leHBvcnQgeyBzY3JvbGwsIHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMsIHNsZWVwLCBhc3NlcnRFbGVtZW50LCBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmUgfTtcbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5mdW5jdGlvbiBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmUoKSB7XG5cdGNvbnN0IGdldEVsZW1lbnRzQnlYUGF0aCA9ICh4cGF0aDogc3RyaW5nLCBwYXJlbnQ6IE5vZGUgfCBudWxsID0gbnVsbCk6IE5vZGVbXSA9PiB7XG5cdFx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRcdGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoeHBhdGgsIHBhcmVudCB8fCBkb2N1bWVudCwgbnVsbCwgWFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEUsIG51bGwpO1xuXHRcdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0XHRjb25zdCBpdGVtID0gcXVlcnkuc25hcHNob3RJdGVtKGkpO1xuXHRcdFx0aWYgKGl0ZW0pIHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH07XG5cblx0Y29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdFx0aWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIikgcmV0dXJuIFwiSFRNTFwiO1xuXHRcdGxldCBzdHIgPSBlbC50YWdOYW1lO1xuXHRcdHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdFx0aWYgKGVsLmNsYXNzTmFtZSkge1xuXHRcdFx0Y29uc3QgY2xhc3NlcyA9IGVsLmNsYXNzTmFtZS5zcGxpdCgvXFxzLyk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c3RyICs9IFwiLlwiICsgY2xhc3Nlc1tpXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGdlbmVyYXRlUXVlcnlTZWxlY3RvcigoZWwgYXMgYW55KS5wYXJlbnROb2RlKSArIFwiID4gXCIgKyBzdHI7XG5cdH07XG5cblx0Y29uc3QgZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIgPSAoc2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPiwgcm9vdDogRWxlbWVudCB8IERvY3VtZW50ID0gZG9jdW1lbnQpID0+IHtcblx0XHRmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdGNvbnN0IGVsZW1lbnRzID0gZ2V0RWxlbWVudHNCeVhQYXRoKHNlbGVjdG9yLnZhbHVlKTtcblx0XHRcdFx0XHRpZiAoZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50c1swXSBhcyBFbGVtZW50LFxuXHRcdFx0XHRcdFx0XHRzZWxlY3RvcjogZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoLFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAocm9vdC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSkge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRlbGVtZW50OiByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpISxcblx0XHRcdFx0XHRcdHNlbGVjdG9yOiBzZWxlY3Rvci52YWx1ZSxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIHt9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0Ly8gUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBtYXRjaGluZyBnaXZlbiBzZWxlY3RvciBpbiB0aGUgcm9vdCdzIHN1YnRyZWUuXG5cdFx0cXVlcnkocm9vdDogRWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JBcnIgPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChzZWxlY3RvcikpO1xuXHRcdFx0Y29uc3QgdmFsaWRTZWxlY3RvckVsZW1lbnRJbmZvID0gZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIoc2VsZWN0b3JBcnIpO1xuXG5cdFx0XHRyZXR1cm4gdmFsaWRTZWxlY3RvckVsZW1lbnRJbmZvID8gdmFsaWRTZWxlY3RvckVsZW1lbnRJbmZvLmVsZW1lbnQgOiBudWxsO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIGFsbCBlbGVtZW50cyBtYXRjaGluZyBnaXZlbiBzZWxlY3RvciBpbiB0aGUgcm9vdCdzIHN1YnRyZWUuXG5cdFx0cXVlcnlBbGwocm9vdDogRWxlbWVudCwgc2VsZWN0b3I6IHN0cmluZykge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JBcnIgPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChzZWxlY3RvcikpO1xuXHRcdFx0Y29uc3QgdmFsaWRTZWxlY3RvckVsZW1lbnRJbmZvID0gZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIoc2VsZWN0b3JBcnIpO1xuXG5cdFx0XHRyZXR1cm4gdmFsaWRTZWxlY3RvckVsZW1lbnRJbmZvID8gQXJyYXkuZnJvbShyb290LnF1ZXJ5U2VsZWN0b3JBbGwodmFsaWRTZWxlY3RvckVsZW1lbnRJbmZvLnNlbGVjdG9yKSkgOiBbXTtcblx0XHR9LFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRDcnVzaGVyU2VsZWN0b3JFbmdpbmU7XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2Nyb2xsKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LFxuXHRzY3JvbGxEZWx0YUFycjogQXJyYXk8bnVtYmVyPixcblx0aXNXaW5kb3c6IGJvb2xlYW4gPSB0cnVlXG4pIHtcblx0YXdhaXQgcGFnZS5ldmFsdWF0ZShcblx0XHQgKFtzY3JvbGxEZWx0YUFyciwgc2VsZWN0b3JLZXlzLCBpc1dpbmRvd106IFtudW1iZXJbXSwgQXJyYXk8aVNlbGVjdG9ySW5mbz4sIGJvb2xlYW5dKSA9PiB7XG5cdFx0XHQgY29uc3QgZ2V0RWxlbWVudHNCeVhQYXRoID0gKFxuXHRcdFx0XHQgeHBhdGg6IHN0cmluZyxcblx0XHRcdFx0IHBhcmVudDogTm9kZSB8IG51bGwgPSBudWxsLFxuXHRcdFx0ICk6IE5vZGVbXSA9PiB7XG5cdFx0XHRcdCBjb25zdCByZXN1bHRzID0gW107XG5cdFx0XHRcdCBjb25zdCBxdWVyeSA9IGRvY3VtZW50LmV2YWx1YXRlKFxuXHRcdFx0XHRcdCB4cGF0aCxcblx0XHRcdFx0XHQgcGFyZW50IHx8IGRvY3VtZW50LFxuXHRcdFx0XHRcdCBudWxsLFxuXHRcdFx0XHRcdCBYUGF0aFJlc3VsdC5PUkRFUkVEX05PREVfU05BUFNIT1RfVFlQRSxcblx0XHRcdFx0XHQgbnVsbCxcblx0XHRcdFx0ICk7XG5cdFx0XHRcdCBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcXVlcnkuc25hcHNob3RMZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdCBjb25zdCBpdGVtID0gcXVlcnkuc25hcHNob3RJdGVtKGkpO1xuXHRcdFx0XHRcdCBpZiAoaXRlbSkgcmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHQgfVxuXHRcdFx0XHQgcmV0dXJuIHJlc3VsdHM7XG5cdFx0XHQgfTtcblxuXHRcdFx0IGNvbnN0IGdlbmVyYXRlUXVlcnlTZWxlY3RvciA9IChlbDogSFRNTEVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuXHRcdFx0XHQgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIikgcmV0dXJuIFwiSFRNTFwiO1xuXHRcdFx0XHQgbGV0IHN0ciA9IGVsLnRhZ05hbWU7XG5cdFx0XHRcdCBzdHIgKz0gZWwuaWQgIT0gXCJcIiA/IFwiI1wiICsgZWwuaWQgOiBcIlwiO1xuXHRcdFx0XHQgaWYgKGVsLmNsYXNzTmFtZSkge1xuXHRcdFx0XHRcdCBjb25zdCBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLnNwbGl0KC9cXHMvKTtcblx0XHRcdFx0XHQgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHQgc3RyICs9IFwiLlwiICsgY2xhc3Nlc1tpXTtcblx0XHRcdFx0XHQgfVxuXHRcdFx0XHQgfVxuXHRcdFx0XHQgcmV0dXJuIGdlbmVyYXRlUXVlcnlTZWxlY3RvcigoZWwgYXMgYW55KS5wYXJlbnROb2RlKSArIFwiID4gXCIgKyBzdHI7XG5cdFx0XHQgfTtcblxuXHRcdFx0IGNvbnN0IGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyID0gKHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sIHJvb3Q6IEVsZW1lbnQgfCBEb2N1bWVudCA9IGRvY3VtZW50KSA9PiB7XG5cdFx0XHRcdCBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuXHRcdFx0XHRcdCB0cnkge1xuXHRcdFx0XHRcdFx0IGlmIChzZWxlY3Rvci50eXBlID09PSBcInhwYXRoXCIpIHtcblx0XHRcdFx0XHRcdFx0IGNvbnN0IGVsZW1lbnRzID0gZ2V0RWxlbWVudHNCeVhQYXRoKHNlbGVjdG9yLnZhbHVlKTtcblx0XHRcdFx0XHRcdFx0IGlmIChlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHQgY29uc3QgZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoID0gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0XHRcdFx0IGVsZW1lbnRzWzBdIGFzIEhUTUxFbGVtZW50LFxuXHRcdFx0XHRcdFx0XHRcdCApO1xuXG5cdFx0XHRcdFx0XHRcdFx0IHJldHVybiB7ZWxlbWVudDogZWxlbWVudHNbMF0gYXMgRWxlbWVudCwgc2VsZWN0b3I6IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aH07XG5cdFx0XHRcdFx0XHRcdCB9XG5cdFx0XHRcdFx0XHQgfSBlbHNlIGlmIChyb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdCByZXR1cm4ge2VsZW1lbnQ6IHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkhLCBzZWxlY3Rvcjogc2VsZWN0b3IudmFsdWV9O1xuXHRcdFx0XHRcdFx0IH1cblx0XHRcdFx0XHQgfSBjYXRjaHt9XG5cdFx0XHRcdCB9XG5cdFx0XHRcdCByZXR1cm4gbnVsbDtcblx0XHRcdCB9O1xuXG5cdFx0IFx0Y29uc3Qgc2VsZWN0b3JLZXlJbmZvID0gZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIoc2VsZWN0b3JLZXlzKTtcblx0XHQgXHRpZighc2VsZWN0b3JLZXlJbmZvICYmICFpc1dpbmRvdykgdGhyb3cgbmV3IEVycm9yKFwiTm8gdmFsaWQgc2VsZWN0b3IgZm91bmRcIik7XG5cblx0XHRcdGNvbnN0IHNjcm9sbFRvID0gIGZ1bmN0aW9uIChlbGVtZW50OiBIVE1MRWxlbWVudCwgb2Zmc2V0OiBudW1iZXIpIHtcblx0XHRcdFx0Y29uc3QgZml4ZWRPZmZzZXQgPSBvZmZzZXQudG9GaXhlZCgpO1xuXHRcdFx0XHRjb25zdCBvblNjcm9sbCA9ICgpID0+IHtcblx0XHRcdFx0XHRpZiAoKGVsZW1lbnQgYXMgYW55KS5wYWdlWU9mZnNldC50b0ZpeGVkKCkgPT09IGZpeGVkT2Zmc2V0KSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25TY3JvbGwpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25TY3JvbGwpO1xuXHRcdFx0XHRvblNjcm9sbCgpO1xuXHRcdFx0XHRlbGVtZW50LnNjcm9sbFRvKHtcblx0XHRcdFx0XHR0b3A6IG9mZnNldCxcblx0XHRcdFx0XHRiZWhhdmlvcjogXCJzbW9vdGhcIixcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBlbGVtZW50ID0gaXNXaW5kb3c/IHdpbmRvdyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JLZXlJbmZvIS5zZWxlY3Rvcik7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2Nyb2xsRGVsdGFBcnIubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYoc2Nyb2xsRGVsdGFBcnJbaV0pXG5cdFx0XHRcdCBzY3JvbGxUbyhlbGVtZW50IGFzIEhUTUxFbGVtZW50LCBzY3JvbGxEZWx0YUFycltpXSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRbc2Nyb2xsRGVsdGFBcnIsIHNlbGVjdG9ycywgaXNXaW5kb3ddLFxuXHQpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2xlZXAodGltZTogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHR9LCB0aW1lKTtcblx0fSk7XG59XG4iLCJpbXBvcnQgeyBFbGVtZW50SGFuZGxlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gdHlwZShlbEhhbmRsZTogRWxlbWVudEhhbmRsZSwga2V5Q29kZXM6IEFycmF5PHN0cmluZz4pIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlDb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdGF3YWl0IGVsSGFuZGxlLnByZXNzKGtleUNvZGVzW2ldKTtcblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IHsgU0VMRUNUT1JfVFlQRSB9IGZyb20gJy4uLy4uLy4uL3VuaXF1ZS1zZWxlY3Rvci9zcmMvY29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvclNlbGVjdG9ycyhcblx0cGFnZTogUGFnZSxcblx0c2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPlxuKTogUHJvbWlzZTxpU2VsZWN0b3JJbmZvIHwgdW5kZWZpbmVkPiB7XG5cdGxldCBwbGF5d3JpZ2h0T3V0OiBpU2VsZWN0b3JJbmZvIHwgbnVsbCA9IG51bGw7XG5cdGlmKHNlbGVjdG9yc1swXS50eXBlID09IFNFTEVDVE9SX1RZUEUuUExBWVdSSUdIVCkge1xuXHRcdHRyeSB7XG5cdFx0IGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKHNlbGVjdG9yc1swXS52YWx1ZSwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xuXHRcdCBwbGF5d3JpZ2h0T3V0ID0gc2VsZWN0b3JzWzBdO1xuXHRcdH0gY2F0Y2goZXgpe31cblx0XHRzZWxlY3RvcnMuc2hpZnQoKTtcblx0fVxuXG5cdGlmKHBsYXl3cmlnaHRPdXQpIHtcblx0XHRyZXR1cm4gcGxheXdyaWdodE91dDtcblx0fVxuXG5cdGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKHRvQ3J1c2hlclNlbGVjdG9yc0Zvcm1hdChzZWxlY3RvcnMpKTtcblxuXHRyZXR1cm47XG59XG4iLCJpbXBvcnQgKiBhcyBBY3Rpb25zIGZyb20gXCIuL2FjdGlvbnNcIjtcbmltcG9ydCAqIGFzIE1pZGRsZXdhcmVzIGZyb20gXCIuL21pZGRsZXdhcmVzXCI7XG5pbXBvcnQgKiBhcyBGdW5jdGlvbnMgZnJvbSBcIi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQge0FjdGlvbnMsIE1pZGRsZXdhcmVzLCBGdW5jdGlvbnMsIFV0aWxzfTtcbiIsImltcG9ydCB7IGhhbmRsZVBvcHVwIH0gZnJvbSBcIi4vcG9wdXBcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGhhbmRsZVBvcHVwOiBoYW5kbGVQb3B1cCB9O1xuIiwiaW1wb3J0IHsgQnJvd3NlckNvbnRleHQsIFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUG9wdXAocGFnZTogUGFnZSwgYnJvd3NlckNvbnRleHQ6IEJyb3dzZXJDb250ZXh0KSB7XG5cdHBhZ2Uub24oXCJwb3B1cFwiLCBhc3luYyAocG9wdXApID0+IHtcblx0XHRjb25zdCBwb3B1cFVybCA9IGF3YWl0IHBvcHVwLnVybCgpO1xuXHRcdHBhZ2UuZXZhbHVhdGUoJ3dpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCInICsgcG9wdXBVcmwgKyAnXCInKTtcblx0XHRjb25zdCBwYWdlcyA9IGF3YWl0IGJyb3dzZXJDb250ZXh0LnBhZ2VzKCk7XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0YXdhaXQgcGFnZXNbaV0uY2xvc2UoKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuaW50ZXJmYWNlIGlWYWxpZFNlbGVjdG9yRWxlbWVudCB7XG5cdGVsZW1lbnQ6IEVsZW1lbnQ7XG5cdHNlbGVjdG9yOiBzdHJpbmc7XG59XG5cbmNvbnN0IGdldFZhbGlkU2VsZWN0b3JGcm9tQXJyID0gKHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4sIHJvb3Q6IEVsZW1lbnQgfCBEb2N1bWVudCA9IGRvY3VtZW50KTogaVZhbGlkU2VsZWN0b3JFbGVtZW50IHwgbnVsbCA9PiB7XG5cdGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmIChzZWxlY3Rvci50eXBlID09PSBcInhwYXRoXCIpIHtcblx0XHRcdFx0Y29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRpZiAoZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoID0gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKGVsZW1lbnRzWzBdIGFzIEhUTUxFbGVtZW50KTtcblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50c1swXSBhcyBFbGVtZW50LFxuXHRcdFx0XHRcdFx0c2VsZWN0b3I6IGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aCxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHJvb3QucXVlcnlTZWxlY3RvcihzZWxlY3Rvci52YWx1ZSkpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRlbGVtZW50OiByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpISxcblx0XHRcdFx0XHRzZWxlY3Rvcjogc2VsZWN0b3IudmFsdWUsXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG5cdHJldHVybiBudWxsO1xufTtcblxuY29uc3QgZ2V0RWxlbWVudHNCeVhQYXRoID0gKHhwYXRoOiBzdHJpbmcsIHBhcmVudDogTm9kZSB8IG51bGwgPSBudWxsKTogTm9kZVtdID0+IHtcblx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRjb25zdCBxdWVyeSA9IGRvY3VtZW50LmV2YWx1YXRlKHhwYXRoLCBwYXJlbnQgfHwgZG9jdW1lbnQsIG51bGwsIFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLCBudWxsKTtcblx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHF1ZXJ5LnNuYXBzaG90TGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRjb25zdCBpdGVtID0gcXVlcnkuc25hcHNob3RJdGVtKGkpO1xuXHRcdGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG5jb25zdCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgPSAoZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nID0+IHtcblx0aWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIikgcmV0dXJuIFwiSFRNTFwiO1xuXHRsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0c3RyICs9IGVsLmlkICE9IFwiXCIgPyBcIiNcIiArIGVsLmlkIDogXCJcIjtcblx0aWYgKGVsLmNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3RyICs9IFwiLlwiICsgY2xhc3Nlc1tpXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGdlbmVyYXRlUXVlcnlTZWxlY3RvcigoZWwgYXMgYW55KS5wYXJlbnROb2RlKSArIFwiID4gXCIgKyBzdHI7XG59O1xuXG5leHBvcnQgeyBnZXRFbGVtZW50c0J5WFBhdGgsIGdlbmVyYXRlUXVlcnlTZWxlY3RvciwgZ2V0VmFsaWRTZWxlY3RvckZyb21BcnIgfTtcbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5jb25zdCBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lID0gKHNlbGVjdG9yOiBzdHJpbmcsIHN0ZXBJbmRleDogbnVtYmVyKTogc3RyaW5nID0+IHtcblx0cmV0dXJuIHNlbGVjdG9yLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgXCJcIikucmVwbGFjZSgvIC9nLCBcIl9cIikgKyBgXyR7c3RlcEluZGV4fS5wbmdgO1xufTtcblxuY29uc3QgdG9DcnVzaGVyU2VsZWN0b3JzRm9ybWF0ID0gKHNlbGVjdG9yczogQXJyYXk8aVNlbGVjdG9ySW5mbz4pID0+IHtcblx0cmV0dXJuIGBjcnVzaGVyPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNlbGVjdG9ycykpfWA7XG59O1xuXG5jb25zdCBwcm9taXNlVGlsbFN1Y2Nlc3MgPSAocHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55Pj4pID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzLm1hcChwID0+IHtcblx0XHQvLyBJZiBhIHJlcXVlc3QgZmFpbHMsIGNvdW50IHRoYXQgYXMgYSByZXNvbHV0aW9uIHNvIGl0IHdpbGwga2VlcFxuXHRcdC8vIHdhaXRpbmcgZm9yIG90aGVyIHBvc3NpYmxlIHN1Y2Nlc3Nlcy4gSWYgYSByZXF1ZXN0IHN1Y2NlZWRzLFxuXHRcdC8vIHRyZWF0IGl0IGFzIGEgcmVqZWN0aW9uIHNvIFByb21pc2UuYWxsIGltbWVkaWF0ZWx5IGJhaWxzIG91dC5cblx0XHRyZXR1cm4gcC50aGVuKFxuXHRcdFx0dmFsID0+IFByb21pc2UucmVqZWN0KHZhbCksXG5cdFx0XHRlcnIgPT4gUHJvbWlzZS5yZXNvbHZlKGVycilcblx0XHQpO1xuXHR9KSkudGhlbihcblx0XHQvLyBJZiAnLmFsbCcgcmVzb2x2ZWQsIHdlJ3ZlIGp1c3QgZ290IGFuIGFycmF5IG9mIGVycm9ycy5cblx0XHRlcnJvcnMgPT4gUHJvbWlzZS5yZWplY3QoZXJyb3JzKSxcblx0XHQvLyBJZiAnLmFsbCcgcmVqZWN0ZWQsIHdlJ3ZlIGdvdCB0aGUgcmVzdWx0IHdlIHdhbnRlZC5cblx0XHR2YWwgPT4gUHJvbWlzZS5yZXNvbHZlKHZhbClcblx0KTtcbn1cblxuXG5leHBvcnQgeyBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lLCB0b0NydXNoZXJTZWxlY3RvcnNGb3JtYXQsIHByb21pc2VUaWxsU3VjY2VzcyB9O1xuIiwiaW1wb3J0ICogYXMgZG9tIGZyb20gXCIuL2RvbVwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0ZG9tLFxufTtcbiIsImxldCBwYWdlVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gc2V0UGFnZVVybCh1cmw6IHN0cmluZykge1xuXHRwYWdlVXJsID0gdXJsO1xufVxuXG5mdW5jdGlvbiBnZXRMYXN0U2F2ZWRQYWdlVXJsKCl7XG5cdHJldHVybiBwYWdlVXJsO1xufVxuXG5leHBvcnQge3NldFBhZ2VVcmwsIGdldExhc3RTYXZlZFBhZ2VVcmx9OyIsImV4cG9ydCBjb25zdCBTRUxFQ1RPUl9UWVBFID0ge1xuXHRJRDogJ2lkJyxcblx0UExBWVdSSUdIVDogJ3BsYXl3cmlnaHQnLFxuXHREQVRBX0FUVFJJQlVURTogJ2RhdGFBdHRyaWJ1dGUnLFxuXHRBVFRSSUJVVEU6ICdhdHRyaWJ1dGUnLFxuXHRJTk5FUl9WQUxVRTogJ2lubmVyVmFsdWUnLFxuXHRQTkM6ICdQbkMnLFxufTtcbiIsImZ1bmN0aW9uIHdlYnBhY2tFbXB0eUNvbnRleHQocmVxKSB7XG5cdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHR0aHJvdyBlO1xufVxud2VicGFja0VtcHR5Q29udGV4dC5rZXlzID0gKCkgPT4gKFtdKTtcbndlYnBhY2tFbXB0eUNvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7XG53ZWJwYWNrRW1wdHlDb250ZXh0LmlkID0gXCIuL3NyYy9hY3Rpb25zIHN5bmMgcmVjdXJzaXZlXCI7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tFbXB0eUNvbnRleHQ7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=