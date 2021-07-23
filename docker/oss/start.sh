export PATH=$PATH:$(npm get prefix)/bin
pm2-runtime ecosystem.config.js --only "crusher-app,crusher-server,crusher-server-cron,crusher-server-queue,test-runner"
while true; do sleep 1000; done