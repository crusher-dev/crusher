cd packages/crusher-app && yarn build && yarn export && yarn build:server
rm -rf ../../output/crusher-app/out && mv out ../../output/crusher-app/out

cd ../../

rm -rf output/cruhser-app/.next