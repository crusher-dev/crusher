cp -R ./node_modules/bullmq ./packages/crusher-server/bullmq && cd packages/crusher-server && yarn build && yarn build:cron && yarn build:queue && cd ../../
