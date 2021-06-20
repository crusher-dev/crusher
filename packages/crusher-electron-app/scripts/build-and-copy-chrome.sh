#echo "Building extension"
cd ../crusher-extension && BACKEND_URL=http://localhost:3000/server/ yarn build

cd ../crusher-electron-app

echo "Moving extension"
rm -rf build/extension
mv  ../crusher-extension/build build/extension