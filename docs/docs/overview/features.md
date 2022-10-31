---
title: Crusher features
sidebar_label: Features
---


import TabItem from '@theme/TabItem';
import {css} from '@emotion/react';
import "../../src/styles/components/feature.scss"

export const FeatureItem = ({label, feature, ...props}) => {
  return (
    <div className={'feature-item'} {...props} style={{flex: 1}}>
  <span className="bold highlight_white label">{label}</span> <span className="feature-description"> {feature}</span>
  </div>);
}


<head>
  <title>Create a test - Crusher docs</title>
  <meta name="description" />
</head>


### Creating tests
<div style={{display: "flex"}}>
<FeatureItem style={{flex: 1}} label="🧑‍🚀 Low-code" feature="Create tests using low-code"/>

<FeatureItem style={{flex: 1}} label="📁 Test files"/>
</div>
<div style={{display: "flex"}}>
  <FeatureItem style={{flex: 1}} label="👨🏽‍💻 Developer first" feature=""/>
  <FeatureItem style={{flex: 1}} label="🕹️ Major primitive actions supported" feature=""/>
</div>
<div style={{display: "flex"}}>
  <FeatureItem style={{flex: 1}} label="📇 Git integration" feature=""/>

  <FeatureItem style={{flex: 1}} label="🤾‍♀️ Debug tests" feature=""/>
</div>


### Running tests
<div style={{display: "flex"}}>
  <FeatureItem label="🌐 Cross-browser" feature="Works across browsers + version."/>

  <FeatureItem label="📁 Cross-platform" feature=""/>
</div>
<div style={{display: "flex"}}>
<FeatureItem label="📁 ES6 syntax support" feature=""/>

<FeatureItem label="🗜️ Resilient tests" feature=""/>
</div>
<div style={{display: "flex"}}>
<FeatureItem label="🧱 Auto element selector" feature=""/>

<FeatureItem label="🏃‍♂️ Parallelism" feature=""/>
</div>


<div style={{display: "flex"}}>

<FeatureItem label="Local test execution/CI supported" feature=""/>

<FeatureItem label="⏩ Debug tests" feature=""/>
</div>


### Management
<div style={{display: "flex"}}>
<FeatureItem label="🗄️ Test management" feature=""/>
<FeatureItem label="🕰️ Monitoring" feature=""/>
</div>
<div style={{display: "flex"}}>



<FeatureItem label="⏰ Alerts" feature=""/>
<FeatureItem label="📼 Test recordings" feature=""/>
</div>
<div style={{display: "flex"}}>

<FeatureItem label="📤 Shareable reports" feature=""/>
</div>

