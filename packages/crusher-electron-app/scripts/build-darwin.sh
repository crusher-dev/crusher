ELECTRON_BUILD="../../output/crusher-electron-app"
DIST_DIR="../../output/crusher-electron-app-release/darwin"
APP_RESOURCE_DIR=$DIST_DIR/Electron.app/Contents/Resources

mkdir -p ../../output/crusher-electron-app-release

rm -rf "$DIST_DIR"
cp -rf bin/darwin/ $DIST_DIR/

# Copy JS binding bundle
rm -rf "$APP_RESOURCE_DIR/app"
cp -rf "$ELECTRON_BUILD/" $APP_RESOURCE_DIR/app

cd $DIST_DIR
# Build distribution
zip --symlinks -r ../crusher-darwin.zip ./
