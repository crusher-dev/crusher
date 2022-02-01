FROM node:16.13.2-alpine3.15

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

WORKDIR /crusher

RUN apk add --no-cache bash

RUN apk add git

RUN npm install -g pm2 webpack @ffmpeg-installer/ffmpeg

RUN npm install dotenv source-map-support

ADD ./ecosystem.config.sample.js ecosystem.config.js
ADD ./.env.sample .env
ADD ./ecosystem ecosystem
ADD ./output/video-processor/ packages/video-processor

ENV CRUSHER_ENV production

ARG PORT=8000

EXPOSE $PORT

ENV FFMPEG_PATH /usr/local/lib/node_modules/@ffmpeg-installer/ffmpeg/node_modules/@ffmpeg-installer/linux-x64/ffmpeg

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "video-processor"]
