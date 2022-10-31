---
title: Developing locally
sidebar_label: Developing locally
---

Crusher is integrated system based on javascript environment. We've made it very simple to contribute and fix a bugs

### Prerequisites

Make sure you've `node > 14` installed. We use monorepo structure and use typescript for static typing.

We also use two data services

| Service  | Use                | How to install?                                                           |
| -------- | ------------------ | ------------------------------------------------------------------------- |
| Redis    | For cache & queues | [Guide](https://redis.io/docs/getting-started/installation/)              |
| Postgres | As main database   | [Guide](https://gist.github.com/15Dkatz/321e83c4bdd7b78c36884ce92db26d38) |

**Note**: Crusher only support linux (ubuntu majorly) and MacOS as of now for development

### Set up local environment

<h6>1) Clone the repo</h6>

```shell
git clone https://github.com/crusherdev/crusher.git
```

<h6 style={{ display: 'flex', alignItems: 'center' }}>
  <span>2) Install packages</span>
  <div style={{ marginLeft: 'auto', fontSize: '0.7em' }}>Estimated time: 3 mins</div>
</h6>

```shell
pnpm install
pnpm setup:ee
```

There are two ways you can initialize your project, depending on which edition you want to work on:

- `pnpm setup:oss` will initialize the project for OSS edition
- `pnpm setup:ee` will initialize the project for EE edition

<h6>3) Configure Environment Variables</h6>

```shell
nano .env
```

We store environment variables in `.env` file. Just configure three values to get started

```
DB_CONNECTION_STRING=postgresql://user:secret@localhost
DISABLE_POSTGRES_SSL=true
REDIS_CONNECTION_STRING=redis://localhost:6379
```

See [Environment Variables](#environment-variables), if you want to know about all the environmental variables available for configuration.

<h6>4) Run DB migrations</h6>

```shell
pnpm db:migration
```

This will bootstrap db from `db/schema.sql` or run any pending migrations.

<h6>5) Start all the services</h6>

```shell
pm2 start
```

Go ahead and try to open [http://localhost:3000](`http://localhost:3000`). If you see the login screen and authentication is working fine, you have successfully set up crusher on your system 🚀

To check the status you can use following commands to see status, see logs and kill all services.

```shell
pm2 status
pm2 logs -f service_name
pm2 stop
```

### Supported OS

The source code has been built and tested on **Ubuntu** and **macOS**. We haven't tested the building source code on other systems, so if you encounter any issues Set up for a different OS, feel free to file an issue for it.

:::tip
If you don't want to do all the setup chores, you can click on `Open in Gitpod` inside _README.md_ and use gitpod for development.
:::
