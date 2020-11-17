import { RunJobRequestBody } from "./RunJobRequestBody";
import { RunTestRequestBody } from "./RunTestRequestBody";

export interface RunRequest {
  job?: RunJobRequestBody;
  test: RunTestRequestBody;
  instanceId?: number;
}
