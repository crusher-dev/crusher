import { ACTIONS_IN_TEST } from '../../crusher-shared/constants/recordedActions';

import devices from '../../crusher-shared/constants/devices';
import userAgents from '../../crusher-shared/constants/userAgents';

import { ACTION_DESCRIPTIONS } from '../../crusher-shared/constants/actionDescriptions';

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
		const {value, method, attribute} = assertions[i];
		const elementAttributeValue = await elHandle.getAttribute(attribute);
		if(method === "matches") {
			if(elementAttributeValue !== value){
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute="+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
			else {
				logs.push({status: "DONE", message: "Asserted attribute="+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
		} else if(method === "contains") {
			const doesContain =  elementAttributeValue.includes(value);
			if(!doesContain ){
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute contains "+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
			else {
				logs.push({status: "DONE", message: "Asserted attribute contains "+value+" of " + selector + "", meta: {method, valueToMatch: value, attribute, elementValue: elementAttributeValue}});
			}
		} else if(method === "regex" ){
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

	generate(events: any, isRecordingVideo: boolean = false, isLiveProgress = false) {
		const generatedEventsCode = this._handleEvents(events, isRecordingVideo, isLiveProgress);
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

	_handleEvents(events: any, isRecordingVideo = false, isLiveProgress = false) {
		let screenShotFileName: string;
		let code = '\n';
		let firstTimeNavigate = true;
		let width = 1280;
		let height = 720;
		if (events[0] && events[0].event_type !== ACTIONS_IN_TEST.SET_DEVICE) {
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
		} else if (events[0] && events[0].event_type === ACTIONS_IN_TEST.SET_DEVICE) {
			const { value: deviceId } = events[0];
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
			const { event_type, selectors, value } = events[i];

			switch (event_type) {
				case ACTIONS_IN_TEST.NAVIGATE_URL:
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
							`await page.goto('${value}');\n`;
					} else {
						code += `await page.goto('${value}');\n`;
					}
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.NAVIGATE_URL}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.NAVIGATE_URL]({
							value: value,
						})}'});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.CLICK:
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
					code += `await page.screenshot({path: '${screenShotFileName}.png', fullPage: true});\n`;
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
				case ACTIONS_IN_TEST.ADD_INPUT:
					code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;

					code += `const stv_${i} = await page.$(selector_${i});\nawait stv_${i}.scrollIntoViewIfNeeded();\n`;

					code += `await type(stv_${i}, '${JSON.stringify(value)}');\n`;

					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.ADD_INPUT}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.ADD_INPUT]({
							selector: selectors[0].value,
							value,
						})}'}, {selector: selector_${i}, value: '${value.toString()}'});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.SCROLL:
					this.helperFunctionsToInclude[ACTIONS_IN_TEST.SCROLL] = true;

					if(selectors[0] !== "window") {
						code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;
					}
					if(value && value.length) {
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
						}, [[${value}], ${JSON.stringify("window")}]);\n`;
					}
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.SCROLL}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.EXTRACT_INFO]({
							selector: selectors[0] === "window" ? selectors[0] : selectors[0].value,
						})}'}, {selector: ${selectors[0] === "window" ? JSON.stringify("window") : `selector_${i}`}});\n`;
					}
					break;
				case ACTIONS_IN_TEST.EXTRACT_INFO:
					const variable_name = Object.keys(value)[0];
					const validation_script = value[variable_name];
					this.helperFunctionsToInclude[ACTIONS_IN_TEST.EXTRACT_INFO] = true;
					code += `const selector_${i} = await waitForSelector(${JSON.stringify(JSON.stringify(selectors))}, page, "${selectors[0].value}");\n`;

					code +=
						`let ${variable_name} = await extractInfoUsingScript(page, selector_${i}, ` +
						'`' +
						validation_script +
						'`' +
						`)\n`;
					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.EXTRACT_INFO}', {status: 'DONE', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.EXTRACT_INFO]({
							selector: selectors[0].value,
						})}'}, {selector: selector_${i}});\n`;
					}
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				case ACTIONS_IN_TEST.VALIDATE_SEO:

					break;
				case ACTIONS_IN_TEST.ASSERT_ELEMENT:
					this.helperFunctionsToInclude[ACTIONS_IN_TEST.ASSERT_ELEMENT] = true;
					code += `[hasAllAssertionPassed, assertionLogs] = await assertElementAttributes(page, '` + selectors[0].value + `', \`` + value +  `\`);\n`;

					if (isLiveProgress) {
						code += `await logStep('${ACTIONS_IN_TEST.ASSERT_ELEMENT}', {status: hasAllAssertionPassed ? 'DONE' : 'FAILED', message: '${ACTION_DESCRIPTIONS[ACTIONS_IN_TEST.ASSERT_ELEMENT]({
							selector: selectors[0].value,
						})}'}, {selector: '${selectors[0].value}'});\n`;
					}
					code+=`if(!hasAllAssertionPassed){
						throw new Error("Not all assertions passed");
					}\n`;
					if (isRecordingVideo) {
						code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
					}
					break;
				default:
					console.error('Not supported event');
			}
		}
		return code;
	}
}
