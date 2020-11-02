ENV ?= development
DOCKER_HOST := 172.17.0.1

nop:
	@true

build:
	@docker build -t crusher/server -f ci/Dockerfile.${ENV} .

build-prod:
	@docker build -t crusher/prod-server -f ci/Dockerfile .

clean-docker:
	@docker rmi "$(docker images -f 'dangling=true' -q)"

run-prod:
	@docker container run -p 127.0.0.1:8000:80/tcp -it --rm --ipc=host crusher/prod-server
	 /bin/bash

run:
	@docker container run -p 127.0.0.1:8000:8000/tcp --add-host dockerHost:${DOCKER_HOST} -it --rm -v ${PWD}:/server --ipc=host crusher/server
	 /bin/bash

.PHONY: nop build run