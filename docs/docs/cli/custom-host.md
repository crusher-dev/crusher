---
title: Run with custom host
sidebar_label: Run tests with a custom host
---

:::note What you'll learn?

1. How to run tests with a different host with CLI?
2. Set up monitoring with different hosts/environments
:::
   Testing workflow is not always limited to running tests for one domain/host. Depending on your use case, you may want to run your tests for,

- Staging/testing environment
- Instant environment
- Local development

With crusher, you can easily do all this in minutes

## Prerequisites

- **Crusher CLI**: If you haven't already setup your project using crusher-cli, don't worry it's super easy. [Check out this doc](using-cli-in-project)
- Some tests to run 🤓

## Using `--host` flag

```shell
npx crusher.devtest:run --host https://custom.host.com
```

:::tip 🦖 &nbsp;&nbsp;Usecases

1. &nbsp; Running tests for instant/test/stage environments
2. &nbsp; Running tests for your local development
   :::

## Setup monitoring with different environments

Another use-case that you might be looking out for, is Set up monitoring or periodic test runs for your different environments.

:::tip 🦖 &nbsp;&nbsp;Usecases

1. Make sure your production is 100% working at any time
   :::

### Creating environment

:::note
If you have already created an environment in your project, you can skip this section and move on to the next one.
:::

<ol style={{ marginTop: '14px' }}>
  <li>
    Go to <b>Settings > Environments</b>
  </li>
  <li>
    Click on "Add Environment" and fill out the form
    <ul>
      <li>
        <b>Name of the env</b>: Provide a name for your environment, e.g Testing, Staging, Production, etc,.
      </li>
      <li>
        <b>Browsers</b>: Specify on what browsers you want to run the tests for this particular environment. Supported
        browsers are: Chrome, Safari, and Firefox.
      </li>
      <li>
        <b>Host</b>: Provide a host URL for your environment, e.g https://stage.your-domain.com
      </li>
      <li>
        <b>Variables</b>: Set environment variables for your environment that your tests can use. Checkout Context &
        Variables doc for more details
      </li>
    </ul>
  </li>
  <li>Click on Save</li>
</ol>
All done! Now the only thing remaining is to setup monitoring for your environment

### Set up monitoring

To setup monitoring:

<ol style={{ marginTop: '14px' }}>
  <li>
    Go to <b>Settings > Monitoring</b>
  </li>
  <li>
    Click on "Add Environment" and fill out the form
    <ul>
      <li>
        <b>Environment</b>: Select the environment you want to setup monitoring for from the dropdown
      </li>
      <li>
        <b>Run interval</b>: Specify what should be the interval for monitoring in seconds. Tests will be triggered
        every specified x seconds for your environment.
      </li>
    </ul>
  </li>
  <li>Click on Save</li>
</ol>

Voila! Now just wait for a minute for your monitoring to trigger for the first time 🚀
