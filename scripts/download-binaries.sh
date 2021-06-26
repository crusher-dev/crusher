ELECTRON_BIN_DIR="packages/crusher-electron-app/bin"
if [ -d "$ELECTRON_BIN_DIR/linux" ] && [ -d "$ELECTRON_BIN_DIR/darwin" ]; then
   echo 'Binaries already extracted. Skipping downloading...'
   exit 0
fi

echo 'Downloading latest binaries...'
curl -s https://api.github.com/repos/crusherdev/electron/releases/latest  | grep "celectron.*.zip" | cut -d : -f 2,3 | tr -d \" | wget -qi - -cP packages/crusher-electron-app/bin
yarn workspace crusher-electron-app extract:deps
