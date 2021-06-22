FROM node:14.15.5-alpine3.11

MAINTAINER Utkarsh Dixit "utkarsh@crusher.dev"

ADD ./output/crusher-app ./app

WORKDIR /app

RUN yarn && yarn build

CMD ["yarn", "start"]
