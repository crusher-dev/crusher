import { ACTIONS_IN_TEST } from '../../crusher-shared/constants/recordedActions';

import devices from '../../crusher-shared/constants/devices';
import userAgents from '../../crusher-shared/constants/userAgents';

import { ACTION_DESCRIPTIONS } from '../../crusher-shared/constants/actionDescriptions';
import { iAction } from '../../crusher-shared/types/action';
import { iAssertionRow } from '../../crusher-shared/types/assertionRow';

const importPlayWright = `const playwright = require('playwright');\n\n`;

const header = `const browser = await playwright["chromium"].launch({headless: false});\n`;

const footer = `await browser.close();\n`;

const logStepsFunction = `const {
  performance
} = require('perf_hooks');

let lastStepExecutedOn = performance.now();
function logStep(type, data, meta){
    const currentTime = performance.now();
    const timeTakeForThisStep = currentTime - lastStepExecutedOn;
    lastStepExecutedOn = currentTime;
	if(typeof _logStepToMongo !== "undefined"){
		_logStepToMongo(type, data, meta, timeTakeForThisStep);
	}
}\n`;

const typeFunction = `async function type(elHandle, keyCodesStr) {
	const keyCodes = JSON.parse(keyCodesStr);
	
	for(let i = 0; i < keyCodes.length; i++){
		await elHandle.press(keyCodes[i]);
	}
	return true;
}\n`


const scrollToFunction = `\n`;

const extractInfoUsingScriptFunction =
	`async function extractInfoUsingScript(page, selector, validationScript){
    const elHandle = await page.$(selector);
    const escapedInnerHTML = (await elHandle.innerHTML())` +
	'.toString().replace(/\\`/g, "\\\\`").trim()' +
	`;
    const escapedInnerText = (await elHandle.innerText())` +
	'.replace(/\\`/g, "\\\\`").trim();' +
	`;
    
    ` +
	"const scriptToEvaluate = `(` + validationScript + `)(` + '`' + escapedInnerHTML + '`' + `, ` + '`' + `${escapedInnerText}` + '`' + `, elHandle)`" +
	`;
    const output = eval(scriptToEvaluate);
    
    return output;
}\n\n`;

const assertElementAttributesFunction = `async function assertElementAttributes(page, selector, assertionsJSON){
	const assertions = JSON.parse(assertionsJSON);
	const elHandle = await page.$(selector);
	let hasPassed = true;
	const logs = [];
	
	for(let i = 0; i < assertions.length; i++) {
		const {validation: value, operation: method, field: attribute} = assertions[i];
		const elementAttributeValue = await elHandle.getAttribute(attribute);
		if(method === "MATCHES") {
			if(elementAttributeValue !== value){
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute="+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
			else {
				logs.push({status: "DONE", message: "Asserted attribute="+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
		} else if(method === "CONTAINS") {
			const doesContain =  elementAttributeValue.includes(value);
			if(!doesContain ){
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute contains "+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
			else {
				logs.push({status: "DONE", message: "Asserted attribute contains "+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
		} else if(method === "REGEX" ){
			const rgx = new RegExp(value);
			if (!rgx.test(elementAttributeValue)) {
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute matches regex: "+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			} else {
				logs.push({status: "DONE", message: "Asserted attribute matches regex: "+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
		}
	}
	
	return [hasPassed, logs];
}\n\n`;

