import axios from "axios";
import { execSync } from "child_process";
import * as fs from "fs";
import * as pathModule from "path";
const open = require('open');

export const downloadFile = (url, path, bar): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileDir = pathModule.dirname(path);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    axios
      .get(url, { responseType: "stream" })
      .then(({ data, headers }) => {
        const stream = fs.createWriteStream(path, { mode: 0o777 });
        data.pipe(stream);
        let chunksCompleted = 0;

        data.on("data", (chunk) => {
          chunksCompleted += chunk.length;
          const percentage = Math.floor(
            (chunksCompleted / parseInt(headers["content-length"])) * 100
          );
          bar.update(percentage);

          if (percentage === 100) {
            bar.stop();
            stream.end(() => {
              resolve(path);

            });
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const openUrl = async (url: string) => {
  console.log("Opening this url: ", url);
  await open(url);
};

export const getGitUserInfo = () => {
  let username, email;
  try {
    username = execSync("git config --global user.name", { stdio: "pipe" })
      .toString()
      .trim();
  } catch(ex) {
    // console.debug("Could not get git username");
  }
  try {
    email = execSync("git config --global user.email", { stdio: "pipe" })
    .toString()
    .trim();
  } catch(ex) {
    // console.debug("Could not get git email");
  }

  return { username, email };
}