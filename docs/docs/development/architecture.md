---
title: Architecture
sidebar_label: Architecture
---

Crusher is all-in-one solutionm it replace many tools in testing workflow. We're opinionated and building features to make e2e workflow easy.

At top level, it has 3 component

- <span className="highlight_green">Crusher app</span> - local app to record and run tests in project

-  <span className="highlight_green">Test executor</span> - running test across web browser using configuration

-  <span className="highlight_green">Web app</span> -  to manager test, viewing report, share it in team.

### Architecture

<a href="/img/architecture/high-level-architecture.svg" target="_blank">
  <img src="/img/architecture/high-level-architecture.svg" style={{borderRadius: 4}} />
</a>

### High level section
- **Frontend** - React (using Nextjs), Jotai, SWR, Tailwind + emotion.
- **Backend** - Express, typescript, routing controller, typedi, Prisma.
- **Test runner & Worker**
- **Crusher recorder** - Electron, V8, Blink, C++, react, redux. This is not completely open source.

There are also dependencies like bullmq (for job management), postgres, etc.

### Codebase
We use monorepo architecture + typescript for shared type checking across packages. We strive to use typescript 100% but might often bypass it with any to develop fast.
