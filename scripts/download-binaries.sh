curl -s https://api.github.com/repos/crusherdev/electron/releases/latest  | grep "celectron.*.zip" | cut -d : -f 2,3 | tr -d \" | wget -qi - -P packages/crusher-electron-app/bin
yarn workspace crusher-electron-app extract:deps