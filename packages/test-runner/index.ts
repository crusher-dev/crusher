require("dotenv").config();
import TestRunnerBootstrap from "./src/bootstrap";

const runnerBoostrap = new TestRunnerBootstrap();

runnerBoostrap.boot();
