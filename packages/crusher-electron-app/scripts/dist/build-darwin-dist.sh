DIST_DIR="out/darwin/dist"

rm -rf darwin && mkdir darwin
cp -r base/darwin $DIST_DIR

# Copy JS binding bundle
rm -rf $DIST_DIR/Electron.app/Contents/Resources/app/*
cp -r build $DIST_DIR/Electron.app/Contents/Resources/
mv $DIST_DIR/Electron.app/Contents/Resources/build $DIST_DIR/Electron.app/Contents/Resources/app
cp package.release.json $DIST_DIR/Electron.app/Contents/Resources/app/package.json

# Build distribution
zip -r out/crusher-darwin.zip $DIST_DIR