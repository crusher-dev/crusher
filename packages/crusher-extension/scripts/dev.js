const createWebpackServer = require("webpack-httpolyglot-server");
const devConfig = require("../webpack/webpack.dev");
const tasks = require("./tasks");
const { exec } = require("child_process");

async function initDevServer() {
  await tasks.clearDevBuilds();
  console.log("[Copy assets]");
  console.log("-".repeat(80));
  await tasks.copyAssets("dev");
  console.log("Assets copied to dev build");
  console.log("-".repeat(80));

  console.log("[Bundle templates]");
  console.log("-".repeat(80));
  await tasks.bundleTemplates("dev");
  console.log("-".repeat(80));
  console.log("==> [Watching assets and templates]");
  console.log("-".repeat(80));
  await tasks.watchFolders();

  console.log("[Webpack Dev]");
  console.log("-".repeat(80));
  console.log("If you're developing Inject page,");
  console.log(
    "please allow `https://localhost:3000` connections in Google Chrome,"
  );
  console.log(
    "and load unpacked extensions with `./dev` folder. (see https://developer.chrome.com/extensions/getstarted#unpacked)\n"
  );

  createWebpackServer(devConfig, {
    host: "localhost",
    port: 2400,
  });

  exec(
    'nodemon --watch src --exec "webpack --config webpack/webpack.content_script.dev.js --watch --progress --profile --colors"',
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

initDevServer();
