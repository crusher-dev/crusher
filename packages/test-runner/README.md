# Dependecies

Terraform -  brew install terraform

# Running Playwright in Docker


[Dockerfile.bionic](Dockerfile.bionic) is a playwright-ready image of playwright.

This image includes all the dependencies needed to run browsers in a Docker

container.
  

Building image:

  

```

$ sudo docker build -t microsoft/playwright:bionic -f ci/Dockerfile.development .

```

  

Building prod image:

  

```

$ sudo docker build -t microsoft/playwright:bionic -f ci/Dockerfile .

```  

Running image:

  

```

$ sudo docker container run -it --rm -v ${PWD}:/code --ipc=host --security-opt seccomp=chrome.json microsoft/playwright:bionic /bin/bash

```

  

Fish

  

```

$ sudo docker container run --name code_runner -it --rm -v {$PWD}:/code --ipc=host --security-opt seccomp=chrome.json microsoft/playwright:bionic /bin/bash

```

  **NPM install**: Go inside container /code. Run npm install. Binaries are different for host and container.

>  **NOTE**: The seccomp profile is coming from Jessie Frazelle. It's needed

> to run Chrome without sandbox.

> Using `--ipc=host` is also recommended when using Chrome. Without it Chrome can run out of memory and crash.

>  [See the docker documentation for this option here.](https://docs.docker.com/engine/reference/run/#ipc-settings---ipc)

  
