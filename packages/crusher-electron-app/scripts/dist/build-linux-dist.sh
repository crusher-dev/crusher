DIST_DIR="out/linux"

rm -rf out && mkdir out
cp -r base/linux $DIST_DIR

# Copy JS binding bundle
rm -rf $DIST_DIR/dist/resources/*
cp -r build $DIST_DIR/dist/resources
mv $DIST_DIR/dist/resources/build $DIST_DIR/dist/resources/app
cp package.release.json $DIST_DIR/dist/resources/app/package.json

# Build distribution
zip -r out/crusher-linux.zip $DIST_DIR/dist/