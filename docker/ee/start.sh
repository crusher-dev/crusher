export PATH=$PATH:$(npm get prefix)/bin
node setup/dbMigration.js
pm2-runtime ecosystem.config.js --only "crusher-app,crusher-server,test-runner,video-processor"
