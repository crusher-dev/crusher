FROM node:12.20.1-alpine3.9

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash

RUN apk add git

RUN npm install -g npm
RUN npm install pm2 -g

ADD ./ ./crusher

WORKDIR /crusher

RUN cd /crusher/packages/crusher-server/bullmq && yarn link && yarn && cd ../ && yarn link "bullmq"

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "test-runner"]
