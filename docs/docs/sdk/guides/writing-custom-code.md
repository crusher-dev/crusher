---
title: Writing Custom Code - Crusher SDK
sidebar_label: Writing Custom Code
---

This guide is to walk you through, on how-to use custom code
to create complex workflows.

## Custom Code

After selecting the custom code action from the sidebar, a modal will with editor
will open up.

<img src={require('@site/static/img/custom-code/modal.png').default} />

All the custom-code and logic would go inside the `validate()` function in the editor.
This function is then executed in a sandbox environment (for security) and determines
if the step has passed/failed.

_Note_: The initial code in the modal cannot be edited or deleted. Press enter at the
end of line 3 to start writing the code.

## Crusher SDK

The `validate()` function in the custom code recieves crusherSdk as the first argument, which
we can use to write your logic.

You can find the SDK reference here, https://docs.crusher.dev/sdk/reference

### Selecting an element

Passing a selector to [`crusherSdk.page.querySelector`](https://docs.crusher.dev/sdk/reference#page.querySelector) will return the selected element
object if found. By default, it will wait for 30s for the element to be appear and visible.

```
// Waits automatically till the element is visible, with default timeout (30s)
let element = await crusherSdk.page.querySelector("selector");

// Waits automatically till the element is visible, with 5s timeout
let element = await crusherSdk.page.querySelector("selector", { timeout: 5000 });

// Doesn't wait, returns null if no element found
let element = await crusherSdk.page.querySelector("selector", { waitUntil: null })
```

### Clicking on element

For reference, https://docs.crusher.dev/skd/reference#element.click

```
// Waits automatically till the element is visible, with default timeout (30s)
let element = await crusherSdk.page.querySelector("selector");
await element.click();
```

### Hover on element

For reference, https://docs.crusher.dev/skd/reference#element.hover

```
// Waits automatically till the element is visible, with default timeout (30s)
let element = await crusherSdk.page.querySelector("selector");
await element.click();
```

### Hover on element

For reference, https://docs.crusher.dev/skd/reference#element.hover

```
await element.hover();
```

### Taking Screenshot of element

```
await element.screenshot({name: "element.png"}); // Returns path to captured screenshot, named `element.png`
```

### Typing in input

```
await element.type("some-random-email@gmail.com");
```

### Get current page url

```
const pageUrl = await crusherSdk.page.url();
```

### Using context for using/storing information

Checkout the docs about test context here, https://docs.crusher.dev/context

```
const userEmail = ctx.email || "default-email@gmail.com"; // Use value from the context
await element.type("some-random-email@gmail.com");

const randomPassword = Math.random().toString(36).slice(2);
ctx.password = randomPassword; // Can be accessed later in another step/test using ctx.password
```

### Sleep for a interval

```
await crusherSdk.sleep(3000); // Sleeps for 3s
```

### Throwing error or failing the test

Lastly you can simply throw an error, to mark step/test fail according to your logic.
The Error message will be logged and shown in the test report.

```
const pageUrl = await crusherSdk.page.url();
if(pageUrl.startsWith("https://") {
  throw new Error("Navigation should always be redirected
    to HTTPS, found HTTP url"); // <-- Fails the test with message
}
```
