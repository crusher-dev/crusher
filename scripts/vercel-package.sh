CRUSHER_APP="packages/crusher-app"
OUTPUT="output"

if [ ! -d "$CRUSHER_APP" ]; then
   echo '[Script]: Error: Directory /$CRUSHER_APP DOES NOT exists.\nExiting now...' >&2
   exit 1
fi

if ! [ -x "$(command -v yarn)" ]; then
  echo '[Script]: Error: yarn is not installed.\nExiting now...' >&2
  exit 1
fi

cleanupPreviousNextBuildsIfThere () {
  if [ -d "$CRUSHER_APP/.next" ]; then
      echo "[Script]: Found previous next build caches"
      echo "[Script]: Deleting now..."
  fi
}

runNextBuild () {
  echo "[Script]: Starting next build..."
  yarn workspace crusher-app build
}

clearNextBabelCache () {
  if [ -d "$CRUSHER_APP/.next/cache/next-babel-loader" ]; then
      echo "[Script]: Found redundant next-babel-loader caches"
      echo "[Script]: Clearing now..."
      rm -R "$CRUSHER_APP/.next/cache/next-babel-loader"
      mkdir "$CRUSHER_APP/.next/cache/next-babel-loader"
  fi
}

packageNextBuild () {
  if [ ! -d "$OUTPUT" ]; then
    echo "[Script]: Creating ${OUTPUT} now..."
    mkdir -p "$OUTPUT"
  fi

  if [ -d "$OUTPUT/crusher-app" ]; then
   rm -R "$OUTPUT/crusher-app"
  fi

  mkdir "$OUTPUT/crusher-app"

  echo "[Script]: Moving next build folder to ${OUTPUT}/crusher-app"
  mv "$CRUSHER_APP/.next" "$OUTPUT/crusher-app/build"

  echo "[Script]: Copying public files to ${OUTPUT}/crusher-app"
  cp -R "$CRUSHER_APP/public" "$OUTPUT/crusher-app/public"

  echo "[Script]: Copying some necessary files..."
  cp "$CRUSHER_APP/next.config.js" "$OUTPUT/crusher-app/next.config.js"
  cp "$CRUSHER_APP/next-env.d.ts" "$OUTPUT/crusher-app/next-env.d.ts"
  cp "$CRUSHER_APP/package.json" "$OUTPUT/crusher-app/package.json"
}

overridePackageJSON () {
  tr '\n' ' ' < "$OUTPUT/crusher-app/package.json" > "$OUTPUT/crusher-app/package.new.json"
  rm "$OUTPUT/crusher-app/package.json"
  mv "$OUTPUT/crusher-app/package.new.json" "$OUTPUT/crusher-app/package.json"
  sed  -i -e 's/"scripts": {[^}]*},/"scripts": {"build": "cp -R build .next", "start": "next start"},/' "$OUTPUT/crusher-app/package.json"
}

cleanupPreviousNextBuildsIfThere
runNextBuild
clearNextBabelCache
packageNextBuild
overridePackageJSON
