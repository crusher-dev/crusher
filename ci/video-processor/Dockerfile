FROM node:lts-alpine3.12

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash
RUN apk add git

ADD ./ ./video-processor

WORKDIR /video-processor

RUN yarn install

EXPOSE 80

ENTRYPOINT ["npm"]
CMD ["run", "-s", "start"]