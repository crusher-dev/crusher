ELECTRON_BUILD="../../output/crusher-electron-app/"
DIST_DIR="../../output/crusher-electron-app-release/linux"

rm -rf "$DIST_DIR" && mkdir -p "$DIST_DIR"
cp -rfT bin/linux $DIST_DIR

# Copy JS binding bundle
mkdir -p $DIST_DIR/resources
cp -rfT "$ELECTRON_BUILD" $DIST_DIR/resources/app

cd $DIST_DIR
# Build distribution
zip --symlinks -r ../crusher-linux.zip ./
