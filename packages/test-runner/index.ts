require("dotenv").config();
import { setupLogger } from "@crusher-shared/modules/logger";
setupLogger("test-runner");
import TestRunnerBootstrap from "@bootstrap";

const runnerBoostrap = new TestRunnerBootstrap();

runnerBoostrap.boot();
