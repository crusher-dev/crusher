cd packages/crusher-app && pnpm build && pnpm export && pnpm build:server
rm -rf ../../output/crusher-app/out && mv out ../../output/crusher-app/out

cd ../../

rm -rf output/cruhser-app/.next