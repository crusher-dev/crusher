sh scripts/vercel-package.sh &
sh scripts/build-crusher-server.sh &
sh scripts/build-test-runner.sh &
sh scripts/build-video-processor.sh &
wait