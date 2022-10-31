---
title: Crusher CLI
sidebar_label: 🧑‍🚀 Overview
---

<head>
  <title>Cruhser CLI : Crusher Docs</title>
  <meta name="description" content="Crusher.dev" />
</head>

The Crusher command-line interface ([CLI](/docs/reference/glossary#cli)) is the go-to CLI for developers to create and run test for their project.

You can create test locally and run them on crusher server with few commands.

## Installation

To create a test

```shell
npx crusher.devtest:create
```

And run test with

```shell
npx crusher.devtest:run
```

The Crusher CLI works with node > v10

:::tip
You can also use `npm install crusher-cli` or `yarn add crusher-cli`, but it is not recommeded as we provide continuous updates to improce experience
:::

## Help

To get help just write

```shell
npx crusher.dev --help
npx crusher.dev <command> --help
npx crusher.dev <command> <subcommand> --help
```

<!-- TODO: image? -->

## Architecture

The Crusher CLI is built with [TypeScript](/docs/reference/glossary#typescript) and [Node.js](/docs/reference/glossary#node).

## Troubleshooting

To troubleshoot issues with the Crusher CLI, the following may be useful:

- Make sure the latest version of the Crusher CLI is installed. Get the installed version by running `npx crusher.dev--version`.
- Make sure the latest Node LTS is installed. See [Node & npm](/docs/intro/environment#node-npm) environment setup.
- The crusher cli will require internet connection for saving and running test.
- Crusher cli works with only .git enabled repositories.
- The global Crusher CLI configuration directory is `~/.crusher` on all platforms.
