ELECTRON_BIN_DIR="packages/crusher-electron-app/bin"
if [ -d "$ELECTRON_BIN_DIR/linux" ] && [ -d "$ELECTRON_BIN_DIR/darwin" ]; then
   echo 'Binaries already extracted. Skipping downloading...'
   exit 0
fi

if [ "$(uname)" == "Darwin" ] && ! [ -x "$(command -v wget)" ]; then
   if ! [ -x "$(command -v brew)" ]; then
      echo '[Error]: Brew and wget not installed. Install them and run this command again...' >&2
      exit 1
   fi
   echo 'wget not installed. Trying to install it now using brew...'
   brew install wget
fi

echo 'Downloading latest binaries...'
curl -s https://api.github.com/repos/crusherdev/electron/releases/latest  | grep "celectron.*.zip" | cut -d : -f 2,3 | tr -d \" | wget -qi - -cP packages/crusher-electron-app/bin --show-progress
npm install -g cross-zip-cli
yarn workspace crusher-electron-app extract:deps