const waitForSelectorFunction = `async function waitForSelector(_selectorsJSON, page, defaultSelector = null){
	const _selectors = JSON.parse(_selectorsJSON);
	const selectors = _selectors.map(selector => {return selector;});
	
	const getElementsByXPath = (xpath, parent) => {
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
	};
	
	const generateQuerySelector = function(el) {
      if (el.tagName.toLowerCase() == "html")
          return "HTML";
      var str = el.tagName;
      str += (el.id != "") ? "#" + el.id : "";
      if (el.className) {
          var classes = el.className.split(/\\s/);
          for (var i = 0; i < classes.length; i++) {
              str += "." + classes[i]
          }
      }
      return generateQuerySelector(el.parentNode) + " > " + str;
	};
	
	try{
	 await page.waitForSelector(defaultSelector, {state: "attached"});
	 return defaultSelector;
	} catch(err){
		const _newSelectors = selectors.filter(selector => {return selector.value !== defaultSelector});
		const validSelector = await page.evaluate((selectors) => {
			for(let i = 0; i < selectors.length; i++){
				try{
					if(selectors[i].type === "xpath"){
						const elements = getElementsByXPath(selectors[i].value);
						if(elements.length){
							return generateQuerySelector(elements[0]);
						}
					} else if(document.querySelector(selectors[i].value)){
						console.log("Valid selector is: " + selectors[i].value);
						return selectors[i].value;
					}
				} catch(ex){
					console.log("Invalid selector: ", selectors[i].value);
				}
				console.log("Selector didn't match: " + selectors[i].value);
			}
			return null;
		}, _newSelectors);
		if(typeof validSelector === "undefined"){
			throw new Error("This is not working");
		}
		return validSelector;
	}
}\n`;

const sleepScriptFunction = `
const DEFAULT_SLEEP_TIME = 500;
const TYPE_DELAY = 100;
function sleep(time){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(true);
        }, time);
    })
}\n\n`;

export default class CodeGenerator {
	helperFunctionsToInclude: any;

	constructor() {
		this.helperFunctionsToInclude = {};
	}

	generate(events: Array<iAction>, isRecordingVideo: boolean = false, isLiveProgress = false) {
		const generatedEventsCode = this._handleActions(events, isRecordingVideo, isLiveProgress);
		return (
			importPlayWright +
			this.addHelperFunctionsIfAny(isRecordingVideo, isLiveProgress) +
			waitForSelectorFunction +
			(isRecordingVideo ? `let captureVideo;\n` : ``) +
			header +
			generatedEventsCode +
			(isRecordingVideo ? `await captureVideo.stop();\n` + footer + `}catch(ex){ await captureVideo.stop();` + footer + `throw ex;}\n` : footer)
		);
	}

	addHelperFunctionsIfAny(isRecordingVideo = false, isLiveProgress = false) {
		const helperFunctions = Object.keys(this.helperFunctionsToInclude);
		let codeToAdd = '';
		codeToAdd += typeFunction;

		for (let fun of helperFunctions) {
			if (fun === ACTIONS_IN_TEST.EXTRACT_INFO) {
				codeToAdd += extractInfoUsingScriptFunction;
			} else if(fun === ACTIONS_IN_TEST.ASSERT_ELEMENT) {
				codeToAdd += assertElementAttributesFunction;
			} else if(fun === ACTIONS_IN_TEST.SCROLL) {
				codeToAdd += scrollToFunction;
			}
		}
		if (isRecordingVideo) {
			codeToAdd += sleepScriptFunction;
		}
		if (isLiveProgress) {
			codeToAdd += logStepsFunction;
		}
		return codeToAdd;
	}

