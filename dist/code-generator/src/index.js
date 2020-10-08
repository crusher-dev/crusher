"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recordedActions_1 = require("~/crusher-shared/constants/recordedActions");
const userAgents_1 = __importDefault(require("~/crusher-shared/constants/userAgents"));
const devices_1 = __importDefault(require("~/crusher-shared/constants/devices"));
const importPlayWright = `const playwright = require('playwright');\n\n`;
const header = `const browser = await playwright["chromium"].launch();\n`;
const footer = `await browser.close();\n`;
const extractInfoUsingScriptFunction = `async function extractInfoUsingScript(page, selector, validationScript){
    const elHandle = await page.$(selector);
    const escapedInnerHTML = (await elHandle.innerHTML())` + '.toString().replace(/\\`/g, "\\\\`").trim()' + `;
    const escapedInnerText = (await elHandle.innerText())` + '.replace(/\\`/g, "\\\\`").trim();' + `;
    
    ` + "const scriptToEvaluate = \`(\` + validationScript + \`)(\` + '\`' + escapedInnerHTML + '\`' + \`, \` + '\`' + \`${escapedInnerText}\` + '\`' + \`, elHandle)\`" + `;
    const output = eval(scriptToEvaluate);
    
    return output;
}\n\n`;
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
class CodeGenerator {
    constructor(options) {
        this.helperFunctionsToInclude = {};
    }
    generate(events, isRecordingVideo = false) {
        const generatedEventsCode = this._handleEvents(events, isRecordingVideo);
        return importPlayWright + this.addHelperFunctionsIfAny(isRecordingVideo) + header + generatedEventsCode + (isRecordingVideo ? `await captureVideo.stop();\n` : '') + footer;
    }
    addHelperFunctionsIfAny(isRecordingVideo = false) {
        const helperFunctions = Object.keys(this.helperFunctionsToInclude);
        let codeToAdd = "";
        for (let fun of helperFunctions) {
            if (fun === recordedActions_1.EXTRACT_INFO_FROM_ELEMENT) {
                codeToAdd += extractInfoUsingScriptFunction;
            }
        }
        if (isRecordingVideo) {
            codeToAdd += sleepScriptFunction;
        }
        return codeToAdd;
    }
    _handleEvents(events, isRecordingVideo = false) {
        let screenShotFileName;
        let code = '\n';
        let firstTimeNavigate = true;
        if (events[0] && events[0].event_type !== recordedActions_1.SET_DEVICE) {
            const device = devices_1.default[7];
            const userAgent = userAgents_1.default.find(agent => {
                return agent.name === device.userAgent;
            });
            code += `const browserContext = await browser.newContext({width: '${device.width}px', height: '${device.height}px', userAgent: "${userAgent.value}"});\n`;
        }
        else if (events[0] && events[0].event_type === recordedActions_1.SET_DEVICE) {
            const { value: deviceId } = events[0];
            const deviceFound = devices_1.default.find((_device) => {
                return _device.id === deviceId;
            });
            const device = deviceFound ? deviceFound : devices_1.default[7];
            const userAgent = userAgents_1.default.find(agent => {
                return agent.name === device.userAgent;
            });
            code += `const browserContext = await browser.newContext({userAgent: '${userAgent.value}', viewport: { width: ${device.width}, height: ${device.height}}});\n`;
        }
        for (let i = 0; i < events.length; i++) {
            const { event_type, selector, value } = events[i];
            switch (event_type) {
                case recordedActions_1.NAVIGATE_TO_URL:
                    if (firstTimeNavigate) {
                        firstTimeNavigate = false;
                        code += `const page = await browserContext.newPage({});\n` + (isRecordingVideo ? `const {saveVideo} = require('playwright-video');\nconst captureVideo = await saveVideo(page, 'video.mp4');\n` : '') + `await page.goto('${value}');\n`;
                    }
                    else {
                        code += `await page.goto('${value}');\nawait sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.CLICK_ON_ELEMENT:
                    code += `await page.waitForSelector('${selector}', {state: "attached"});\nconst stv_${i} = await page.$('${selector}');\nawait stv_${i}.scrollIntoViewIfNeeded();\nawait stv_${i}.dispatchEvent('click');\n`;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.HOVER_ON_ELEMENT:
                    code += `await page.waitForSelector('${selector}', {state: "attached"});\nawait page.hover('${selector}');\n`;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.SCREENSHOT_OF_ELEMENT:
                    screenShotFileName = selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${i}`;
                    code += `await page.waitForSelector('${selector}', {state: "attached"});\nconst h_${i} = await page.$('${selector}');\nawait h_${i}.screenshot({path: '${screenShotFileName}.png'});\n`;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.SCREENSHOT_OF_PAGE:
                    screenShotFileName = value.replace(/[^\w\s]/gi, '').replace(/ /g, "_") + `_${i}`;
                    code += `await page.screenshot({path: '${screenShotFileName}.png', fullPage: true});\n`;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.SCROLL_TO_VIEW_TO_ELEMENT:
                    code += `await page.waitForSelector('${selector}', {state: "attached"});\nconst stv_${i} = await page.$('${selector}');\nawait stv_${i}.scrollIntoViewIfNeeded();\n`;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.FILL_INPUT_ON_ELEMENT:
                    code += `await page.waitForSelector('${selector}', {state: "attached"});\nawait page.type('${selector}', '${value}', {delay: ${isRecordingVideo ? 'TYPE_DELAY' : 25}});\n`;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.EXTRACT_INFO_FROM_ELEMENT:
                    const variable_name = Object.keys(value)[0];
                    const validation_script = value[variable_name];
                    this.helperFunctionsToInclude[recordedActions_1.EXTRACT_INFO_FROM_ELEMENT] = true;
                    code += `await page.waitForSelector('${selector}', {state: "attached"});\nlet ${variable_name} = await extractInfoUsingScript(page, '${selector}', ` + '`' + validation_script + '`' + `)\n`;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    break;
                case recordedActions_1.ASSERT_TEXT_OF_ELEMENT:
                    this.helperFunctionsToInclude[recordedActions_1.ASSERT_TEXT_OF_ELEMENT] = true;
                    if (isRecordingVideo) {
                        code += `await sleep(DEFAULT_SLEEP_TIME);\n`;
                    }
                    code += ` `;
                    break;
                default:
                    console.error("Not supported event");
            }
        }
        return code;
    }
}
exports.default = CodeGenerator;
//# sourceMappingURL=index.js.map