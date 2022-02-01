node setup/dbMigration.js
pm2-runtime ecosystem.config.js --only "crusher-app,crusher-server,crusher-server-queue,test-runner,video-processor"

tail -f /dev/null