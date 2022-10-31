---
title: Integrating Crusher tests with CI/CD
sidebar_label: With CI/CD
---

1.) Go to [_Crusher Settings Page > Integration_](https://app.crusher.dev/settings/project/integrations).

2.) Copy command in CI/CD section.

3.) Build production of your app in Github action.

4.) Setup Crusher proxy to expose your app in production.

5.) Start the server in your app.

`npm run start & [coppied command] && fg`

:::info Info
Integrate with Github to see status checks on commits & pull requests.
:::
