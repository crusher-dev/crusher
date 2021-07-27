export PATH=$PATH:$(npm get prefix)/bin
pm2-runtime ecosystem.config.js --only "crusher-app,crusher-server,test-runner"
