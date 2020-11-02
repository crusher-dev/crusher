FROM node:lts-alpine3.12

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash

RUN apk add git

ADD ../../packages/crusher-server ./server

WORKDIR /server

RUN yarn install

EXPOSE 80

ENTRYPOINT ["npm"]
CMD ["run", "-s", "run:prod"]
