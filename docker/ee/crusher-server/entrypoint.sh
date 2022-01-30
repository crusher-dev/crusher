node setup/dbMigration.js
pm2-runtime ecosystem.config.js --only "crusher-server, crusher-server-queue"

tail -f /dev/null