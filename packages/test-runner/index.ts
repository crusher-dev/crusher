require("dotenv").config();
import TestRunnerBootstrap from "./src/boostrap";

const runnerBoostrap = new TestRunnerBootstrap();

runnerBoostrap.boot();
