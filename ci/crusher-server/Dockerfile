FROM node:lts-alpine3.12

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash

RUN apk add git

RUN npm install -g npm

ADD ./ ./server

RUN npm install

WORKDIR /server/packages/crusher-server/

EXPOSE 80

ENTRYPOINT ["npm"]
CMD ["run", "-s", "run:prod"]
