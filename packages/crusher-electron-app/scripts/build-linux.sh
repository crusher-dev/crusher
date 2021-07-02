ELECTRON_BUILD="../../output/crusher-electron-app"
DIST_DIR="../../output/crusher-electron-app-release/linux"

mkdir -p ../../output/crusher-electron-app-release

rm -rf "$DIST_DIR"
cp -rf bin/linux/ $DIST_DIR/

# Copy JS binding bundle
rm -rf $DIST_DIR/resources/app/
cp -rf "$ELECTRON_BUILD/" $DIST_DIR/resources/app/

cd $DIST_DIR/

# Build distribution
zip --symlinks -r ../crusher-linux.zip ./