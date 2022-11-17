---
title: Github Commit/PR check
sidebar_label: Github checks
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from "@theme/CodeBlock";


:::note  
This feature is available both in <a href="#in-desktop-app">local app</a> and at app.crusher.dev
:::


### Link your github repo

We require you to link your github repo to your Crusher project,

- Go to Project settings -> Integration
- Click connect in github integration

<img src="https://i.imgur.com/MxcfD6R.png"/>
<br/>

- Select your github repo

### Setup github actions
<Tabs>
  <TabItem value="developers" label="Next.js" attributes={{className: "tab-item"}} default>
  <blockquote style={{padding: "12px 16px", borderRadius: 2, background: "rgba(0, 0, 0, 0.15)"}}>
    <h6>Using vercel deployments?</h6>
    Checkout: <a href="integrations/with-vercel">Integration with Vercel/Netlify</a>
    
  </blockquote>
    <CodeBlock className={"language-yaml"}>{`name: Running tests for Next.js
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      - name: Install node modules
        run: npm i
    
      - name: Build app
        run: npm run build
    
      - name: Run tests
        run: npx crusher.dev test:run --pre-run="npm run start" --token="<crusher_token>"`}
    </CodeBlock>
  </TabItem>
  <TabItem value="starters" label="React" attributes={{className: "tab-item"}}>
    <CodeBlock className={"language-yaml"}>{`name: Running tests for React
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      - name: Install node modules
        run: npm i
 
      - name: Run tests
        run: npx crusher.dev test:run --pre-run="npm run start" --token="<crusher_token>"`}
    </CodeBlock>
  </TabItem>
  <TabItem value="vue.js" label="Vue.js" attributes={{className: "tab-item"}}>
    <CodeBlock className={"language-yaml"}>{`name: Running tests for Vue.js
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      - name: Install node modules
        run: npm i
      
      - name: Build app
        run: npm run build
    
      - name: Run tests
        run: npx crusher.dev test:run --pre-run="npm run serve" --token="<crusher_token>" `}
    </CodeBlock>

  </TabItem>
</Tabs>

1. Copy the above code and paste it in your github actions file. You can find the file in your repo at `.github/workflows/crusher.yml`
2. Replace `<crusher_token>` with your crusher token. You can get it by running `npx crusher.dev token` from your terminal


### Checks on commit & PR

Create a pull request and to see Crusher in action

<img src="https://i.imgur.com/6n75mP1.png" style={{opacity: ".8", borderRadius: 16, marginTop: 20}}/>