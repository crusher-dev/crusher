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
        getBrowserActions,
        getMainActions
    } = require("crusher-runner-utils");

    // @TODO: globalManager, logManager and storageManager are supposed to be injected globally
    const crusherRunnerActionManager = new CrusherRunnerActions(logManager, storageManager, "/tmp/crusher/somedir/", globalManager);

    const browser = await playwright["CHROME"].launch({
        "headless": true,
        "args": ["--disable-shm-usage", "--disable-gpu"]
    });
    let capturedVideo, browserContext, page;
    try {
        globalManager.set("browserContextOptions", {
            "defaultNavigationTimeout": 30000,
            "defaultTimeout": 15000,
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
            },
            "screenshot": null
        }, {
            "type": "PAGE_NAVIGATE_URL",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "html >> body",
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
                    "value": "https://app.crusher.dev/"
                }
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/"
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=Signup",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".underline",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "[href=\"/signup\"] >> span",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "a >> .underline",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-15 >> span",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".font-500 >> span",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> .underline",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "span.underline",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "[href=\"/signup\"] >> .underline",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex >> .underline",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": "a > .underline",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".font-cera .underline",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex .underline",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[3]/A[1]/SPAN[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                },
                "timeout": 15
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/login",
            "name": "Signup link"
        }, {
            "type": "PAGE_WAIT_FOR_NAVIGATION",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "body",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "html >> body",
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
                    "value": "https://app.crusher.dev/signup"
                }
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/signup"
        }, {
            "type": "ELEMENT_ASSERT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=Create your account",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-16",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".font-700",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".leading-none",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div.text-16",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div.font-700",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex-col >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div.leading-none",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex >> .text-16",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex >> .font-700",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".flex > .text-16",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex .font-cera:nth-child(2)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-11mjg1v .font-cera:nth-child(2)",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "validations": [{
                        "id": "new-row1",
                        "field": {
                            "name": "innerHTML",
                            "value": "Create your account",
                            "meta": {
                                "type": "innerHTML"
                            }
                        },
                        "operation": "MATCHES",
                        "validation": "Create your account"
                    }]
                },
                "timeout": 15
            },
            "screenshot": null,
            "url": "",
            "name": "Assert Create your account label"
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> .flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> .items-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> .justify-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> div.flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> div.items-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> div.justify-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> .flex.items-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> .flex.justify-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div:nth-of-type(2) >> .justify-center.items-center",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".css-16t7bv9 > .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-1l4gkw8 .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex > .css-1l4gkw8 .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/BUTTON[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                },
                "timeout": 15
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/signup",
            "name": "Continue with email"
        }, {
            "type": "ELEMENT_ADD_INPUT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "input",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "[autocomplete=\"name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> [placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "input[placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> input",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex >> [placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".relative >> [placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex-col >> [placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".items-center >> [placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[autocomplete=\"name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[placeholder=\"Enter name\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[value=\"Hello world\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".mb-12:nth-child(1) .css-g27g6f",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-w9kmsm > .mb-12:nth-child(1) .css-g27g6f",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "Hello world"
                }
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/signup"
        }, {
            "type": "PAGE_CUSTOM_CODE",
            "payload": {
                "selectors": null,
                "meta": {
                    "script": "async function validate(){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n  const emailElement = await crusherSdk.$(\"input[autocomplete=email]\");\n  \n  function uuidv4() {\n    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {\n      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);\n      return v.toString(16);\n    });\n  }\n  await emailElement.type(`${uuidv4().substr(0, 10)}@gmail.com`);\n}"
                }
            },
            "screenshot": null,
            "url": "",
            "name": "Fill random email "
        }, {
            "type": "ELEMENT_ADD_INPUT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "[type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "[placeholder=\"Enter your password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "[placeholder=\"Enter your password\"][type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> [type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "input[type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> [placeholder=\"Enter your password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "input[placeholder=\"Enter your password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex >> [type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".relative >> [type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex-col >> [type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[placeholder=\"Enter your password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[type=\"password\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "input[value=\"crushertesting\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".mb-20 .css-g27g6f",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-w9kmsm > .mb-20 .css-g27g6f",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[3]/DIV[1]/INPUT[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": "crushertesting"
                },
                "timeout": 15
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/signup",
            "name": "Set password as \"crushertesting\""
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "button >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".rem-24 >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "button >> .flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-14 >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-white >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".leading-none >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "button >> .items-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "button >> .justify-center",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".rem-24 >> .flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-14 >> .flex",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".rem-24 > .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-w9kmsm .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex > .css-w9kmsm .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/BUTTON[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                }
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/signup"
        }, {
            "type": "ELEMENT_ASSERT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=How it works in 60 seconds?",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-18",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".font-700",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".leading-none",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .text-18",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .font-700",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .leading-none",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div.text-18",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div.font-700",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex-col >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "div[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".flex > .m-8",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex .m-8",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-11mjg1v .m-8",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "validations": [{
                        "id": "new-row2",
                        "field": {
                            "name": "innerHTML",
                            "value": "How it works in 60 seconds?",
                            "meta": {
                                "type": "innerHTML"
                            }
                        },
                        "operation": "MATCHES",
                        "validation": "How it works in 60 seconds?"
                    }]
                },
                "timeout": 15
            },
            "screenshot": null,
            "url": "",
            "name": "Assert how it works onboarding"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=Next",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-14",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .text-14",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".flex > .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-11mjg1v .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/BUTTON[1]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "screenshot": null,
            "url": ""
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=Next",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-14",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .text-14",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "button[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".flex > .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-11mjg1v .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/BUTTON[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                },
                "timeout": 15
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/setup/onboarding",
            "name": "\"Next\""
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=Open Dashboard",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> .rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".flex > .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-11mjg1v .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/BUTTON[1]",
                    "uniquenessScore": 1
                }],
                "meta": null
            },
            "screenshot": null,
            "url": ""
        }, {
            "type": "ELEMENT_CLICK",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=Open Dashboard",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "#__next >> .text-white",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div >> .rem-24",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".flex >> button",
                    "uniquenessScore": 1
                }, {
                    "type": "attribute",
                    "value": "button[style=\"outline-style: none; outline-width: 0px;\"]",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".flex > .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".css-11mjg1v .rem-24",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/BUTTON[1]",
                    "uniquenessScore": 1
                }],
                "meta": {
                    "value": ""
                },
                "timeout": 15
            },
            "screenshot": null,
            "url": "https://app.crusher.dev/setup/onboarding",
            "name": "Open Dashboard"
        }, {
            "type": "ELEMENT_SCREENSHOT",
            "payload": {
                "selectors": [{
                    "type": "playwright",
                    "value": "text=HHello worldfree",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".relative >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".leading-none >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".relative >> .flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".leading-none >> .flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div.relative >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": "div.leading-none >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".relative >> div.flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".leading-none >> div.flex",
                    "uniquenessScore": 1
                }, {
                    "type": "playwright",
                    "value": ".leading-none.relative >> div",
                    "uniquenessScore": 1
                }, {
                    "type": "PnC",
                    "value": ".css-0 > .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 2,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": "div > .css-0 > .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 3,
                        "optimized": 2
                    }
                }, {
                    "type": "PnC",
                    "value": ".flex > div:nth-child(1) > .flex:nth-child(1) > .flex",
                    "uniquenessScore": 1,
                    "meta": {
                        "seedLength": 4,
                        "optimized": 2
                    }
                }, {
                    "type": "xpath",
                    "value": "BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]",
                    "uniquenessScore": 1
                }],
                "meta": null,
                "timeout": 15
            },
            "screenshot": null,
            "url": "",
            "name": "Sidebar user info"
        }, {
            "type": "PAGE_CUSTOM_CODE",
            "payload": {
                "selectors": null,
                "meta": {
                    "script": "async function validate(){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n  await crusherSdk.fetch(\"https://backend.crusher.dev/users/actions/delete\", {\n  \"headers\": {\n    Accept: \"application/json, text/plain, */*\", \"Content-Type\": \"application/json\",\n  },\n  \"method\": \"POST\",\n  \t\tcredentials: \"include\",\n\n  \"body\": JSON.stringify({}),\n  });\n}"
                }
            },
            "screenshot": null,
            "url": "",
            "name": "Cleanup"
        }]
        await crusherRunnerActionManager.runActions(getBrowserActions(actions), browser);

        browserContextOptions = globalManager.get("browserContextOptions");

        browserContext = await browser.newContext({
            ...browserContextOptions,
        });

        browserContext.setDefaultNavigationTimeout(browserContextOptions.defaultNavigationTimeout);
        browserContext.setDefaultTimeout(browserContextOptions.defaultTimeout);

        page = await browserContext.newPage({});
        await handlePopup(page, browserContext);


        await crusherRunnerActionManager.runActions(getMainActions(actions), browser, page);
    } catch (ex) {
        console.error(ex);

        globalManager.set("recordedVideoPath", await page.video().path());

        await page.close();
        await browserContext.close();
        await browser.close();
        throw ex;
    }


    globalManager.set("recordedVideoPath", await page.video().path());

    await page.close();
    await browserContext.close();
    await browser.close();
})()