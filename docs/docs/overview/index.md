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
import {AccordionDemo} from '@components/global/FAQ/faq.tsx';
import css from '@emotion/react';
<head>
  <title>Crusher Docs</title>
  <meta name="description" content="Crusher.dev" />
  <link rel="canonical" href="https://docs.crusher.dev/" />
  <link rel="alternate" href="https://docs.crusher.dev/" hreflang="x-default" />
  <link rel="alternate" href="https://docs.crusher.dev/" hreflang="en" />
  <meta property="og:url" content="https://docs.crusher.dev/" />
</head>

Crusher is <span className="highlight_cyan">all in one testing framework</span>. It includes everything w.r.t to e2e testing, like test recorder(local app), test runner and web app for you.
We have two goals:- 1.) to make <span className="highlight_cyan">test creation simple</span> and 2.) make testing <span className="highlight_cyan">robust</span> over time.

We use playwright as base + wrapper/patches around it. You can record low-code tests or write in JS code<span className="highlight_red">*</span>. 

<UseCrusher />


<span className="highlight_red">*</span> = Feature coming soon