FROM zenika/alpine-chrome:with-playwright
ENV NPM_CONFIG_PREFIX=/usr/src/app/.npm-global
#RUN apk add  --no-cache ffmpeg
# Only permission for file access is in /usr/src. Find other places
WORKDIR "/usr/src/app/"

USER root
# Workaround to enable bash in heroku
RUN apk add --no-cache bash && rm /bin/sh && ln -s /bin/bash /bin/sh
# For heroku release phase
RUN apk add curl
RUN touch  /etc/profile.d/node.sh
USER chrome

RUN printf "export PATH=$PATH:$(npm get prefix)/bin\nexport NODE_OPTIONS=--enable-source-maps" >> ~/.profile
RUN npm init -y && npm install dotenv mysql2 && npm install -g pm2 playwright@^1.7.1

COPY --chown=chrome ./output packages
RUN rm -rf packages/crusher-app/.next/cache && cd packages/crusher-app && npm install

ADD ./ecosystem ecosystem
ADD ./ecosystem.oss.js ecosystem.config.js
ADD ./.env.oss .env
ADD ./db/schema.sql db/schema.sql
ADD ./setup/dbMigration.js scripts/dbMigration.js

ADD ./docker/oss/start.sh start.sh


CMD ["sh", "start.sh"]
