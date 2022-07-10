import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import { execSync } from "child_process";

function createTempGitRepo() {
  const tempDir = fs.mkdtempSync(
    path.join(__dirname, "..", "..", "tmp", "cli")
  );
  const gitDir = path.join(tempDir, ".git");
  execSync(`cd ${tempDir} && git init`);
  fs.writeFileSync(path.join(tempDir, "README.md"), "Hello, World!");
  fs.writeFileSync(path.join(tempDir, ".gitignore"), "node_modules");
  execSync(`cd ${tempDir} && git add .`);
  execSync(`cd ${tempDir} && git commit -m "Initial commit"`);
  execSync(
    `cd ${tempDir} && git remote add origin https://github.com/crusherdev/crusher.git`
  );
  return tempDir;
}

function createTempCrusherGlobalDir() {
  if(!fs.existsSync(path.join(__dirname, "../../tmp"))) {
    fs.mkdirSync(path.join(__dirname, "../../tmp"));
  }
  const tempDir = fs.mkdtempSync(
    path.join(__dirname, "..", "..", "tmp", ".crusher")
  );
  return tempDir;
}

export { createTempGitRepo, createTempCrusherGlobalDir };
