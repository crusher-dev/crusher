const { exec } = require("child_process");
const tasks = require("./tasks");

(async () => {
  console.log("[Copy assets]");
  console.log("-".repeat(80));
  await tasks.copyAssets("build");
  console.log("Assets copied to dev build");
  console.log("-".repeat(80));

  console.log("[Bundle templates]");
  console.log("-".repeat(80));
  await tasks.bundleTemplates("build");
  console.log("-".repeat(80));

  console.log("[Webpack Build]");
  console.log("-".repeat(80));
  exec(
    "webpack --config webpack/webpack.js --progress --profile --colors",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );

  exec(
    "webpack --config webpack/webpack.content_script.js --progress --profile --colors",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
})();
