FROM node:14.15.5-alpine3.11

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

WORKDIR /crusher

RUN apk add --no-cache bash

RUN apk add git

RUN npm install -g npm pm2 webpack
RUN npm init -y

RUN npm install dotenv source-map-support

ADD ./ecosystem.config.sample.js ecosystem.config.js
ADD ./.env.sample .env
ADD ./ecosystem ecosystem
ADD ./output/crusher-server/ packages/crusher-server

RUN export CRUSHER_ENV=production

ARG PORT=8000

EXPOSE $PORT

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "crusher-server"]
