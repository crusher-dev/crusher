FROM node:12.20.1-alpine3.9

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash

RUN apk add git

RUN npm install -g npm
RUN npm install pm2 -g

ADD ./ ./crusher

WORKDIR /crusher

RUN yarn install

ARG PORT=8000

EXPOSE $PORT

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "crusher-server"]
