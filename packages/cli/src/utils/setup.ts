import {
  resolveBackendServerUrl,
  resolvePathToAppDirectory,
} from "../utils/utils";
import * as fs from "fs";
import axios from "axios";
import * as path from "path";
import { getRecorderBuildForPlatfrom, recorderVersion } from "../constants";
import cli from "cli-ux";
import { getProjectConfig, setProjectConfig } from "../utils/projectConfig";
import { execSync } from "child_process";
import * as inquirer from "inquirer";
import { getProjectsOfCurrentUser, createProject } from "../utils/apiUtils";
import localTunnel from "localtunnel";
import { getProjectNameFromGitInfo } from "./index";
import { getAppConfig, setAppConfig } from "../utils/appConfig";
import { downloadFile } from "./common";

export async function makeSureSetupIsCorrect(projectId: string | null = null, ask = false) {
  const projectConfig = getProjectConfig();

  if (!projectConfig) {
    if(ask === true) {
      console.log("");
      const shouldInit = await inquirer.prompt([
        {
          name: "shouldInit",
          message: "Should we create a project for this dir?",
          type: "confirm",
          default: true,
        },
      ]);
      if(!shouldInit)
      return;
    }
    const projectConfig: any = { backend: resolveBackendServerUrl("") };
    if (projectId) {
      projectConfig.project = projectId;
      setProjectConfig({
        ...projectConfig,
      });
    } else {
      const projects = await getProjectsOfCurrentUser();
      const suggestedProjectName = await getProjectNameFromGitInfo();

      if (!suggestedProjectName) {
        const projectRes = await inquirer.prompt([
          {
            name: "project",
            message: "Select your crusher project:",
            type: "list",
            choices: [
              { name: "Create new project", value: "new" },
              ...projects.map((p) => ({
                name: p.name,
                value: p.id,
              })),
            ],
            default: projects[0].id,
          },
        ]);

        let projectId = (projectRes as any).project;
        if (projectId === "new") {
          const projectName = await inquirer.prompt([
            {
              name: "projectName",
              message: "Enter project name:",
              type: "input",
            },
          ]);

          const project = await createProject(projectName.projectName);
          projectId = project.id;
        }
        projectConfig.project = projectId;

        setProjectConfig({
          ...projectConfig,
        });
      } else {
        const projectRecord = await createProject(suggestedProjectName);
        console.log(`Selecting project ${projectRecord.name} by default`);
        projectConfig.project = projectRecord.id;

        setProjectConfig({
          ...projectConfig,
        });
      }
    }
  }

  // Add commands to package.json

  // Add commands to read CI config

  return {
    addedConfig: true,
    addedPackageJson: true,
    addedIntoCI: true,
  };
}

async function downloadUpstreamBuild(): Promise<string> {
  const packagesRecorderUrl = getRecorderBuildForPlatfrom();
  const recorderZipPath = resolvePathToAppDirectory(
    `bin/${packagesRecorderUrl.name}`
  );

  const bar = cli.progress({
    format: `Downloading latest version (${packagesRecorderUrl.version})\t[{bar}] {percentage}%`,
  });
  bar.start(100, 0, { speed: "N/A" });

  return downloadFile(packagesRecorderUrl.url, recorderZipPath, bar);
}

async function installMacBuild() {
  // handle when crusher is already installed

  cli.info("Crusher Recorder is not installed.\n");
  const recorderZipPath = await downloadUpstreamBuild();

  await cli.action.start("Unzipping");
  if (fs.existsSync(resolvePathToAppDirectory("bin/Crusher Recorder.app"))) {
    execSync(
      `cd ${path.dirname(recorderZipPath)} && rm -Rrf "Crusher Recorder.app"`
    );
  }
  execSync(
    `cd ${path.dirname(recorderZipPath)} && ditto -xk ${path.basename(
      recorderZipPath
    )} . && rm -R ${path.basename(recorderZipPath)}`,
    { stdio: "ignore" }
  );

  await new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(true);
    }, 3000)
  );
  await cli.action.stop("done\n");
}

async function installLinuxBuild() {
  // handle when crusher is already installed

  cli.info("Crusher Recorder is not installed.\n");
  const recorderZipPath = await downloadUpstreamBuild();

  await cli.action.start("Unzipping");
  execSync(
    `cd ${path.dirname(recorderZipPath)} && unzip ${path.basename(
      recorderZipPath
    )} -d . && rm -R ${path.basename(recorderZipPath)}`,
    { stdio: "ignore" }
  );

  await new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(true);
    }, 3000)
  );
  await cli.action.stop("done\n");
}

export async function installCrusherRecorder() {
  const cliConfig = getAppConfig();
  let shouldReinstall = false;

  if (cliConfig["recorderVersion"] !== recorderVersion) {
    shouldReinstall = true;
    cliConfig["recorderVersion"] = "";
    setAppConfig(cliConfig);
  }

  if (process.platform === "darwin") {
    if (
      fs.existsSync(resolvePathToAppDirectory("bin/Crusher Recorder.app")) &&
      shouldReinstall == false
    ) {
      return;
    }

    await installMacBuild();
  } else if (process.platform === "linux") {
    if (
      fs.existsSync(resolvePathToAppDirectory("bin/electron-app")) &&
      shouldReinstall == false
    ) {
      return;
    }

    await installLinuxBuild();
  }

  // Set config after succesfull installation
  cliConfig["recorderVersion"] = recorderVersion;
  setAppConfig(cliConfig);
}

export async function createTunnel(port: string): Promise<localTunnel.Tunnel> {
  await cli.action.start("Creating tunnel to local system");
  // eslint-disable-next-line radix
  const tunnel = await localTunnel({ port: parseInt(port) });
  await cli.action.stop();

  tunnel.on("close", () => {
    cli.log(`Tunnel for http://localhost:${port} closed`);
    process.exit(0);
  });
  return tunnel;
}
