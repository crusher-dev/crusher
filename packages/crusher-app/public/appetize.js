var actions = [];

// Sending messages to iframe from parent window
var iframe = document.querySelector("iframe");

function requestSession() {
	iframe.contentWindow.postMessage("requestSession", "*");
}

function emitHomeButton() {
	iframe.contentWindow.postMessage("emitHomeButton", "*");
}

function rotateLeft() {
	iframe.contentWindow.postMessage("rotateLeft", "*");
}

function rotateRight() {
	iframe.contentWindow.postMessage("rotateRight", "*");
}

function setScale(number) {
	iframe.contentWindow.postMessage({ type: "setScale", value: number }, "*");
}

function saveScreenshot() {
	iframe.contentWindow.postMessage("saveScreenshot", "*");
}

function getScreenshot() {
	iframe.contentWindow.postMessage("getScreenshot", "*");
}

function heartbeat() {
	iframe.contentWindow.postMessage("heartbeat", "*");
}

function mouseclick(x, y) {
	iframe.contentWindow.postMessage({ type: "mouseclick", x: x, y: y }, "*");
}

function pasteText(textToPaste) {
	iframe.contentWindow.postMessage(
		{ type: "pasteText", value: textToPaste },
		"*",
	);
}

function keypress(key, shiftKey) {
	iframe.contentWindow.postMessage(
		{ type: "keypress", key: key, shiftKey: shiftKey },
		"*",
	);
}

// must be supported by app to work
function setLanguage(language_code) {
	alert("App must support language specified to work, default app does not");
	iframe.contentWindow.postMessage(
		{ type: "language", value: language_code },
		"*",
	);
}

// updates gps location in app
function setLocation(location) {
	iframe.contentWindow.postMessage({ type: "location", value: location }, "*");
}

// opens URL
function openUrl(url) {
	iframe.contentWindow.postMessage({ type: "url", value: url }, "*");
}

// ios only
function shakeDevice() {
	iframe.contentWindow.postMessage("shakeDevice", "*");
}

// android only
function androidKeycodeMenu() {
	iframe.contentWindow.postMessage("androidKeycodeMenu", "*");
}

function disableInteractions() {
	iframe.contentWindow.postMessage("disableInteractions", "*");
}

function enableInteractions() {
	iframe.contentWindow.postMessage("enableInteractions", "*");
}

function restartApp() {
	iframe.contentWindow.postMessage("restartApp", "*");
}

function endSession() {
	iframe.contentWindow.postMessage("endSession", "*");
}

var actions = [];
var index = 0;

function pushToFirebase(data) {
	console.log(data);
	firebase
		.database()
		.ref(`test/${testId}/${index++}`)
		.set(data);
}
// Receiving messages from iframe in parent window
var messageEventHandler = function (event) {
	pushToFirebase(event.data);

	if (event.data == "userInteractionReceived") {
		console.log(event.data);
	}

	if (event.data == "sessionRequested") {
		console.log(event.data);
	} else if (event.data == "userError") {
		console.log(event.data);
	} else if (event.data == "sessionQueued") {
		console.log(event.data);
	} else if (event.data && event.data.type == "sessionQueuedPosition") {
		console.log(event.data);
		// eg. {type: 'sessionQueuedPosition', position: 1}
	} else if (event.data == "accountQueued") {
		console.log(event.data);
	} else if (event.data && event.data.type == "accountQueuedPosition") {
		console.log(event.data);
		// eg. {type: 'accountQueuedPosition', position: 1}
	} else if (event.data == "appLaunch") {
		console.log(event.data);
	} else if (event.data == "firstFrameReceived") {
		console.log(event.data);
	} else if (event.data == "timeoutWarning") {
		console.log(event.data);
	} else if (event.data == "sessionEnded") {
		console.log(event.data);
	} else if (event.data && event.data.type == "orientationChanged") {
		console.log(event.data);
	} else if (event.data && event.data.type == "screenshot") {
		console.log(event.data);
		document.getElementById("screenshot").src = event.data.data;
	} else console.log(event.data);
};

window.addEventListener("message", messageEventHandler, false);
