
(async function() {
				class GlobalManagerPolyfill { map; constructor(){this.map = new Map();} has(key) {return this.map.has(key); } get(key) { return this.map.get(key); } set(key,value){this.map.set(key,value);} } class LogManagerPolyfill { logStep(...args) { console.log(args[2]); }} class StorageManagerPolyfill { uploadBuffer(buffer, destionation) { return "uploadBuffer.jpg"; } upload(filePath, destination) { return "upload.jpg"; } remove(filePath) { return "remove.jpg"; }} const logManager = new LogManagerPolyfill(); const storageManager = new StorageManagerPolyfill(); const globalManager = new GlobalManagerPolyfill(); const exportsStore = new Map(); const exportsManager = {get: (key) => { return exportsStore.get(key); }, has: (key) => { return exportsStore.has(key); }, set: (key, value) => { return exportsStore.set(key, value); }, getEntriesArr: () => {return Array.from(exportsStore.entries());}};
        const playwright = require("playwright");
        const path = require("path");
        
        const { CrusherRunnerActions, handlePopup, getBrowserActions, getMainActions, handleProxyBrowserContext, handleProxyPage, addRRWeb } = require("../../output/crusher-runner-utils");

        const communicationChannel = {};
        const context = {};
        
        // @TODO: globalManager, logManager, storageManager, exportsManager, communicationChannel are supposed to be injected globally
        const crusherRunnerActionManager = new CrusherRunnerActions(logManager, storageManager, "290/401", globalManager, exportsManager, communicationChannel, null, context);
        
        let capturedVideo, browserContext, page, browser;
        
        browser = await playwright["chromium"].launch({});
        
        
          globalManager.set("browserContextOptions", {"defaultNavigationTimeout":30000,"defaultTimeout":15000});

        const actions = [{"type":"BROWSER_SET_DEVICE","payload":{"meta":{"device":{"id":"GoogleChromeMediumScreen","name":"Desktop","width":1280,"height":800,"mobile":false,"visible":true,"userAgent":"Google Chrome","userAgentRaw":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"}}},"status":"COMPLETED","time":1651596011015},{"type":"PAGE_NAVIGATE_URL","payload":{"selectors":[],"meta":{"value":"https://google.com"}},"status":"COMPLETED","time":1651596012032},{"type":"ELEMENT_CLICK","payload":{"selectors":[{"type":"dataAttribute","value":"input[data-ved=\"0ahUKEwjEu4_N4sP3AhXQdd4KHaGmCbsQ39UDCAQ\"]","uniquenessScore":1},{"type":"attribute","value":"input[jsaction=\"paste:puy29d;\"]","uniquenessScore":1},{"type":"attribute","value":"input[maxlength=\"2048\"]","uniquenessScore":1},{"type":"attribute","value":"input[name=\"q\"]","uniquenessScore":1},{"type":"attribute","value":"input[type=\"text\"]","uniquenessScore":1},{"type":"attribute","value":"input[aria-autocomplete=\"both\"]","uniquenessScore":1},{"type":"attribute","value":"input[aria-haspopup=\"false\"]","uniquenessScore":1},{"type":"attribute","value":"input[autocapitalize=\"off\"]","uniquenessScore":1},{"type":"attribute","value":"input[autocomplete=\"off\"]","uniquenessScore":1},{"type":"attribute","value":"input[autocorrect=\"off\"]","uniquenessScore":1},{"type":"attribute","value":"input[autofocus=\"\"]","uniquenessScore":1},{"type":"attribute","value":"input[role=\"combobox\"]","uniquenessScore":1},{"type":"attribute","value":"input[spellcheck=\"false\"]","uniquenessScore":1},{"type":"attribute","value":"input[title=\"Search\"]","uniquenessScore":1},{"type":"attribute","value":"input[value=\"\"]","uniquenessScore":1},{"type":"attribute","value":"input[aria-label=\"Search\"]","uniquenessScore":1},{"type":"PnC","value":".a4bIc > .gLFyf","uniquenessScore":1,"meta":{"seedLength":2,"optimized":2}},{"type":"PnC","value":".SDkEP .gLFyf","uniquenessScore":1,"meta":{"seedLength":3,"optimized":2}},{"type":"PnC","value":".RNNXgb .gLFyf","uniquenessScore":1,"meta":{"seedLength":4,"optimized":2}},{"type":"playwright","value":"[aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[type=\"text\"]","uniquenessScore":1},{"type":"playwright","value":"[title=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[type=\"text\"][aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[title=\"Search\"][aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"div >> [aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"input[aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[type=\"text\"][title=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[maxlength=\"2048\"]","uniquenessScore":1},{"type":"playwright","value":"[autocorrect=\"off\"]","uniquenessScore":1},{"type":"xpath","value":"//BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]","uniquenessScore":1}],"meta":{"value":{"inputInfo":null,"mousePos":{"x":0.5010266940451745,"y":0.9264705882352942}},"elementDescription":"input.gLFyf.gsfi","uniqueNodeId":"5e8b3a93-7e06-4b16-bc13-feb5a3f6a8c3","parentFrameSelectors":null}},"screenshot":null,"url":"https://www.google.com/","status":"COMPLETED","time":1651596026192},{"type":"ELEMENT_ADD_INPUT","payload":{"selectors":[{"type":"dataAttribute","value":"input[data-ved=\"0ahUKEwjEu4_N4sP3AhXQdd4KHaGmCbsQ39UDCAQ\"]","uniquenessScore":1},{"type":"attribute","value":"input[jsaction=\"paste:puy29d;\"]","uniquenessScore":1},{"type":"attribute","value":"input[maxlength=\"2048\"]","uniquenessScore":1},{"type":"attribute","value":"input[name=\"q\"]","uniquenessScore":1},{"type":"attribute","value":"input[type=\"text\"]","uniquenessScore":1},{"type":"attribute","value":"input[aria-autocomplete=\"both\"]","uniquenessScore":1},{"type":"attribute","value":"input[aria-haspopup=\"false\"]","uniquenessScore":1},{"type":"attribute","value":"input[autocapitalize=\"off\"]","uniquenessScore":1},{"type":"attribute","value":"input[autocomplete=\"off\"]","uniquenessScore":1},{"type":"attribute","value":"input[autocorrect=\"off\"]","uniquenessScore":1},{"type":"attribute","value":"input[autofocus=\"\"]","uniquenessScore":1},{"type":"attribute","value":"input[role=\"combobox\"]","uniquenessScore":1},{"type":"attribute","value":"input[spellcheck=\"false\"]","uniquenessScore":1},{"type":"attribute","value":"input[title=\"Search\"]","uniquenessScore":1},{"type":"attribute","value":"input[value=\"\"]","uniquenessScore":1},{"type":"attribute","value":"input[aria-label=\"Search\"]","uniquenessScore":1},{"type":"PnC","value":".a4bIc > .gLFyf","uniquenessScore":1,"meta":{"seedLength":2,"optimized":2}},{"type":"PnC","value":".SDkEP .gLFyf","uniquenessScore":1,"meta":{"seedLength":3,"optimized":2}},{"type":"PnC","value":".RNNXgb .gLFyf","uniquenessScore":1,"meta":{"seedLength":4,"optimized":2}},{"type":"playwright","value":"[aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[type=\"text\"]","uniquenessScore":1},{"type":"playwright","value":"[title=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[type=\"text\"][aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[title=\"Search\"][aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"div >> [aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"input[aria-label=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[type=\"text\"][title=\"Search\"]","uniquenessScore":1},{"type":"playwright","value":"[maxlength=\"2048\"]","uniquenessScore":1},{"type":"playwright","value":"[autocorrect=\"off\"]","uniquenessScore":1},{"type":"xpath","value":"//BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]","uniquenessScore":1}],"meta":{"value":{"type":"INPUT","value":"hello world","name":"q","inputType":"text","labelsUniqId":[]},"elementDescription":"input.gLFyf.gsfi","uniqueNodeId":"5e8b3a93-7e06-4b16-bc13-feb5a3f6a8c3"}},"screenshot":null,"url":"https://www.google.com/"},{"type":"ELEMENT_CLICK","payload":{"selectors":[{"type":"dataAttribute","value":"input[data-ved=\"0ahUKEwjEu4_N4sP3AhXQdd4KHaGmCbsQ4dUDCAc\"]","uniquenessScore":1},{"type":"PnC","value":"center:nth-child(2) > .gNO89b","uniquenessScore":1,"meta":{"seedLength":2,"optimized":2}},{"type":"PnC","value":".CqAVzb .gNO89b","uniquenessScore":1,"meta":{"seedLength":3,"optimized":2}},{"type":"PnC","value":".aajZCb .gNO89b","uniquenessScore":1,"meta":{"seedLength":4,"optimized":2}},{"type":"xpath","value":"//BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[5]/CENTER[1]/INPUT[1]","uniquenessScore":1}],"meta":{"value":{"inputInfo":null,"mousePos":{"x":0.5408388520971302,"y":0.5}},"elementDescription":"input.gNO89b","uniqueNodeId":"fe18184b-3830-424b-b466-5f637726ae6f","parentFrameSelectors":null}},"screenshot":null,"url":"https://www.google.com/","status":"COMPLETED","time":1651596029873},{"type":"ELEMENT_CLICK","payload":{"selectors":[{"type":"dataAttribute","value":"a[data-ved=\"2ahUKEwjejbbV4sP3AhWJUWwGHRYuAB4QFnoECEkQAQ\"]","uniquenessScore":1},{"type":"attribute","value":"a[href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"attribute","value":"a[ping=\"/url?sa=t&source=web&rct=j&url=https://thehelloworld.com/&ved=2ahUKEwjejbbV4sP3AhWJUWwGHRYuAB4QFnoECEkQAQ\"]","uniquenessScore":1},{"type":"playwright","value":"[href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"a[href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"div >> [href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"[data-header-feature=\"0\"] >> [href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"text=HelloWorld Coliving, Student Hostels & Coworking Spaceshttps://thehelloworld.com >> visible=true","uniquenessScore":1},{"type":"playwright","value":"div >> a[href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"[data-header-feature=\"0\"] >> a[href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"div[data-header-feature=\"0\"] >> [href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"#search >> [href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"#res >> [href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"playwright","value":"#center_col >> [href=\"https://thehelloworld.com/\"]","uniquenessScore":1},{"type":"xpath","value":"//BODY/DIV[7]/DIV[1]/DIV[10]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[3]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/A[1]","uniquenessScore":1}],"meta":{"value":{"inputInfo":null,"mousePos":{"x":0.3216420162994265,"y":0.6}},"elementDescription":"a","uniqueNodeId":"17d984f1-2d25-41a1-861f-51f0d17506f3"}},"screenshot":null,"url":"https://www.google.com/search?q=hello+world&source=hp&ei=7FpxYsSVIdDr-QahzabYCw&iflsig=AJiK0e8AAAAAYnFo_OPhPdzyq_tymXxYNrTsPy0ZgXVt&ved=0ahUKEwjEu4_N4sP3AhXQdd4KHaGmCbsQ4dUDCAc&oq=hello+world&gs_lcp=Cgdnd3Mtd2l6EAwyCAgAEIAEELEDMggILhCABBCxAzIFCAAQgAQyBQgAEIAEMgUIABCABDIICAAQgAQQsQMyBQgAEIAEMgUIABCABDIFCAAQgAQyCAgAELEDEIMBOg4IABCPARDqAhCMAxDlAjoOCC4QjwEQ6gIQjAMQ5QI6CwgAEIAEELEDEIMBOg4ILhCABBCxAxCDARDUAjoRCC4QgAQQsQMQgwEQxwEQowI6CAguELEDEIMBOgoIABCxAxCDARAKOgsILhCABBCxAxCDAToRCC4QgAQQsQMQxwEQowIQ1AI6CwguEIAEELEDENQCOgsILhCABBDHARCvAToLCAAQgAQQsQMQyQM6BQgAEJIDOggILhCABBDUAlDsBVjGDmDpHGgBcAB4AIAB3wGIAZIMkgEFMS44LjKYAQCgAQGwAQo&sclient=gws-wiz","status":"COMPLETED","time":1651596033114},{"type":"PAGE_WAIT_FOR_NAVIGATION","payload":{"selectors":[{"type":"id","value":"#gsr","uniquenessScore":1},{"type":"attribute","value":"body[jsmodel=\"hspDDf\"]","uniquenessScore":1},{"type":"attribute","value":"body[jscontroller=\"Eox39d\"]","uniquenessScore":1},{"type":"attribute","value":"body[marginheight=\"3\"]","uniquenessScore":1},{"type":"attribute","value":"body[topmargin=\"3\"]","uniquenessScore":1},{"type":"attribute","value":"body[jsaction=\"rcuQ6b:npT2md;YUC7He:.CLIENT;IVKTfe:.CLIENT;KsNBn:.CLIENT;sbTXNb:.CLIENT;xjhTIf:.CLIENT;O2vyse:.CLIENT;Ez7VMc:.CLIENT;qqf0n:.CLIENT;me3ike:.CLIENT;IrNywb:.CLIENT;Z94jBf:.CLIENT;A8708b:.CLIENT;YcfJ:.CLIENT;VM8bg:.CLIENT;hWT9Jb:.CLIENT;WCulWe:.CLIENT;NTJodf:.CLIENT;szjOR:.CLIENT;PY1zjf:.CLIENT;wnJTPd:.CLIENT;JL9QDc:.CLIENT;kWlxhc:.CLIENT;qGMTIf:.CLIENT;aeBrn:.CLIENT\"]","uniquenessScore":1},{"type":"PnC","value":"html > #gsr","uniquenessScore":1,"meta":{"seedLength":2,"optimized":2}},{"type":"xpath","value":"//BODY","uniquenessScore":1}],"meta":{"value":"https://thehelloworld.com/","elementDescription":"body#gsr","uniqueNodeId":null}},"screenshot":null,"url":"https://www.google.com/search?q=hello+world&source=hp&ei=7FpxYsSVIdDr-QahzabYCw&iflsig=AJiK0e8AAAAAYnFo_OPhPdzyq_tymXxYNrTsPy0ZgXVt&ved=0ahUKEwjEu4_N4sP3AhXQdd4KHaGmCbsQ4dUDCAc&oq=hello+world&gs_lcp=Cgdnd3Mtd2l6EAwyCAgAEIAEELEDMggILhCABBCxAzIFCAAQgAQyBQgAEIAEMgUIABCABDIICAAQgAQQsQMyBQgAEIAEMgUIABCABDIFCAAQgAQyCAgAELEDEIMBOg4IABCPARDqAhCMAxDlAjoOCC4QjwEQ6gIQjAMQ5QI6CwgAEIAEELEDEIMBOg4ILhCABBCxAxCDARDUAjoRCC4QgAQQsQMQgwEQxwEQowI6CAguELEDEIMBOgoIABCxAxCDARAKOgsILhCABBCxAxCDAToRCC4QgAQQsQMQxwEQowIQ1AI6CwguEIAEELEDENQCOgsILhCABBDHARCvAToLCAAQgAQQsQMQyQM6BQgAEJIDOggILhCABBDUAlDsBVjGDmDpHGgBcAB4AIAB3wGIAZIMkgEFMS44LjKYAQCgAQGwAQo&sclient=gws-wiz","status":"COMPLETED","time":1651596034135},{"type":"PAGE_SCREENSHOT","payload":{},"status":"COMPLETED","time":1651596036211}]
        await crusherRunnerActionManager.runActions(getBrowserActions(actions), browser);
        
        const browserContextOptions = globalManager.get("browserContextOptions");
        
        browserContext = await browser.newContext({
            ...browserContextOptions,
        });
        
        page = await browserContext.newPage();
        globalManager.set("events", []);
        const nodeFetch = require("node-fetch");
        const rrWebCode = await nodeFetch("https://cdn.jsdelivr.net/npm/rrweb@0.7.14/dist/rrweb.min.js").then(res => res.text());
        await page.exposeFunction('_replLog', (event) => {
          globalManager.get("events").push(event);
        });
        await page.evaluate(`;${rrWebCode}
        window.__IS_RECORDING__ = true
        rrweb.record({
          emit: event => window._replLog(event),
          recordCanvas: true,
          collectFonts: true
        });
      `);
    
      page.on('framenavigated', async (frame) => {
          try {
        const isRecording = await page.evaluate('window.__IS_RECORDING__');
        if (!isRecording) {
          await page.evaluate(`;${rrWebCode}
            window.__IS_RECORDING__ = true
            rrweb.record({
              emit: event => window._replLog(event),
              recordCanvas: true,
              collectFonts: true,
              inlineImages: true
            });
          `);
        }
    } catch (e) { console.error(e)}
      });        
        
        // await crusherRunnerActionManager.runActions(getMainActions(actions), browser, page);
        // await crusherRunnerActionManager.runActions(getMainActions(actions), browser, page);
        await page.goto("https://google.com");
        await page.click("input[title='Search']");
        await page.type("input[title='Search']", "Hello World");
        await page.click("input[type='submit']");
        await page.waitForNavigation({
          url: (url) => {
              return url.toString().includes("/search");
          }
      });
        await page.click("text=HelloWorld Coliving");
        await page.click("text=EXPLORE OUR");
        
        
          await page.close();
          await browserContext.close();
          if(browser)
          await browser.close();
 
        
        
        const fs = require('fs');
        fs.writeFileSync("./main.json", JSON.stringify(getMainActions(actions)), "utf8");

        fs.writeFileSync("/Users/utkarsh/Desktop/crusher/rrweb-editor/src/events.json", JSON.stringify(globalManager.get('events')), "utf8");
        
	})()
