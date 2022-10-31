---
title: Running test locally - Proxy
sidebar_label: Running test locally
---

<head>
  <title>Cruhser CLI : Crusher Docs</title>
  <meta name="description" content="Crusher.dev" />
</head>

The Crusher works on server-client architecture. The tests are run on server, which allows us to run them fast and easily.

When developing locally, your project or website might not be accessible from outside network. We need to make it publicly accessible while running the tests.

For this we need to use create a tunnel to our local port. This can be done in many ways.

## 1.) Use Crusher to create a tunnel.

We use cloudflare tunnel to create proxy for you and replace the url while running the tests.
Open .crusher/config.json file and add the following to the `proxy` array.

```json
  "proxy": [{
  "name": 'React localhost'
  "url": "http://localhost:3001"
}]
```

Pros:-

- No need to create an account on cloudflare.

## 2.) Use ngrok or custom tunnel

Using crusher tunnel is easiest way to run test locally. For more control, you can use ngrok, cloudflare argo tunnel, etc.

Cloudflare argo tunnel are the fastest option, we recommend to use it. Make sure tunnel are working correctly before running the tests.

While running the tests, you can use proxy option or set env variable and run the tests with

`crusher-cli test:run --disable-tunnel`

Pros:-

- More control over domain name, etc.

:::tip
If you're using build time configuration, make sure to update it before running the tests.
For example: Your react app might be using backend which is not accessible from outside network.
:::
