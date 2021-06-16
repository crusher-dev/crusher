FROM zenika/alpine-chrome:with-playwright
ENV NPM_CONFIG_PREFIX=/usr/src/app/.npm-global

# Only permission for file access is in /usr/src. Find other places

RUN npm install pm2
ADD ./ecosystem.oss.js ecosystem.config.js
RUN mkdir packages && mkdir packages/crusher-app && mkdir packages/crusher-server && mkdir packages/test-runner && mkdir packages/video-processor
ADD ./packages/crusher-app/.next packages/crusher-app/.next
ADD ./packages/crusher-app/.next packages/crusher-app/.next
ADD  ./packages/crusher-app/package.json packages/crusher-app/package.json
RUN cd packages/crusher-app && npm install
ADD ./packages/crusher-app/server.js packages/crusher-app/server.js
ADD ./packages/crusher-server/dist packages/crusher-server/dist
ADD ./packages/test-runner/dist packages/test-runner/dist
ADD ./packages/test-runner/dist packages/test-runner/dist


ADD ./docker/oss/start.sh start.sh

WORKDIR "/usr/src/app/"

CMD ["sh", "start.sh"]
