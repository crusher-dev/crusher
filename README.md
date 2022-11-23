<p align="center">
  <p align="center">
  <a href="https://crusher.dev/#gh-light-mode-only">
    <img src="https://i.imgur.com/BRG9MxQ.png" width="140px" alt="Crusher logo" />
  </a>
  <a href="https://crusher.dev/#gh-dark-mode-only">
    <img src="https://i.imgur.com/ncVx1vo.png"  width="140px" alt="Crusher logo" />
  </a>
</p>
</p>




<h3 align="center">Fast all-in-one testing with low-code</h3>
<p align="center">
<img src="https://user-images.githubusercontent.com/6849438/200099357-eaadec7f-8692-42f7-95a4-96b162370c2e.gif"/>
<br/>
  Open-source testing framework to test with minimal effort
</p>



<div align="center">
  <table>
    <tbody>
      <tr>
         <td>
             <a href="https://discord.gg/dHZkSNXQrg">☄️ Try Crusher</a>
        </td>
        <td>
          <a href="https://docs.crusher.dev">⠀ Read docs</a>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
<hr/>


[Crusher](https://crusher.dev) is an all-in-one testing framework. It includes everything w.r.t to e2e testing, with low-code recorder, runner + batteries built-in.

**Create, run and debug tests** with a simple workflow, using **low-code or code**. With Crusher, you can create tests for your web app **in minutes**.

It's an alternative to the traditional workflow of cypress, playwright, selenium, etc. [See more here](https://crusher.dev)

<div>
<h5  align="center"> Show us some love :heart: </h5>
</div>

<div align="center">
  <img src="https://img.shields.io/github/stars/crusherdev/crusher.svg?style=social&label=Star" height="24"/>  
  <img src="https://img.shields.io/github/forks/crusherdev/crusher.svg?style=social&label=Fork" height="24"/>
  <img src="https://img.shields.io/github/watchers/crusherdev/crusher.svg?style=social&label=Watch" height="24"/>
</div>

<br/>

##  Getting started

**☄️Create your first test**

```
npx crusher.dev
```

or [download binary](https://docs.crusher.dev/getting-started/create-your-first-test#or-install-recorder)


**🚖 Run test**

```
npx crusher.dev test:run
```

You can run test locally on your machine to debug. Run it on cloud for faster execution.

Reference/ [Getting Started](https://docs.crusher.dev/getting-started/create-your-first-test#using-cli) | [What is Crusher](https://docs.crusher.dev/getting-started/what-is-crusher) 


## 👨🏽‍💻 Features

Crusher has a lot of features, some of the major ones are
- 👨🏽‍💻 **Test using low-code:** Create tests using our customized recorder based on chromium
- 📇 **Use code files:** Better APIs and more control with playwright APIs
- 🔋 **All major browsers supported:** 
- 👨🏽‍💻 **Built for developers:** Use modern javascript to write tests with simple workflow
- 🔥 **Fast test execution** 
- ⚡ **Blazing Fast:** Built on top of Playwright, Crusher delivers an amazing performance during execution
- 📼 **Easy integration** with your projects
- 🦄 Central **reporting & dashboard**: See how your app is doing overall anytime-anywhere

Crusher works framework on top of playwright. We're focusing on engineering, e2e experience of testing.

## ⏩ Use cases
- **Test e2e user flows:** Never compromise your user experience by testing important end-to-end user flows.
- **Test UI of your project:** Never let a UI change catch you off guard.
- **Run tests locally:** Test specific functionalities of your app easily with a single click.
- **Test with every commit:** Run tests on every commit and add checks on pull requests.
- **Monitor production:** Periodically run tests for your website and get notified if something goes wrong.

## 💡 Philosophy
If you are involved in software development, you are no stranger to things breaking now and then. Sometimes it's because of a small typo/change, and sometimes because of reasons out of your control.

It seems like every time you are changing something, there is a chance of stuff breaking. The worst part is you're lost, and then someone reports the issue in prod.

Testing solves this, but it hasn't evolved. We're changing it by creating an integrated solution that simply works.

## 🧱 Deployment

**Crusher cloud-**  [Start using](https://crusher.dev) | Zero configuration setup
(Recommended: Faster, cheaper and less hassle)

**Self host:** Deploy using Docker or Kubernetes. [Docs](https://docs.crusher.dev/development/docker-deploy-locally)

## FAQs

- **I don't have any prior experience, Can I use Crusher?** Yes, we primarily designed crusher to make testing easy. Most developer have never created test.
- **Low-code ain't powerful? I believe code is more powerful:** Fair enough, you can write code too. We might support other frameworks later on. 
- **Why use this over selenium, cypress, etc?** With any library, you'll have to spend a lot of time setting up testing framework. For us the whole experience was frustrating, from both time and reliability.
- **Why a new framework?** Testing has not evolved. We still have old flaky APIs that don't work.
- **Is crusher using electron?** We need to use chromium to build the recorder and also to run tests locally. We also modify V8 and Blink to make the recorder more powerful.

## Resources
- [Documentation🌱](https://docs.crusher.dev)
- [Getting started](https://docs.crusher.dev/getting-started/create-your-first-test)
- [Developing locally](https://docs.crusher.dev/development/setting-up-development-env)

For general help using Crusher, please refer to [the official documentation](https://docs.crusher.dev).

- [GitHub](https://github.com/crusherdev/crusher) (Bug reports, Contributions)
- support@crusher.dev

### Contribute to Crusher

- Setup crusher locally [Docs](https://docs.crusher.dev/development/setting-up-development-env)
- Found a bug? [File an issue](https://github.com/crusherdev/crusher/issues/new/choose)
- Wanna help. We love pull requests, too!

### License

This repo is entirely MIT licensed, except the **/src_ee directory (if applicable)**.

