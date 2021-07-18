FROM zenika/alpine-chrome:with-playwright
ENV NPM_CONFIG_PREFIX=/usr/src/app/.npm-global
#RUN apk add  --no-cache ffmpeg
# Only permission for file access is in /usr/src. Find other places
WORKDIR "/usr/src/app/"

RUN npm install -g pm2
RUN npm init -y
RUN npm install dotenv
USER root
RUN touch  /etc/profile.d/node.sh
RUN echo "export PATH=$PATH:$(npm get prefix)/bin" >> /etc/profile.d/node.sh
USER chrome
COPY --chown=chrome ./output packages
RUN rm -rf packages/crusher-app/.next/cache
RUN  cd packages/crusher-app && npm install
RUN npm install -g playwright@^1.7.1 @ffmpeg-installer/ffmpeg https://github.com/crusherdev/playwright-video.git#f7dececde258b07bdec207e4bb6869d389655704
ADD ./ecosystem ecosystem
ADD ./ecosystem.oss.js ecosystem.config.js
ADD ./.env.oss .env

ADD ./docker/oss/start.sh start.sh


CMD ["sh", "start.sh"]
