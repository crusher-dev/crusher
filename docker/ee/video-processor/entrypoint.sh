export NODE_PATH=/usr/local/lib/node_modules
pm2 start --only "video-processor"

tail -f /dev/null