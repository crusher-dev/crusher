(async()=>{
const playwright = require('playwright');


const DEFAULT_SLEEP_TIME = 500;
const TYPE_DELAY = 100;
function sleep(time){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(true);
        }, time);
    })
}

const browser = await playwright["chromium"].launch();

const browserContext = await browser.newContext({userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36', viewport: { width: 1280, height: 800}});
const page = await browserContext.newPage({});
const {saveVideo} = require('playwright-video');
const captureVideo = await saveVideo(page, 'video.mp4');
try{
await page.goto('https://www.google.com/');
await sleep(DEFAULT_SLEEP_TIME);
await page.waitForSelector('#main > #body #hplogo', {state: "attached"});
const h_2 = await page.$('#main > #body #hplogo');
await h_2.screenshot({path: 'main__body_hplogo_2.png'});
await sleep(DEFAULT_SLEEP_TIME);
await page.waitForSelector('div > .A8SBwf > .FPdoLc > center > .gNO89b', {state: "attached"});
const h_3 = await page.$('div > .A8SBwf > .FPdoLc > center > .gNO89b');
await h_3.screenshot({path: 'div__A8SBwf__FPdoLc__center__gNO89b_3.png'});
await sleep(DEFAULT_SLEEP_TIME);
await page.waitForSelector('div > .A8SBwf > .FPdoLc > center > .RNmpXc', {state: "attached"});
const h_4 = await page.$('div > .A8SBwf > .FPdoLc > center > .RNmpXc');
await h_4.screenshot({path: 'div__A8SBwf__FPdoLc__center__RNmpXc_4.png'});
await page.waitForSelector('dvi > .sdgsg31 > .Sw21');
const h_5 = await page.$('dvi > .sdgsg31 > .Sw21');
await sleep(DEFAULT_SLEEP_TIME);
await captureVideo.stop();
}catch(ex){console.error(ex); await capture.stop();}
await browser.close();

})();