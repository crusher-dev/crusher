ENV ?= development
DOCKER_HOST := 172.17.0.1

nop:
	@true

build:
	@docker build -t microsoft/playwright:bionic -f ci/Dockerfile.${ENV} .

clean-docker:
	@docker rmi "$(docker images -f 'dangling=true' -q)"

run:
	@docker container run -p 127.0.0.1:3000:3000/tcp --add-host mysql:${DOCKER_HOST} -it --rm -v ${PWD}:/code --ipc=host --security-opt seccomp=chrome.json microsoft/playwright:bionic /bin/bash

.PHONY: nop build run