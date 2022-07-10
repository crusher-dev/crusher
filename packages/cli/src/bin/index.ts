import { execSync } from "child_process";
import EntryCommand from "../commands/index";
import { getProjectNameFromGitInfo } from "../utils";
import { loadUserInfoOnLoad } from "../utils/hooks";
import { getProjectConfig, getProjectConfigPath } from "../utils/projectConfig";
import { installCrusherRecorder, makeSureSetupIsCorrect } from "../utils/setup";
import { getRecorderDistCommand, resolvePathToAppDirectory } from "../utils/utils";

const nodeVersion = process.version.match(/^v(\d+\.\d+)/)[1];

if (parseFloat(nodeVersion) >= 10.0) {
  const args = process.argv.slice(2);
  const helpArgs = ["-h", "--h", "help", "--help", "-help"];

  if (args.length === 0 || helpArgs.includes(args[0])) {
    // console.log("Choose a command to run");
    // new EntryCommand().help();

    new Promise(async () => {

      // @Todo: Add support for flag token here
      await loadUserInfoOnLoad({token: undefined});
      await installCrusherRecorder();
      await makeSureSetupIsCorrect(null, true);

      const projectConfigPath = getProjectConfigPath();
      const projectConfig = getProjectConfig();

      // let noProjectFlags = "";
      // if (!projectConfig) {
      //   const suggestedProjectName = await getProjectNameFromGitInfo();
      //   noProjectFlags = "--suggested-project-name=" + suggestedProjectName;
      // }
      const customFlags = projectConfig && projectConfig.project ? `--project-config-file=${projectConfigPath} --projectId=${projectConfig.project}` : "";
      
      console.log("Basic " + `${getRecorderDistCommand()} --crusher-cli-path=${eval("__dirname") + "/index.js"} ${customFlags} --no-sandbox`);
      execSync(`${getRecorderDistCommand()} --crusher-cli-path=${eval("__dirname") + "/index.js"} ${customFlags} --no-sandbox`, {stdio: "inherit"});
    })

  } else {
    new EntryCommand().run();
  }

} else {
  console.error(
    "Node version must be >= 10.0.0. You are using version: " +
    nodeVersion
  );
}
