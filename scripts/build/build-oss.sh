NEXT_PUBLIC_BACKEND_URL=https://my-test-world.herokuapp.com/server/ NEXT_PUBLIC_FRONTEND_URL=https://my-test-world.herokuapp.com/ sh scripts/build/build-app.sh &
sh scripts/build/build-crusher-server.sh &
sh scripts/build/build-test-runner.sh &
wait