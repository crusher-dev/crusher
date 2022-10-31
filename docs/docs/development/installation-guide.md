---
title: Set up crusher for development
sidebar_label: Installation Guide
---

:::tip
If you don't want to do all the setup chores, you can click on `Open in Gitpod` inside _README.md_ and use gitpod for development.
:::
This guide will go through everything you need to do in order to setup crusher project for development in your system.

### Prerequisites

:::info
Once done, keep a note of your Redis and Postgres credentials. You'll need it when Set up environment variables for the crusher.
:::
There are only two things that you need to begin with the setup,

<ol style={{ marginTop: '14px' }}>
  <li>
    <b>Redis server</b>: You can follow the instructions on{' '}
    <a href="https://redis.io/docs/getting-started/installation/">
      https://redis.io/docs/getting-started/installation/
    </a>{' '}
    to install Redis for your OS.
  </li>
  <li>
    <b>Postgresql</b>: You can use the instructions on this gist to install postgres,{' '}
    <a href="https://gist.github.com/15Dkatz/321e83c4bdd7b78c36884ce92db26d38">
      https://gist.github.com/15Dkatz/321e83c4bdd7b78c36884ce92db26d38
    </a>
    .
  </li>
  <li>
    <b>Node.js > v12.0.0</b>
  </li>
</ol>

### Supported OS

The source code has been built and tested on **Ubuntu** and **macOS**. We haven't tested the building source code on other systems, so if you encounter any issues Set up for a different OS, feel free to file an issue for it.

### Set up

To get started, follow the steps below:

1. **Install node_modules and initialize the project**

```shell
yarn install
yarn setup:ee
```

The first step is to install all the project dependencies and initialize the project. There are two ways you can initialize your project, depending on which edition you want to work on:

- `yarn setup:oss` will initialize the project for OSS edition
- `yarn setup:ee` will initialize the project for EE edition

2. **Configure Environment Variables**

```shell
vi .env
```

We store all the environment variables in `.env` file, which is created if it doesn't exist when you are initializing the project. You only need to configure the below three values, to get started

```
DB_CONNECTION_STRING=postgresql://user:secret@localhost
DISABLE_POSTGRES_SSL=true
REDIS_CONNECTION_STRING=redis://localhost:6379
```

See [Environment Variables](#environment-variables), if you want to know about all the environmental variables available for configuration.

3. **Run DB migrations**

```shell
yarn db:migration
```

This will initialize all the tables in the newly created Postgres database from `db/schema.sql`

4. **Start all the services**

```shell
pm2 start
```

Go ahead and try to open [http://localhost:3000](`http://localhost:3000`). If you see the login screen and authentication is working fine, you have successfully set up crusher on your system 🚀
