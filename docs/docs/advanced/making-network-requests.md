---
title: Making network requests through custom code
sidebar_label: Making network requests
---

:::note What you'll learn?

- Making GET network requests
- Making POST & other network requests
- Using Headers with network requests
:::

  A lot of complex use-cases require the use of a network library to perform network requests. Crusher takes care of this, by providing you with a similar library node-fetch through SDK.

## Making GET Network requests

:::tip  
The `modules` global variable contains a lot of external modules including `nodeFetch` which can come in handy when writing custom logic.  
:::

To send GET network requests, all you need to do is call nodeFetch function, set method as "GET" and provide the URL. See the example below,

```javascript
const fetch = modules.nodeFetch;
const response = await fetch('https://reqres.in/api/users/2?page=0', {
  method: 'GET',
});
const responseJson = await response.json();
console.log('Received response', responseJson);
```

## Making POST and other REST requests

There are lot of HTTP request methods like POST, HEAD, OPTIONS that API use for various purposes. You can specify which request method to use by specifying the method property. See the example below,

```javascript
const fetch = modules.nodeFetch;
const response = await fetch('https://reqres.in/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John' }), // Needs to be converted to string first
});
const responseJson = await response.json();
console.log('Received response', responseJson);
```

## Customising Headers in network requests

Additional or custom headers can be provided by settings headers while calling nodeFetch function to fire network request. See the example below,

```javascript
const fetch = modules.nodeFetch;
const response = await fetch('https://reqres.in/api/users/delete', {
  method: 'DELETE',
  headers: {
    'Content-type': 'application/json',
    Authorization: 'Bearer <token-here>',
  },
});
const responseJson = await response.json();
console.log('Received response', responseJson);
```

## For more advanced use-cases

Since we are using the standard [node-fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) library, which is based on the stable and powerful fetch API offered by the browser, a lot of use-cases are already covered.

You can check them out here, [https://www.npmjs.com/package/node-fetch#user-content-api](https://www.npmjs.com/package/node-fetch#user-content-api)

Running this command will start the following process,

- You&#39;ll be asked to log in/sign up to link your crusher account
- CLI will download and extract the latest version of the recorder
- If you run this command in a non-git directory/project, you&#39;ll be asked to select a project.

## Special Note

:::note  
The method mentioned in this article fires requests from the node.js side, and hence would not send cookies along with requests even if `credentials` is set to 'include'.

See "Making network requests from browser" if you want to use fetch API of browser.
:::

## See also

How to use AirTable for test data?
How to work with emails in tests?
