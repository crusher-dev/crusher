---
title: Introduction
sidebar_label: Introduction
slug: /
image: /img/meta/open-graph.png
hide_table_of_contents: false
---

import DocsCard from '@components/global/DocsCard';
import DocsCards from '@components/global/DocsCards';
import CrusherFeatures from '@components/page/index';
import { UseCrusher } from '../__components/list.tsx';
import { AccordionDemo } from '@components/global/FAQ/faq.tsx';
import css from '@emotion/react';
<head>
  <title>Crusher Docs</title>
  <meta name="description" content="Crusher.dev" />
  <link rel="canonical" href="https://docs.crusher.dev/" />
  <link rel="alternate" href="https://docs.crusher.dev/" hreflang="x-default" />
  <link rel="alternate" href="https://docs.crusher.dev/" hreflang="en" />
  <meta property="og:url" content="https://docs.crusher.dev/" />
</head>;

Crusher is <span className="highlight_cyan">all in one testing framework</span>. It includes everything w.r.t to better e2e testing experience, like test recorder(local app), test runner and web app for you.

<br />

We're owning e2e testing toolchain, building framework for:-

- <span className="highlight_cyan"> Delightful effortless</span> test experience{' '}
- Making testing <span className="highlight_cyan">robust</span> and collborative

<p style={{ marginTop: 32 }}>
  Crusher is built on top of playwright, an open source by library Microsoft.
  <br /> Start by recording <span className="highlight_green">low-code</span> test or write in <span className="highlight_green">
    native JS code
  </span>
  <span className="highlight_red">*</span>.
</p>

<UseCrusher />

<span className="highlight_red">*</span> = Feature coming soon
