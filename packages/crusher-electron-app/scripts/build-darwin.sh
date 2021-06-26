ELECTRON_BUILD="../../output/crusher-electron-app/"
DIST_DIR="../../output/crusher-electron-app-release/darwin"

rm -rf "$DIST_DIR" && mkdir -p "$DIST_DIR"
cp -rfT bin/darwin $DIST_DIR

# Copy JS binding bundle
mkdir -p $DIST_DIR/Electron.app/Contents/Resources/
cp -rfT "$ELECTRON_BUILD" $DIST_DIR/Electron.app/Contents/Resources/app

cd $DIST_DIR
# Build distribution
tar -cvzf ../crusher-darwin.tar.gz ./
