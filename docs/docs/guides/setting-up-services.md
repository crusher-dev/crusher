---
title: 🚇 Test locally with tunnel proxy 
sidebar_label: Test locally with tunnel proxy 
---

Running test locally can be slow, or running test in machine like CI can be tough.

With crusher, you can enable it with few config. We use cloudflare warp to create tunnel and then use it to test


This can be helpful if you are,
1. [**Testing on local machine**](#testing-local-development): Run test against your local service. Super-fast execution.
2. **Testing on CI**: After building, expose local port to run test.

## Enabling tunnel proxy  

In `<project_dir>/.crusher/config.js` add following code, and restart crusher

```json
"proxy": [{
    "name": "frontend",
    "url": "http://localhost:3000/", // <-- Url of your local service
    "intercept": "localhost:3000" // <-- Url our 
  }]
```

Example: Check [sample config file](https://github.com/crusherdev/docsv2/blob/main/.crusher/config.json) with proxy.

:::info &nbsp;&nbsp; How will it work?

1. A local tunnel will be created using cloudflare argo.
2. Test runner will use that tunnel to run test, and intercept requests made to localhost:3000 and re-route to the tunnel.
:::

## FAQ

- ** Is using tunnel proxy required?**<br/>
No, If you're running test locally one by one. If you're running test on CI, this can be the simplest way to test.
- ** Is this alternative to preview env?**<br/>
Yes.
- ** Is proxy secure?**<br/>
Proxy is e2e secured by cloudflare argo. If you have business use case, get in touch to learn more. We will add support for private namespace in future
