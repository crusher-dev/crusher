
![enter image description here](https://i.imgur.com/pMMNokt.png)    
    
<p align="center">    
    <a href="https://github.com/badges/shields/graphs/contributors" alt="Contributors">    
        <img src="https://img.shields.io/badge/license-MIT-%23373737?style=flat-square&color=ff3db6" /></a>    
    <a href="#backers" alt="Backers on Open Collective">    
        <img src="https://img.shields.io/badge/node-%3E=%2014.0.0-brightgreen?style=flat-square" /></a>    
            <a href="#backers" alt="Backers on Open Collective">    
        <img src="https://img.shields.io/github/last-commit/crusherdev/crusher?color=8e3dff&style=flat-square" /></a>    
                    <a href="#backers" alt="Backers on Open Collective">    
                <img src="https://img.shields.io/docker/image-size/7296823551/test?style=flat-square" /></a>    
                                    <a href="#backers" alt="Backers on Open Collective">    
                                <img src="https://img.shields.io/npm/types/typescript?style=flat-square" /></a>    
</p>    
    
Crusher is **no-code e2e web testing/monitoring** built for devs  a.k.a *selenium on steroids*.    
  
Integrate **user flow and visual regression** without managing infra, creating a framework or managing breaking selectors.     
    
     
> Dev has evolved a lot in last decades, testing not so much, our goal is to help dev ship HQ software. We started this because we were genuinely frustrated from current worflows. Read more about philosophy.  
    
## 😀 Start using  
  
**One click deploy (self-host)**  
  
  
<img src="https://images.prismic.io/www-static/3c99429b-3cb5-43d6-91e5-c0f686e3e6ab_do-btn-blue+%281%29.png?auto=compress,format" height="32px"/>    
    
  
   
**Start with crusher cloud for free**    
 Faster and powerful way to try Crusher. Click to get started.    
  
<img src="https://i.imgur.com/BUYY8Jp.png" height="50px"/>    
  
## 🔮 Features  
  
- Create test without writing code. We track basic action by creating a fork of chromium.  
- Test UI and compare pixel perfect with last version  
- Replay user flows within test.    
- Latest chromium support.  
- Auto-hover detection functionality.  
- Detailed reports with video and e2e repors (coming soon)  
- Scheduled monitoring (EE feature)  
- Github integration and Alerting (EE feature)    
- All browser + different browser version(EE feature).  
- Super easy deploy using Docker or Heroku.  
- Host it on your infra or Crusher cloud.  
  
We're still early and need to do lot of things to make this a end to end platform. We you need any feature, please file it in github issues.  
  
## 📹 Demo  
  
**Creating a test**  
  
<a target="_blank" href="https://www.loom.com/share/b8a0f8f1b4b74661a9b5efb7ad66d033">  
<img  src="https://cdn.loom.com/sessions/thumbnails/b8a0f8f1b4b74661a9b5efb7ad66d033-with-play.gif" width="100%"> </a>  
    
**Running a test**   
<a target="_blank" href="https://www.loom.com/share/b8a0f8f1b4b74661a9b5efb7ad66d033">  
<img  src="https://cdn.loom.com/sessions/thumbnails/b8a0f8f1b4b74661a9b5efb7ad66d033-with-play.gif" width="100%"> </a>  
    
## 💡 Philosophy  
  Web is becoming more and more complex everyday, we have dozens of API and infra items.     
  
Due to nature of complexity it'll be hard to avoid bugs/issues, but we should know where, when and how's it breaking.  
  
## 😎 What's so cool about this   
 As devs, we work hard to build software.  Although, in the process some tasks are boring, hard and eat up our energy.  
    
We call it noise, it can be UX or workflow noise. At first we reimagine existing workflow and then UX . At the end, we're creating better software for people who create software.    
    
We want to be a platform, solving boring dev tasks and hence improving workflow. We take inspiration from Figma, Linear and Loom on software they create.    
    
For us it's both about how it looks and feels, which is often missing in SaaS. Also, We're open source for individual use and source available at large scale.    
  
Note :- Major FE revamp is underway for ^.  
    
## 🛣️ Roadmap   
 Check about roadmap plan here.    
    
## 🧱 Self deployment   
    
| **Infra provider** | **One-click link** | **Additional information** |  
|:------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------:|  
| Heroku | [<img src="https://www.herokucdn.com/deploy/button.svg" height="32px"/>](https://heroku.com/deploy?template=https://github.com/crusherdev/crusher) | [docs](https://hasura.io/docs/latest/graphql/core/guides/deployment/heroku-one-click.html) |  
| DigitalOcean | [![Deploy to DigitalOcean](https://graphql-engine-cdn.hasura.io/img/create_hasura_droplet_200px.png)](https://marketplace.digitalocean.com/apps/hasura?action=deploy&refcode=c4d9092d2c48&utm_source=hasura&utm_campaign=readme) | [docs](https://hasura.io/docs/latest/graphql/core/guides/deployment/digital-ocean-one-click.html#hasura-graphql-engine-digitalocean-one-click-app) |  
  
 Check guide for other deployments.

## **Docker**

**Official container**  [![hoppscotch/hoppscotch](https://camo.githubusercontent.com/7da6a7dee142c66d3acf19e5db9232f5edc6dd95f997ddd9038fb356f2415a0d/68747470733a2f2f696d672e736869656c64732e696f2f646f636b65722f70756c6c732f686f707073636f7463682f686f707073636f7463683f7374796c653d736f6369616c)](https://hub.docker.com/r/hoppscotch/hoppscotch)

docker run --rm --name hoppscotch -p 3000:3000 7296823551/test:latest

### 👨‍👩‍👧‍👦 **Contributing**
<hr/>

Check out our  [contributing guide](https://github.com/hasura/graphql-engine/blob/master/CONTRIBUTING.md)  for more details.

### 📝 License  
<hr/>    
    
This repo is entirely MIT licensed, with the exception of the **/src_ee directory (if applicable). This to ensure we get fairely rewarded for work done.    
    
Premium features (contained in the src_ee directory) require a Crusher license. Contact us at sales@crusher.dev for more information.    
    
### 📫 Support & Troubleshooting  
<hr/>    
   

The documentation and community will help you troubleshoot most issues. If you have encountered a bug or need to get in touch with us, you can contact us using one of the following channels:

-   Support & feedback:  [Discord](https://discord.gg/hasura)
-   Issue & bug tracking:  [GitHub issues](https://github.com/hasura/graphql-engine/issues)
-   Follow product updates:  [@HasuraHQ](https://twitter.com/hasurahq)
-   Talk to us on our  [website chat](https://hasura.io/)

If you want to report a security issue, please  [read this](https://github.com/hasura/graphql-engine/blob/master/SECURITY.md).
  
### 📝 License  
<hr/>    
    
This repo is entirely MIT licensed, with the exception of the **/src_ee directory (if applicable). This to ensure we get fairely rewarded for work done.    
    
Premium features (contained in the src_ee directory) require a Crusher license. Contact us at sales@crusher.dev for more information.    
    
### 🤝 Contributors  
<hr/>    
<p float="left">  
  
<img src="https://avatars.githubusercontent.com/u/6849438?v=4" height="56" style="margin: 4px;"/> &nbsp;<img src="https://avatars.githubusercontent.com/u/16796008?v=4" height="56" style="margin: 4px;"/> &nbsp;<img src="https://avatars.githubusercontent.com/u/51117080?v=4" height="56" style="margin: 4px;"/>  
</p>