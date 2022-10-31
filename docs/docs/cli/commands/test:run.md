---
title: "test:run"
sidebar_label: "test:run"
slug: "test_run"
---


Run tests in your project

```shell
test:run [options]
```

`crusher-cli test:run` will run the saved tests in your project and display the results.
## Examples

```shell
npx crusher.devtest:run
npx crusher.devtest:run --host staging.test-app.com
npx crusher.devtest:run --browsers chromium,firefox,safari
```

## Options


<table className="reference-table">
  
      <thead>
        <tr>
          <th colSpan="2">
            <h3><a href="#option-browsers" id="option-browsers">
  --browsers
  <span class="option-spec"> =&lt;chromium,firefox,safari&gt;</span>
</a></h3>
          </th>
        </tr>
      </thead>
      <tbody>
        
              <tr>
                <th>Description</th>
                <td><p>List of browsers to run test on (seperated by comma)</p>
</td>
              </tr>
              
      </tbody>
</table>



## Advanced Options


<table className="reference-table">
  
      <thead>
        <tr>
          <th colSpan="2">
            <h3><a href="#option-project-id" id="option-project-id">
  --project-id
  
</a></h3>
          </th>
        </tr>
      </thead>
      <tbody>
        
              <tr>
                <th>Description</th>
                <td><div><p>Specify custom project id where the test will be created</p>
</div></td>
              </tr>
              
      </tbody>
      <thead>
        <tr>
          <th colSpan="2">
            <h3><a href="#option-token" id="option-token">
  --token
  <span class="option-spec"> =&lt;token&gt;</span>
</a></h3>
          </th>
        </tr>
      </thead>
      <tbody>
        
              <tr>
                <th>Description</th>
                <td><div><p>Specify custom user token</p>
</div></td>
              </tr>
              
      </tbody>
</table>


