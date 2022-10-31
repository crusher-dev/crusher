---
title: 🐳 Docker deploy
sidebar_label: Docker deploy
---

We want to make it super easy for anyone to install Crusher locally. This is the best option if you're looking to try Crusher locally.

:::danger
This is not be stable. We're pretty swamped, this will be updated soon.
:::

#### Requirement
Make sure you've machine with 3 vCPU and 4GB RAM available (minimum).

Recommened - 4 vCPU and 4GB RAM available (minimum).

## Steps to deploy using docker

Before starting, make sure you have [docker](https://docs.docker.com/engine/install/) installed and git installed.

1.) Clone git repo.

```shell
git clone https://github.com/crusherdev/crusher-docker-deploy.git
```

##### With Postgres/Redis

2.) Start the containers.

```shell
docker-compose up
```

##### Without Postgres/Redis

2.) Change `.env` file and the start the container using

```shell
source .env && docker compose -f docker-compose-plain.yml up
```

3.) Wait for all container to spin up, check status with `docker ps`

4.) (Optional) Point crusher config for endpoint.

P.S.- It's not recommended to deploy Crusher in CI as it's stateful application.
