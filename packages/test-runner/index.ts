require("dotenv").config();
import TestRunnerBootstrap from "./ee/bootstrap";

const runnerBoostrap = new TestRunnerBootstrap();

runnerBoostrap.boot();
