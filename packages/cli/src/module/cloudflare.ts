import { downloadFile } from "../utils/common";

import { resolveBackendServerUrl, resolvePathToAppDirectory } from "../utils/utils";
import { execSync } from "child_process";
import path from "path";
import { getProjectConfig } from "../utils/projectConfig";
import { getAppConfig } from "../utils/appConfig";
import axios from "axios";

import { CLOUDFLARED_URL } from "../constants";

var { spawn, exec } = require("child_process");
const fs = require("fs");
const cliProgress = require('cli-progress');

async function installNSetupOnMac() {
  const recorderZipPath = resolvePathToAppDirectory(`cloudflare.tgz`);
  
  const bar = new cliProgress.SingleBar({
    format: `Downloading cloudflare tunnel {percentage}%`,
  });

  bar.start(100, 0, { speed: "N/A" });

  await downloadFile(CLOUDFLARED_URL.MAC, recorderZipPath, bar);

  execSync(
    `cd ${path.dirname(recorderZipPath)} && tar -xvzf ${path.basename(
      recorderZipPath
    )} && rm -R ${path.basename(
      recorderZipPath
    )} && mv cloudflared bin/cloudflared`,
    { stdio: "ignore" }
  );
}

async function installLinuxBuild() {
  const recorderZipPath = resolvePathToAppDirectory(`bin/cloudflared`);
  const bar = new cliProgress.SingleBar({
    format: `Downloading cloudflare tunnel {percentage}%`,
  });

  bar.start(100, 0, { speed: "N/A" });

  await downloadFile(CLOUDFLARED_URL.LINUX, recorderZipPath, bar);
  execSync(`cd ${path.dirname(recorderZipPath)}  `, { stdio: "ignore" });

  // await new Promise((res, rej) => {
  //   setTimeout(res, 50);
  // });
}

async function setupCloudflare() {
  if (process.platform === "darwin") {
    await installNSetupOnMac();
  } else if (process.platform === "linux") {
    await installLinuxBuild();
  }
}
export class Cloudflare {
  static async install() {
    await setupCloudflare();
  }

  static runTunnel(config: any | null = null) {
    return new Promise(async (resolve, rej) => {
      const cloudflareDFile = resolvePathToAppDirectory("bin/cloudflared");
      if (!fs.existsSync(cloudflareDFile)) {
        console.log("Downloading cloudflared");
        await Cloudflare.install();
      }

      const projectConfig = config || getProjectConfig();
      var data = projectConfig.proxy;

      const resultTunnelMap = {};
      const tunnelPromises = data.map(({ name, url, intercept }) => {
        return new Promise((res, rej) => {
          var spann;
          try {
            spann = spawn(resolvePathToAppDirectory(`bin/cloudflared`), [
              `tunnel`,`--url`,`${url}`
            ]);

            console.log("URL",resolvePathToAppDirectory(`bin/cloudflared`), [
              `tunnel --url ${url}`,
            ])
          } catch (e) {
            console.log("error", e);
          }

          spann.stdout.on("data", function (msg) {
            console.log(`[${name}]: `, msg);
          });
          spann.stderr.on("data", function (msg) {
            const msgInString = msg.toString();
            console.log(`[${name}]: `, msgInString);
            if (msgInString.includes("trycloudflare")) {
              const regex = /https.*trycloudflare.com/g;
              const found = msgInString.match(regex);
              if (!!found) {
                resultTunnelMap[name] = {
                  tunnel: found[0],
                  intercept: null
                };
                if(intercept) {
                  if(intercept instanceof RegExp) resultTunnelMap[name].intercept =  { regex: (intercept as RegExp).toString()};
                  else resultTunnelMap[name].intercept = intercept;
                }

                res("Found tunnel");
              }
            }
          });
        });
      });

      await Promise.all(tunnelPromises);
      const proxyKeys = Object.keys(resultTunnelMap);

      // Wait until tunnel is reachable using axios
      await proxyKeys.map((proxyKey)=> {
        const tunnel = resultTunnelMap[proxyKey].tunnel;
        console.log("Tunnel is", `"${tunnel}"`);

        return "Tunnel is reachable"
      });

      console.log("Wait for 60 seconds to make sure tunnel is reachable");
      await new Promise((resolve, reject) => setTimeout(resolve, 60000));
      console.log("results tunnel", JSON.stringify(resultTunnelMap));
      resolve(resultTunnelMap);
    });
  }
}
