---
title: Receiving emails
sidebar_label: Receiving emails
---

##### Requesting temporary email

```javascript
const fetch = require("node-fetch");
const response = await fetch("https://crusher-email-service.herokuapp.com/get.emailAddress", {method: "GET"});
const { email } = await response.json();

ctx.email = data.email;
```

##### Fetching latest message from inbox

```javascript
const { email } = ctx; // <--- Email saved in context previously
 
const fetch = require('node-fetch');
const inboxUrl = "https://crusher-email-service.herokuapp.com/inbox?email=" + email;
 
function releaseEmailAddress() {
	return fetch(
        "https://crusher-email-service.herokuapp.com/release?email=" + email,
        {method: "GET"}
    );
}
 
function waitForMail(maxTimeLimit = 60 * 1000) {
	return new Promise((resolve, reject) => {
		const startTime = new Date().getTime();
		const interval = setInterval(async () => {
		if (new Date().getTime() - startTime > maxTimeLimit) {
			clearInterval(interval);
			await releaseEmailAddress();
			reject("Timeout reached for email");
		}
		fetch(inboxUrl).then(async (res) => {
			if (res.status === 200) {
			const response = await res.json();
			if(response.inbox){ 
				clearInterval(interval);
				resolve(response);
			}
			}
		});
		}, 2000);
	});
}
 
const inboxMail = await waitForMail();
console.log("Mail received", inboxMail.inbox);
await releaseEmailAddress();
```