(async function() {
    class GlobalManagerPolyfill {
        map;
        constructor() {
            this.map = new Map();
        }
        has(key) {
            return this.map.has(key);
        }
        get(key) {
            return this.map.get(key);
        }
        set(key, value) {
            this.map.set(key, value);
        }
    }
    class LogManagerPolyfill {
        logStep(...args) {
            console.log(args[2]);
        }
    }
    class StorageManagerPolyfill {
        uploadBuffer(buffer, destionation) {
            return "uploadBuffer.jpg";
        }
        upload(filePath, destination) {
            return "upload.jpg";
        }
        remove(filePath) {
            return "remove.jpg";
        }
    }
    const logManager = new LogManagerPolyfill();
    const storageManager = new StorageManagerPolyfill();
    const globalManager = new GlobalManagerPolyfill();
    const playwright = require("playwright");
    const path = require("path");

    const {
        CrusherRunnerActions,
        handlePopup,
        registerCrusherSelectorEngine,
        getBrowserActions,
        getMainActions
    } = require("../../output/crusher-runner-utils");

    // @TODO: globalManager, logManager and storageManager are supposed to be injected globally
    const crusherRunnerActionManager = new CrusherRunnerActions(logManager, storageManager, "/tmp/crusher/somedir/", globalManager);

    const browser = await playwright["chromium"].launch({
        "headless": false,
        "args": ["--disable-shm-usage", "--disable-gpu", "--disable-software-rasterizer"]
    });
    let capturedVideo, browserContext, page;
    try {
        globalManager.set("browserContextOptions", {
            "defaultNavigationTimeout": 15000,
            "defaultTimeout": 5000,
            "recordVideo": {
                "dir": "/tmp/crusher-videos/somedir"
            }
        });

        const actions = [{
            "type": "BROWSER_SET_DEVICE",
            "payload": {
                "meta": {
                    "device": {
                        "id": "GoogleChromeMediumScreen",
                        "name": "Desktop M",
                        "width": 1280,
                        "height": 800,
                        "visible": true,
                        "userAgent": "Google Chrome"
                    }
                }
            }
        }, {
            "type": "PAGE_NAVIGATE_URL",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[jsmodel=\"TvHxbe\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[jsaction=\"YUC7He:.CLIENT;vPBs3b:.CLIENT;IVKTfe:.CLIENT;HiCeld:.CLIENT;KsNBn:.CLIENT;sbTXNb:.CLIENT;xjhTIf:.CLIENT;O2vyse:.CLIENT;Ez7VMc:.CLIENT;qqf0n:.CLIENT;me3ike:.CLIENT;IrNywb:.CLIENT;Z94jBf:.CLIENT;A8708b:.CLIENT;YcfJ:.CLIENT;A6SDQe:.CLIENT;LjVEJd:.CLIENT;VM8bg:.CLIENT;hWT9Jb:.CLIENT;WCulWe:.CLIENT;NTJodf:.CLIENT;szjOR:.CLIENT;PY1zjf:.CLIENT;wnJTPd:.CLIENT;JL9QDc:.CLIENT;kWlxhc:.CLIENT\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "html > body",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "https://www.google.com/"
                }
            },
            "url": "https://www.google.com/"
        }, {
            "type": "ELEMENT_FOCUS",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[aria-label=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "dataAttribute",
                    "value": "input[data-ved=\"0ahUKEwj_y8q99a7yAhUDcCsKHcVYBrgQ39UDCAQ\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[jsaction=\"paste:puy29d;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[maxlength=\"2048\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"q\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"text\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-autocomplete=\"both\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-haspopup=\"false\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocorrect=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autofocus=\"\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[role=\"combobox\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[spellcheck=\"false\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[value=\"\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-label=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".a4bIc > .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".SDkEP .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".RNNXgb .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".A8SBwf .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "form .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".o3j99 .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": true
                }
            },
            "url": "https://www.google.com/"
        }, {
            "type": "ELEMENT_ADD_INPUT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[aria-label=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "dataAttribute",
                    "value": "input[data-ved=\"0ahUKEwj_y8q99a7yAhUDcCsKHcVYBrgQ39UDCAQ\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[jsaction=\"paste:puy29d;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[maxlength=\"2048\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"q\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"text\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-autocomplete=\"both\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-haspopup=\"false\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocorrect=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autofocus=\"\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[role=\"combobox\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[spellcheck=\"false\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[value=\"\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-label=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".a4bIc > .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".SDkEP .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".RNNXgb .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".A8SBwf .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "form .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".o3j99 .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ["t", "h", "e", " ", "g", "r", "e", "a", "t", " ", "k", "h", "a", "l", "i", "s", "i", "Enter"]
                }
            },
            "url": "https://www.google.com/"
        }, {
            "type": "ELEMENT_HOVER",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[aria-label=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "dataAttribute",
                    "value": "input[data-ved=\"0ahUKEwj_y8q99a7yAhUDcCsKHcVYBrgQ39UDCAQ\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[jsaction=\"paste:puy29d;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[maxlength=\"2048\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"q\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"text\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-autocomplete=\"both\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-haspopup=\"false\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocorrect=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autofocus=\"\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[role=\"combobox\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[spellcheck=\"false\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[value=\"\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[aria-label=\"Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".a4bIc > .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".SDkEP .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".RNNXgb .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".A8SBwf .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "form .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".o3j99 .gLFyf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://www.google.com/"
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[aria-label=\"Google Search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "dataAttribute",
                    "value": "input[data-ved=\"0ahUKEwj_y8q99a7yAhUDcCsKHcVYBrgQ4dUDCAY\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "center:nth-child(2) > .gNO89b",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".lJ9FBc:nth-child(7) .gNO89b",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".aajZCb .gNO89b",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".UUbT9 .gNO89b",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".A8SBwf > .UUbT9 .gNO89b",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div .UUbT9 .gNO89b",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "form .UUbT9 .gNO89b",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "input[value=\"Google Search\"]",
                    "uniquenessScore": 0.5
                }, {
                    "type": "attribute",
                    "value": "input[aria-label=\"Google Search\"]",
                    "uniquenessScore": 0.5
                }, {
                    "type": "attribute",
                    "value": "input[name=\"btnK\"]",
                    "uniquenessScore": 0.5
                }, {
                    "type": "attribute",
                    "value": "input[type=\"submit\"]",
                    "uniquenessScore": 0.25
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[2]/CENTER[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://www.google.com/"
        }, {
            "type": "PAGE_WAIT_FOR_NAVIGATION",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[jsmodel=\"TvHxbe\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[jsaction=\"YUC7He:.CLIENT;vPBs3b:.CLIENT;IVKTfe:.CLIENT;HiCeld:.CLIENT;KsNBn:.CLIENT;sbTXNb:.CLIENT;xjhTIf:.CLIENT;O2vyse:.CLIENT;Ez7VMc:.CLIENT;qqf0n:.CLIENT;me3ike:.CLIENT;IrNywb:.CLIENT;Z94jBf:.CLIENT;A8708b:.CLIENT;YcfJ:.CLIENT;A6SDQe:.CLIENT;LjVEJd:.CLIENT;VM8bg:.CLIENT;hWT9Jb:.CLIENT;WCulWe:.CLIENT;NTJodf:.CLIENT;szjOR:.CLIENT;PY1zjf:.CLIENT;wnJTPd:.CLIENT;JL9QDc:.CLIENT;kWlxhc:.CLIENT\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "html > body",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "https://www.google.com/"
                }
            },
            "url": "https://www.google.com/"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "//*[@id='rso']/div[1]/div/div/div/div[1]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".g:nth-child(1) > div:nth-child(2) .yuRUbf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".hlcw0c:nth-child(1) .yuRUbf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#rso > .hlcw0c:nth-child(1) .yuRUbf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div > #rso > .hlcw0c:nth-child(1) .yuRUbf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#search .hlcw0c:nth-child(1) .yuRUbf",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[7]/DIV[1]/DIV[8]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "url": ""
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=The Great Khali - Wikipedia",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "h3[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".g:nth-child(1) > div:nth-child(2) .LC20lb",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".hlcw0c:nth-child(1) .LC20lb",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#rso > .hlcw0c:nth-child(1) .LC20lb",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[7]/DIV[1]/DIV[8]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/A[1]/H3[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://www.google.com/search?q=the+great+khalisi&source=hp&ei=zeAWYb-xCoPgrQHFsZnACw&iflsig=AINFCbYAAAAAYRbu3X2vKeZOPRi-4_gkiFb2keCeFBbr&oq=the+great+khalisi&gs_lcp=Cgdnd3Mtd2l6EAMyCgguELEDEA0QkwIyBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA06CAgAEOoCEI8BOgsIABCABBCxAxCDAToFCAAQgAQ6CAgAEIAEELEDOggILhCxAxCDAToFCC4QgAQ6CwguEIAEELEDEIMBOg4ILhCABBCxAxCDARCTAjoICC4QgAQQsQM6DgguEIAEELEDEMcBEK8BOgsILhCABBCxAxCTAjoLCC4QgAQQxwEQrwFQhiRYkT1g2kNoAXAAeACAAeQBiAGSE5IBBjAuMTUuMpgBAKABAbABCg&sclient=gws-wiz&ved=0ahUKEwj_y8q99a7yAhUDcCsKHcVYBrgQ4dUDCAY&uact=5"
        }, {
            "type": "PAGE_WAIT_FOR_NAVIGATION",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#gsr",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[jsmodel=\"TvHxbe\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[jscontroller=\"Eox39d\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[marginheight=\"3\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[topmargin=\"3\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[jsaction=\"rcuQ6b:npT2md;YUC7He:.CLIENT;vPBs3b:.CLIENT;IVKTfe:.CLIENT;HiCeld:.CLIENT;KsNBn:.CLIENT;sbTXNb:.CLIENT;xjhTIf:.CLIENT;O2vyse:.CLIENT;Ez7VMc:.CLIENT;qqf0n:.CLIENT;me3ike:.CLIENT;IrNywb:.CLIENT;Z94jBf:.CLIENT;A8708b:.CLIENT;YcfJ:.CLIENT;A6SDQe:.CLIENT;LjVEJd:.CLIENT;VM8bg:.CLIENT;hWT9Jb:.CLIENT;WCulWe:.CLIENT;NTJodf:.CLIENT;szjOR:.CLIENT;PY1zjf:.CLIENT;wnJTPd:.CLIENT;JL9QDc:.CLIENT;kWlxhc:.CLIENT;aeBrn:.CLIENT\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "html > #gsr",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiCkfHB9a7yAhVcKysKHfFABt0QFnoECAMQAQ&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FThe_Great_Khali&usg=AOvVaw1wK7BnbBDkVArgA_bOLU4w"
                }
            },
            "url": "https://www.google.com/search?q=the+great+khalisi&source=hp&ei=zeAWYb-xCoPgrQHFsZnACw&iflsig=AINFCbYAAAAAYRbu3X2vKeZOPRi-4_gkiFb2keCeFBbr&oq=the+great+khalisi&gs_lcp=Cgdnd3Mtd2l6EAMyCgguELEDEA0QkwIyBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA0yBAgAEA06CAgAEOoCEI8BOgsIABCABBCxAxCDAToFCAAQgAQ6CAgAEIAEELEDOggILhCxAxCDAToFCC4QgAQ6CwguEIAEELEDEIMBOg4ILhCABBCxAxCDARCTAjoICC4QgAQQsQM6DgguEIAEELEDEMcBEK8BOgsILhCABBCxAxCTAjoLCC4QgAQQxwEQrwFQhiRYkT1g2kNoAXAAeACAAeQBiAGSE5IBBjAuMTUuMpgBAKABAbABCg&sclient=gws-wiz&ved=0ahUKEwj_y8q99a7yAhUDcCsKHcVYBrgQ4dUDCAY&uact=5"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "#firstHeading",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#firstHeading",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "h1[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#content > #firstHeading",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki #firstHeading",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js #firstHeading",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/H1[1]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "url": ""
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=All Pro Wrestling (2000–2001)",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".tocsection-3 .toctext",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "ul > .tocsection-3 .toctext",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".toclevel-1 .tocsection-3 .toctext",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "ul .tocsection-3 .toctext",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#toc .tocsection-3 .toctext",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mw-parser-output > #toc .toclevel-1:nth-child(2) .toclevel-2:nth-child(1) .toctext",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "span[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.3333333333333333
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/DIV[3]/DIV[5]/DIV[1]/DIV[2]/UL[1]/LI[2]/UL[1]/LI[1]/A[1]/SPAN[2]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://en.wikipedia.org/wiki/The_Great_Khali"
        }, {
            "type": "PAGE_SCROLL",
            "payload": {
                "selectors": null,
                "meta": {
                    "value": [1119, 1119]
                }
            },
            "url": "https://en.wikipedia.org/wiki/The_Great_Khali#All_Pro_Wrestling_(2000%E2%80%932001)"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "p:nth-of-type(6)",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".mw-parser-output > p:nth-child(12)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-content-text p:nth-child(12)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#bodyContent > #mw-content-text p:nth-child(12)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#content > #bodyContent > #mw-content-text p:nth-child(12)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki > #content > #bodyContent > #mw-content-text p:nth-child(12)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js p:nth-child(12)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "p[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.16666666666666666
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/DIV[3]/DIV[5]/DIV[1]/P[6]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "url": ""
        }, {
            "type": "ELEMENT_HOVER",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "p:nth-of-type(6) >> a",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mw-parser-output > p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#bodyContent > #mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#content > #bodyContent > #mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki > #content > #bodyContent > #mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "a[title=\"\"]",
                    "uniquenessScore": 0.5
                }, {
                    "type": "attribute",
                    "value": "a[href=\"/wiki/All_Pro_Wrestling\"]",
                    "uniquenessScore": 0.25
                }, {
                    "type": "attribute",
                    "value": "a[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.1111111111111111
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/DIV[3]/DIV[5]/DIV[1]/P[6]/A[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://en.wikipedia.org/wiki/The_Great_Khali#All_Pro_Wrestling_(2000%E2%80%932001)"
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "p:nth-of-type(6) >> a",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mw-parser-output > p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#bodyContent > #mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#content > #bodyContent > #mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki > #content > #bodyContent > #mw-content-text p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js p:nth-child(12) > a:nth-child(1)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "a[title=\"\"]",
                    "uniquenessScore": 0.5
                }, {
                    "type": "attribute",
                    "value": "a[href=\"/wiki/All_Pro_Wrestling\"]",
                    "uniquenessScore": 0.25
                }, {
                    "type": "attribute",
                    "value": "a[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.1111111111111111
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/DIV[3]/DIV[5]/DIV[1]/P[6]/A[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://en.wikipedia.org/wiki/The_Great_Khali#All_Pro_Wrestling_(2000%E2%80%932001)"
        }, {
            "type": "PAGE_WAIT_FOR_NAVIGATION",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".client-js > .mediawiki",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "/wiki/All_Pro_Wrestling"
                }
            },
            "url": "https://en.wikipedia.org/wiki/The_Great_Khali#All_Pro_Wrestling_(2000%E2%80%932001)"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "p:nth-of-type(2)",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "p[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".mw-parser-output > p:nth-child(5)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-content-text p:nth-child(5)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#bodyContent > #mw-content-text p:nth-child(5)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#content > #bodyContent > #mw-content-text p:nth-child(5)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki > #content > #bodyContent > #mw-content-text p:nth-child(5)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js p:nth-child(5)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/DIV[3]/DIV[5]/DIV[1]/P[2]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "url": ""
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=About Wikipedia",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "a[title=\"Learn about Wikipedia and how it works\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#n-aboutsite > a",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".vector-menu-content-list > #n-aboutsite > a",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".vector-menu-content #n-aboutsite > a",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#p-navigation #n-aboutsite > a",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-panel > #p-navigation #n-aboutsite > a",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-navigation > #mw-panel > #p-navigation #n-aboutsite > a",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki > #mw-navigation > #mw-panel > #p-navigation #n-aboutsite > a",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "a[href=\"/wiki/Wikipedia:About\"]",
                    "uniquenessScore": 0.5
                }, {
                    "type": "attribute",
                    "value": "a[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.125
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[5]/DIV[2]/NAV[1]/DIV[1]/UL[1]/LI[5]/A[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://en.wikipedia.org/wiki/All_Pro_Wrestling"
        }, {
            "type": "PAGE_WAIT_FOR_NAVIGATION",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "body[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".client-js > .mediawiki",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "/wiki/Wikipedia:About"
                }
            },
            "url": "https://en.wikipedia.org/wiki/All_Pro_Wrestling"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": ".sidebar >> tbody",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "tbody[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".help-box > tbody",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mw-parser-output > .help-box > tbody",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-content-text .help-box > tbody",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#bodyContent > #mw-content-text .help-box > tbody",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#content > #bodyContent > #mw-content-text .help-box > tbody",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki > #content > #bodyContent > #mw-content-text .sidebar:nth-child(11) > tbody",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js .sidebar:nth-child(11) > tbody",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/DIV[3]/DIV[5]/DIV[1]/TABLE[3]/TBODY[1]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "url": ""
        }, {
            "type": "ELEMENT_FOCUS",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[placeholder=\"Search Wikipedia\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"sentences\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search Wikipedia [alt-shift-f]\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[accesskey=\"f\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#simpleSearch > #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div > #searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-navigation > #mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[5]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/FORM[1]/DIV[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": true
                }
            },
            "url": "https://en.wikipedia.org/wiki/Wikipedia:About"
        }, {
            "type": "ELEMENT_ADD_INPUT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[placeholder=\"Search Wikipedia\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"sentences\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search Wikipedia [alt-shift-f]\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[accesskey=\"f\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#simpleSearch > #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div > #searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-navigation > #mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[5]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/FORM[1]/DIV[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ["Shift+K", "i", "n", "g"]
                }
            },
            "url": "https://en.wikipedia.org/wiki/Wikipedia:About"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[placeholder=\"Search Wikipedia\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"sentences\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search Wikipedia [alt-shift-f]\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[accesskey=\"f\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#simpleSearch > #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div > #searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-navigation > #mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[5]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/FORM[1]/DIV[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "url": ""
        }, {
            "type": "ELEMENT_FOCUS",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[placeholder=\"Search Wikipedia\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"sentences\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search Wikipedia [alt-shift-f]\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[accesskey=\"f\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#simpleSearch > #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div > #searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-navigation > #mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[5]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/FORM[1]/DIV[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": true
                }
            },
            "url": "https://en.wikipedia.org/wiki/Wikipedia:About"
        }, {
            "type": "ELEMENT_FOCUS",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#searchInput",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[name=\"search\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[placeholder=\"Search Wikipedia\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocapitalize=\"sentences\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[title=\"Search Wikipedia [alt-shift-f]\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[accesskey=\"f\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"off\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#simpleSearch > #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div > #searchform #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 7,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "#mw-navigation > #mw-head > #right-navigation > #p-search #searchInput",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 8,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "input[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.5
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[5]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/FORM[1]/DIV[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": true
                }
            },
            "url": "https://en.wikipedia.org/wiki/Wikipedia:About"
        }, {
            "type": "ELEMENT_HOVER",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[rel=\"0\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "div[rel=\"0\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".mw-searchSuggest-link > .suggestions-result-current",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".suggestions-results .suggestions-result-current",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".suggestions .suggestions-result-current",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki .mw-searchSuggest-link:nth-child(1) > .suggestions-result",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js .mw-searchSuggest-link:nth-child(1) > .suggestions-result",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "div[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.08333333333333333
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[7]/DIV[1]/A[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://en.wikipedia.org/wiki/Wikipedia:About"
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[rel=\"0\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "div[rel=\"0\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".mw-searchSuggest-link > .suggestions-result-current",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".suggestions-results .suggestions-result-current",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".suggestions .suggestions-result-current",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki .mw-searchSuggest-link:nth-child(1) > .suggestions-result",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 5,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js .mw-searchSuggest-link:nth-child(1) > .suggestions-result",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 6,
                        "optimized": 2
                    }
                }, {
                    "type": "attribute",
                    "value": "div[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 0.08333333333333333
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[7]/DIV[1]/A[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "url": "https://en.wikipedia.org/wiki/Wikipedia:About"
        }, {
            "type": "PAGE_WAIT_FOR_NAVIGATION",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".client-js > .mediawiki",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "https://en.wikipedia.org/wiki/Wikipedia:About"
                }
            },
            "url": "https://en.wikipedia.org/wiki/Wikipedia:About"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "#firstHeading",
                    "uniquenessScore": 1
                }, {
                    "type": "id",
                    "value": "#firstHeading",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "h1[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "#content > #firstHeading",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".mediawiki #firstHeading",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".client-js #firstHeading",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[3]/H1[1]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "url": ""
        }]
        crusherRunnerActionManager.runActions(getBrowserActions(actions), browser);

        browserContextOptions = globalManager.get("browserContextOptions");

        browserContext = await browser.newContext({
            ...browserContextOptions,
        });

        browserContext.setDefaultNavigationTimeout(browserContextOptions.defaultNavigationTimeout);
        browserContext.setDefaultTimeout(browserContextOptions.defaultTimeout);

        page = await browserContext.newPage({});


        await handlePopup(page, browserContext);
        await registerCrusherSelectorEngine();


        await crusherRunnerActionManager.runActions(getMainActions(actions), browser, page);

    } catch (ex) {
        await browserContext.close();
        await browser.close();
        throw ex;
    }
    console.log("Path is", await page.video().path());
    await browserContext.close();
    await browser.close();
})()