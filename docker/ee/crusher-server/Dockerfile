FROM node:14.15.5-alpine3.11

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash

RUN apk add git

RUN npm install -g npm
RUN npm install pm2 -g
RUN npm install -g webpack


ADD ./ ./crusher

WORKDIR /crusher

RUN cd /crusher/packages/crusher-server/bullmq && yarn link && yarn && cd ../ && yarn link "bullmq"

ARG PORT=8000

EXPOSE $PORT

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "crusher-server"]
