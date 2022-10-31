---
title: Architecture
sidebar_label: Architecture
---

import { Blaze, Fast, Terminal } from '@components/page/index';

<head>
  <title>Create a test - Crusher docs</title>
  <meta name="description" />
</head>

This is an high level overview of crusher, and components. This high level overview helps in grasping how crusher works.

### <Blaze style={{marginRight: 12}}/> Crusher SDK

Crusher SDK is our core, it consists of various function that helps you write test rapidly.

This allows us to created declarative framework to write tests.

For extended functionality, you can use SDK.

We use playwright as our base, and then we apply patches and add custom logic on top of it.

## <Fast style={{marginRight: 12}}/> Low-code Recorder

Crusher recorder is fork of chromium, which helps you in creating test with ease. This is maintained solely by us,
due to technical complexity and constraints.

Low code recorder converts users action into Crusher SDK compaitable code.

## <Terminal style={{marginRight: 12}}/> Test executor

Test executor is responsible for all operations related to your test build. It runs your test and does post processing.

The above components work in tandem to provide high quality testing experience.