	_handleActions(events: Array<iAction>, isRecordingVideo = false, isLiveProgress = false) {
		let screenShotFileName: string;
		let code = '\n';
		let firstTimeNavigate = true;
		let width = 1280;
		let height = 720;
		if (events[0] && events[0].type !== ACTIONS_IN_TEST.SET_DEVICE) {
			const device = devices[7];
			const userAgent: any = userAgents.find((agent) => {
				return agent.name === device.userAgent;
			});
			width = device.width;
			height = device.height;
			code += `const browserContext = await browser.newContext({width: '${device.width}px', height: '${device.height}px', userAgent: "${userAgent.value}"});\n`;
			code += `await browserContext.addInitScript(()=>{
		document.addEventListener("click", function(event){
				const {target} = event;
				const closestLink = target.closest("a");
				if (closestLink && closestLink.tagName.toLowerCase() === "a") {
						const href = closestLink.getAttribute("href");
						console.log("Going to this link", href);
						if (href) {
								window.location.href = href;
						}
						return event.preventDefault();
				}
		}, true);
});\n`;
			if (isLiveProgress) {
				code += `await logStep('${ACTIONS_IN_TEST.SET_DEVICE}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.SET_DEVICE]({
					value: device.name,
				})}'}, {name: '${device.name}', width: ${width}, height: ${height}, userAgent: '${userAgent.value}'});\n`;
			}
		} else if (events[0] && events[0].type === ACTIONS_IN_TEST.SET_DEVICE) {
			const deviceId = (events[0].payload.meta as any).deviceId;
			const deviceFound = devices.find((_device) => {
				return _device.id === deviceId;
			});
			const device = deviceFound ? deviceFound : devices[7];
			const userAgent: any = userAgents.find((agent) => {
				return agent.name === device.userAgent;
			});
			width = device.width;
			height = device.height;
			code += `const browserContext = await browser.newContext({userAgent: '${userAgent.value}', viewport: { width: ${device.width}, height: ${device.height}}});\n`;
			if (isLiveProgress) {
				code += `await logStep('${ACTIONS_IN_TEST.SET_DEVICE}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.SET_DEVICE]({
					value: device.name,
				})}'}, {name: '${device.name}', width: ${width}, height: ${height}, userAgent: '${userAgent.value}'});\n`;
			}
		}

		for (let i = 0; i < events.length; i++) {
			const event_type = events[i].type;
			const selectors = events[i].payload.selectors;
			const value = "";

			switch (event_type) {
				case ACTIONS_IN_TEST.NAVIGATE_URL: {
					const urlToGo = events[i].payload.meta.value;

					if (firstTimeNavigate) {
						firstTimeNavigate = false;
						code +=
							`const page = await browserContext.newPage({});\n`;
						code += `page.on("popup", async (popup)=>{
		const popupUrl = await popup.url();
		page.evaluate("window.location.href = \\"" + popupUrl + "\\"");
		const pages = await browserContext.pages();
		for(let i = 1; i < pages.length; i++){
				await pages[i].close();
		}
});\n`
						code += `page.setDefaultTimeout(10000);` +
							(isRecordingVideo ? `const {saveVideo} = require('playwright-video');\ncaptureVideo = await saveVideo(page, 'video.mp4');\ntry{\n` : '') +
							`await page.goto('${urlToGo}');\n`;
					} else {
						code += `await page.goto('${urlToGo}');\n`;
					}
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.NAVIGATE_URL}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.NAVIGATE_URL]({
							value: urlToGo,
						})}'});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				}
				case ACTIONS_IN_TEST.CLICK:
					console.error(events[i]);
					if(!selectors) {throw new Error("Element with no selector provided for click action")}
					code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;

					code += `const stv_${i} = await page.$(selector_${i});\nawait stv_${i}.scrollIntoViewIfNeeded();\nawait stv_${i}.dispatchEvent('click');\n`;
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.CLICK}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.CLICK]({
							selector: selectors[0].value,
						})}'}, {selector: selector_${i}});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					code += `await page.waitForLoadState();\n`;
					break;
				case ACTIONS_IN_TEST.HOVER:
					if(!selectors) {throw new Error("Element with no selector provided for hover action")}

					code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;

					code += `await page.hover(selector_${i});\n`;
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.HOVER}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.HOVER]({
							selector: selectors[0].value,
						})}'}, {selector: selector_${i}});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.ELEMENT_SCREENSHOT:
					if(!selectors) {throw new Error("Element with no selector provided for screenshot")}

					screenShotFileName = selectors[0].value.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${i}`;
					code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;

					code += `const h_${i} = await page.$(selector_${i});\nawait h_${i}.screenshot({path: '${screenShotFileName}.png'});\n`;
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.ELEMENT_SCREENSHOT}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[
							ACTIONS_IN_TEST.ELEMENT_SCREENSHOT
						]({
							selector: selectors[0].value,
						})}'}, {selector: selector_${i}});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.PAGE_SCREENSHOT:
					screenShotFileName = value.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${i}`;
					code += `const screenshotFileName_${i} = (await page.title()).replace(/[^\\w\\s]/gi, '').replace(/ /g, '_');\n`;
					code += `await page.screenshot({path: screenshotFileName_${i}, fullPage: true});\n`;

					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.PAGE_SCREENSHOT}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[
							ACTIONS_IN_TEST.PAGE_SCREENSHOT
						]()}'}, {selector: 'body'});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.SCROLL_TO_VIEW:
					if(!selectors) {throw new Error("Element with no selector provided for scroll to view action")}

					code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;

					code += `const stv_${i} = await page.$(selector_${i});\nawait stv_${i}.scrollIntoViewIfNeeded();\n`;
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.SCROLL_TO_VIEW}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.SCROLL_TO_VIEW]({
							selector: selectors[0].value,
						})}'}, {selector: selector_${i}});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.ADD_INPUT: {
					if (!selectors) {
						throw new Error("Element with no selector provided for add input action")
					}

					const inputKeys = events[i].payload.meta.value;

					code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;

					code += `const stv_${i} = await page.$(selector_${i});\nawait stv_${i}.scrollIntoViewIfNeeded();\n`;

					code += `await type(stv_${i}, '${JSON.stringify(inputKeys)}');\n`;

					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.ADD_INPUT}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.ADD_INPUT]({
							selector: selectors[0].value,
							value: inputKeys,
						})}'}, {selector: selector_${i}, value: '${inputKeys.toString()}'});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				}
				case ACTIONS_IN_TEST.SCROLL: {
					if (!selectors) {
						throw new Error("Element with no selector provided for scroll action")
					}

					const scrollDeta = events[i].payload.meta.value;
					this.helperFunctionsToInclude[ACTIONS_IN_TEST.SCROLL] = true;

					if ((selectors[0] as any) !== "window") {
						code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;
					}
					if (scrollDeta && scrollDeta.length) {
						code += `await page.evaluate(async ([scrollPosArr, selectorKey])=>{
		const scrollTo = async function(element, offset) {
			const fixedOffset = offset.toFixed();
			const onScroll = function () {
					if (element.pageYOffset.toFixed() === fixedOffset) {
							element.removeEventListener('scroll', onScroll);
							return true;
					}
			};

		element.addEventListener('scroll', onScroll);
		onScroll();
		element.scrollTo({
			top: offset,
			behavior: 'smooth'
		});
};
							const element = selectorKey === "window" ? window : document.querySelector(selectorKey);
							
							for(let i = 0; i < scrollPosArr.length; i++){
								await scrollTo(element, scrollPosArr[i]);
							}
						}, [[${scrollDeta}], ${JSON.stringify("window")}]);\n`;
					}
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.SCROLL}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.EXTRACT_INFO]({
							selector: (selectors[0] as any) === "window" ? (selectors[0] as any) : selectors[0].value,
						})}'}, {selector: ${(selectors[0] as any) === "window" ? JSON.stringify("window") : `selector_${i}`}});\n`;
					}
					break;
				}
				case ACTIONS_IN_TEST.VALIDATE_SEO:

					break;
				case ACTIONS_IN_TEST.ASSERT_ELEMENT: {
					if (!selectors) {
						console.error(events[i]);
						throw new Error("Element with no selector provided for asset element" + events[i].payload)
					}

					const value = events[i].payload.meta.validations as iAssertionRow;

						this.helperFunctionsToInclude[ACTIONS_IN_TEST.ASSERT_ELEMENT] = true;
					code += `[hasAllAssertionPassed, assertionLogs] = await assertElementAttributes(page, '` + selectors[0].value + `', \`` + JSON.stringify(value) + `\`);\n`;

					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.ASSERT_ELEMENT}', {status: hasAllAssertionPassed ? 'DONE' : 'FAILED', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.ASSERT_ELEMENT]({
							selector: selectors[0].value,
						})}'}, {selector: '${selectors[0].value}'});\n`;
					}
					code += `if(!hasAllAssertionPassed){
						throw new Error("Not all assertions passed");
					}\n`;
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				}
				default:
					console.error('Not supported event');
			}
		}
		return code;
	}
}
