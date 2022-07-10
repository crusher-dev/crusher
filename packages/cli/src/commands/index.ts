import { Command } from "commander";
import * as packgeJSON from "../../package.json";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export default class CommandBase {
  constructor() {}

  help() {
    console.log(`
  Run a command: ${chalk(`npx crusher-cli [command]`)}
  Example:       ${chalk(`npx crusher-cli create:test`)}

  ${chalk.hex("C1C1C1")("Commands")}

  Basic
      ${chalk.hex("9A4AFF")(`test:create`)}               Create a new test
      ${chalk.hex("9A4AFF")(`test:run`)}                  Run all the tests

  Other commands
      login
      open                      Open crusher in browser
      init                      Initialize project in the repo
      info
      whoami                    your info
      logout
      token                     your token
    `);
  }

  getPathForType(type: string) {
    const arr = type.split(":");
    return arr.join("/");
  }

  async run() {
    const type = process.argv[2];
    if (
      type &&
      fs.existsSync(
        path.resolve(
          __dirname,
          "../commands/",
          `${this.getPathForType(type)}.${
            process.env.NODE_ENV === "production" ? "js" : "ts"
          }`
        )
      )
    ) {
      //@ts-ignore
      const requireCommand =typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
      try {
        await (new (requireCommand(
          path.resolve(
            __dirname,
            "../commands/",
            `${this.getPathForType(type)}.${
              process.env.NODE_ENV === "production" ? "js" : "ts"
            }`
          )
        ).default)()).init();
      } catch (err) {
        if (err.message === "SIGINT") process.exit(1);

        console.log("Error:", err);
        process.exit(1);
      }
    } else {
      this.help();
    }
  }
}

process.on("uncaughtException", (err) => {
  console.log("Error:", err.message);

  process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Error:", (reason as Error).message);
  process.exit(1);
});
