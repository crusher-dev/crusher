---
title: Using CLI within Project
---

<head>
  <title>Basic usage | Maintain a Global Configuration File</title>
  <meta name="description" content="Crusher.dev" />
</head>

When running crusher-cli for the first time, we need to link your project. You can choose to create a new project or set it up with an existing project.

Crusher seamlessly integrates with git-enabled projects.

## Set up

To get started, the first thing you need to do is initialize and link your project with crusher. To do that, go to your project directory and run this command,

```shell
npx crusher.devinit
```

Running this command will start the following process,

- You&#39;ll be asked to log in/sign up to link your crusher account
- CLI will download and extract the latest version of the recorder
- If you run this command in a non-git directory/project, you&#39;ll be asked to select a project.

:::note **Note**:
During the setup, we will save configuration files at `~/.crusher/config.json` (global config) and `[project-dir]/.crusher/config.json` (project config)
:::

## Creating a test

```shell
npx crusher.devtest:create
```

This will open up the recorder where you can start recording your test. When you are done click on &quot;Verify &amp; Save&quot;.
:::tip **Recommended**:
If it&#39;s your first time with the recorder, try and finish the recorder onboarding to get an idea of everything crusher has to offer.
:::

To know more about this command, [check out this doc](https://docs.crusher.dev/cli/commands#testCreate).

## Running tests

```shell
npx crusher.devtest:run
```

This will run all the tests present in your project and return the results after they are finished. This will be how it&#39;ll look,

To know more about this command, [check this out](https://docs.crusher.dev/cli/commands#testRun).

## Get info about the authenticated user

```shell
npx crusher.devwhoami
```

If you ever forget which account you are connected to, you can run this command to find out your identity 🤔

## Get Info about crusher project

```shell
npx crusher.devinfo
```

This command will return crusher project info if you are inside a project connected to the crusher.

## Logout

```shell
npx crusher.devlogout
```

To log out, simply run this command.
