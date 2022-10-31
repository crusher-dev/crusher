---
title: Global options
---

<head>
  <title>Basic usage | Maintain a Global Configuration File</title>
  <meta name="description" content="Crusher.dev" />
</head>

When running crusher-cli for the first time, we need to link your project. You can choose to create a new project, or setup existing project.

Crusher seamlessly integrates with git enabled project.

During setup, we create configuration files at `~/.crusher/config.json` and `[project-dir]/.crusher/app.json`

### Setup new crusher project

```shell
npx crusher.devinit
```

It'll create a new project and create config files. We use origin in .git to identify the project. You can use same command to reinit the project.

:::note
If project is not appearing, select a new project.
:::
