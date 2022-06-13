require("dotenv").config();
import { setupLogger } from "@crusher-shared/modules/logger";
setupLogger("video-processor");
import VideoProcessorBootstrap from "@bootstrap";

const videoProcessorBootstrap = new VideoProcessorBootstrap();

videoProcessorBootstrap.boot();
