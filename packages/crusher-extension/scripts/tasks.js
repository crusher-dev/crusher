const { exec } = require("child_process");

async function bundleTemplates(type) {
  const env = type === "build" ? "prod" : type;
  exec(
    `pug -O "{ env: '${env}' }" -o ${type} ./src/ui/templates`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
  console.log("Templates bundled to dev");
}

async function clearDevBuilds(type) {
  exec(`rm -rf  ${type}`);
}

async function createDevBuildIfNotExists(type) {
  exec(`mkdir -p ${type}`);
}

async function copyAssets(type) {
  await createDevBuildIfNotExists(type);
  exec(`cp -R public/* ${type}`);
}

async function watchFolders() {
  // Watch Assets Folder
  exec(
    "npx nodemon --watch ./public scripts/watch/copyAssets.js -e css png svg",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );

  // Watch Templates Folder
  exec(
    "npx nodemon --watch ./src/templates scripts/watch/bundleTemplates.js -e pug",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
}

exports.clearDevBuilds = clearDevBuilds;
exports.createDevBuildIfNotExists = createDevBuildIfNotExists;
exports.copyAssets = copyAssets;
exports.bundleTemplates = bundleTemplates;
exports.watchFolders = watchFolders;
