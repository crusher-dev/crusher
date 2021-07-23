NEXT_PUBLIC_BACKEND_URL=https://crusher-server-1.herokuapp.com/server NEXT_PUBLIC_FRONTEND_URL=https://crusher-server-1.herokuapp.com/ sh scripts/build/build-app.sh &
sh scripts/build/build-crusher-server.sh &
sh scripts/build/build-test-runner.sh &
wait