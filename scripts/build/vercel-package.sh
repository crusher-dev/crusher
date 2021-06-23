CRUSHER_APP="packages/crusher-app"
OUTPUT="output/crusher-app"

if [ ! -d "$CRUSHER_APP" ]; then
   echo '[Script]: Error: Directory /$CRUSHER_APP DOES NOT exists.\nExiting now...' >&2
   exit 1
fi

if ! [ -x "$(command -v yarn)" ]; then
  echo '[Script]: Error: yarn is not installed.\nExiting now...' >&2
  exit 1
fi

cleanupPreviousBuildsIfThere () {
  if [ -d "$OUTPUT" ]; then
      echo "[Script]: Found previous build"
      echo "[Script]: Deleting now..."
      rm -rf $OUTPUT
  fi
}

runNextBuild () {
  echo "[Script]: Starting next build..."
  PACKAGE_VERCEL=true yarn workspace crusher-app build
}

clearNextBabelCache () {
  if [ -d "$OUTPUT/.next/cache/next-babel-loader" ]; then
      echo "[Script]: Found redundant next-babel-loader caches"
      echo "[Script]: Clearing now..."
      rm -R "$OUTPUT/.next/cache/next-babel-loader"
      mkdir "$OUTPUT/.next/cache/next-babel-loader"
  fi
}

packageNextBuild () {
  yarn workspace crusher-app build
  mv -T "$OUTPUT/.next" "$OUTPUT/build"

  echo "[Script]: Copying public files to ${OUTPUT}/crusher-app"
  cp -R "$CRUSHER_APP/public" "$OUTPUT/public"

  echo "[Script]: Copying some necessary files..."
  cp "$CRUSHER_APP/next.config.js" "$OUTPUT/next.config.js"
  cp "$CRUSHER_APP/next-env.d.ts" "$OUTPUT/next-env.d.ts"
}

overridePackageJSON () {
  tr '\n' ' ' < "$OUTPUT/package.json" > "$OUTPUT/package.new.json"
  rm "$OUTPUT/package.json"
  mv "$OUTPUT/package.new.json" "$OUTPUT/package.json"
  sed  -i -e 's/"scripts": {[^}]*},/"scripts": {"build": "cp build .next", "start": "next start"},/' "$OUTPUT/package.json"
}

cleanupPreviousBuildsIfThere
runNextBuild
clearNextBabelCache
packageNextBuild
overridePackageJSON