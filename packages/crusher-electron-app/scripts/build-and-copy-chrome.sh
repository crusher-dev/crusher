#echo "Building extension"
cd ../crusher-extension && yarn build

cd ../crusher-electron-app

echo "Moving extension"
rm -rf build/extension
mv  ../crusher-extension/build build/extension