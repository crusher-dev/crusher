FROM node:lts-alpine3.12

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN apk add --no-cache bash
RUN npm install -g npm@7.0.3

ADD ./ ./app

WORKDIR /app/packages/crusher-app/

RUN npm install

EXPOSE 80

ENTRYPOINT ["npm"]
CMD ["run", "-s", "run:prod"]
