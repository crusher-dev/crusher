FROM zenika/alpine-chrome:with-playwright
ENV NPM_CONFIG_PREFIX=/usr/src/app/.npm-global
#RUN apk add  --no-cache ffmpeg
# Only permission for file access is in /usr/src. Find other places

RUN npm install pm2
RUN npm init -y
RUN npm install dotenv
ADD ./ecosystem.oss.js ecosystem.config.js
COPY --chown=chrome ./output packages
RUN rm -rf packages/crusher-app/.next/cache
RUN  cd packages/crusher-app && npm install
ADD ./ecosystem ecosystem

ADD ./docker/oss/start.sh start.sh

WORKDIR "/usr/src/app/"

CMD ["sh", "start.sh"]
