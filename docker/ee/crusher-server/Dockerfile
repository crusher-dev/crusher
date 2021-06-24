FROM node:14.15.5-alpine3.11

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash

RUN apk add git

RUN npm install -g npm
RUN npm install pm2 -g
RUN npm install -g webpack

WORKDIR /crusher

ADD ./ecosystem.config.sample.js ecosystem.config.js
ADD ./output/crusher-server/ packages/crusher-server

RUN export CRUSHER_ENV=production

ARG PORT=8000

EXPOSE $PORT

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "crusher-server"]
