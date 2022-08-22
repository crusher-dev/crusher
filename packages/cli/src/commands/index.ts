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
  Example:       ${chalk(`npx crusher-cli test:create`)}

  ${chalk.hex("C1C1C1")("Commands")}

  Basic
      .                         Starts crusher
      ${chalk.bold(chalk.hex("fff")(`test:create`))}               Create new test
      ${chalk.bold(chalk.hex("fff")(`test:run`))}                  Run all the tests
      login                     Logs into your account or create new one
      logout                    Logs out of your account

  Other commands
      init                      Initialize project in the repo
      info                      Shows info about the project
      whoami                    Information about the current logged-in user
      token                     Get API token for integrations
      invite                    Invite team members to your project
      tunnel                    Open a tunnel to the project
      help                      Show help
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
        console.log(chalk.red("Error:"), err.message);
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
