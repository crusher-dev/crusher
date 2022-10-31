---
title: Crusher SDK Reference
sidebar_label: API Reference
---

This page contains API reference for the crusher SDK, which can be used while writing custom code.

## Page Actions

Can be accessed through `crusherSdk.page`

- [`.querySelector(elementSelector[, options])`](#queryselectorelementselector-options)
- [`.url()`](#url)
- [`.navigate(url[, options])`](#navigateurl-options)
- [`.screenshot([options])`](screenshotoptions)
- [`.evaluate(pageFunction[, arg, options])`](#evaluatepagefunction-arg-options)
- [`.waitForFunction(jsFunction[, options])`](#waitforfunctionjsfunction-options)
- [`.exposeFunction(functionName, callback)`](#exposefunctionfunctionname-callback)
- [`.waitForNavigation(url[, options])`](#waitfornavigationurl-options)

### .querySelector(elementSelector[, options])

- `elementSelector` &lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)&gt; Element selector to locate the element
- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Element](http://localhost:3000/docs/sdk/reference#element-actions)&gt;&gt;

### .url()

- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)&gt;&gt;

Returns the current page URL.

### .navigate(url[, options])

- `url` &lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)&gt; URL to navigate to
- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)&gt;&gt;

Navigates to the provided url.

### .screenshot([options])

- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)&gt;&gt;

Take screenshot of the page, and returns the path to the captured screenshot.

### .evaluate(pageFunction[, arg, options])

- `pageFunction` &lt;[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)&gt; Function to be evaluated in browser context
- `arg` &lt;[any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Any_type)&gt; Argument to pass to the pageFunction. To pass multiple arguments, use an array.
- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Any_type)&gt;&gt;

Runs the provided function in browser context, and returns the result if it json-serializable.

### .waitForFunction(jsFunction[, options])

- `jsFunction` &lt;[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)&gt; Function to be evaluated in browser context
- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)&gt;&gt;

Waits until the provided js function evaluates to true in browser context.

### .exposeFunction(functionName, callback)

- `functionName` &lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)&gt; Name of the function to expose
- `callback` &lt;[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)&gt; Function to be called when this function is called from inside the webpage
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)&gt;&gt;

Exposes a function to the webpage. When called from the page context, the callback in node environment will be invoked with the provided arguments.

### .waitForNavigation(url[, options])

- `url` &lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)&gt; URL to keep waiting for to consider navigation is completed
- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)&gt;&gt;

Waits for the page to navigate to the provided url.

## Element Actions

Operation over DOM element instances, i.e after `crusherSdk.page.querySelector(selector)`:

- [`.click([options])`](#clickoptions)
- [`.hover([options])`](#hoveroptions)
- [`.screenshot([options])`](#screenshotoptions-1)
- [`.evaluate(jsFunction[, arg])`](#evaluatejsfunction-arg)
- [`.scrollIntoView()`](#scrollintoview)

### .click([options])

- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)&gt;&gt;

Perform click on the element and wait for navigation to finish.

### .hover([options])

- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `timeout` Timeout in milliseconds, defaults to 30s
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)&gt;&gt;

Perform hover on the element and wait for navigation to finish.

### .screenshot([options])

- `options` &lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&gt;
  - `name` Name of the screenshot, defaults to random 32-length
  - `timeout` Timeout in milliseconds, defaults to 30s

### .evaluate(jsFunction[, arg])

- `jsFunction` &lt;[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)&gt; Function to be evaluated in browser context
- `arg` &lt;[any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Any_type)&gt; Argument to pass to the pageFunction. To pass multiple arguments, use an array.
- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Any_type)&gt;&gt;

Runs the provided function in browser context, and returns the result if it json-serializable.

**Note**: The pageFunction will be called with the element as the first argument. So the callback would look
something like this,

```
await inputElement.evaluate(function(element, arg) {
  return element.value;
});
```

### .scrollIntoView()

- returns: &lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)&gt;&gt;

Scrolls the element into view if it's not already.

## Assertions

The assertions will follow the jest standard API’s, i.e `expect(var).toContain(””)`.
Checkout the [jest documentation](https://jestjs.io/docs/en/expect) for more details.

- `expect(var).toBe(value)` - Equal object instance
- `expect(var).not.toBe(value)` - Negative assertion
- `expect(var).toMatchObject()` - For matching object
<!-- - `expect(imageScreenshotName).toMatchBaseline(options)` - Custom method for comparing to baseline -->
- `expect([]).toContain(”item”)` :- Assertion for array to check if it contains an item

<!-- ## Utilities

1. `.sleep(timeInMs)`: Waits and pauses execution for the specified interval
2. `.fetch(url, options)`: Makes request in the node-process and returns the response. Can be useful to avoid CORS related errors. This is different from running network request in the browser itself. If you are looking for how to run network request in browser itself with cookies, checkout this section
3. `.setCookies(cookies: any)` : Set cookies through custom-code
4. `.mock()`: (In-future) Create a mock/stub API route when running the tests. Every API responses and behaviour can be customised with this. -->
