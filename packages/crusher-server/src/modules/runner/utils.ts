import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE } from "@crusher-shared/constants/queues";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";

class RunnerUtils {
    // Used to replace base host, passed using --host flag
    static replaceHostInEvents(events: Array<iAction>, newHost: string) {
        if (!newHost || newHost === "null") return events;

        return events.map((event) => {
            if (event.type === ActionsInTestEnum.NAVIGATE_URL) {
                const urlToGo = new URL(event.payload.meta.value);
                const newHostURL = new URL(newHost);
                urlToGo.host = newHostURL.host;
                urlToGo.port = newHostURL.port;
                urlToGo.protocol = newHostURL.protocol;
                event.payload.meta.value = urlToGo.toString();
            }
            return event;
        });
    }

    static createExecutionTaskFlow(data: any, host: string | null = null) {
        if (host && host !== "null" && host.trim() !== "") {
            data.actions = this.replaceHostInEvents(data.actions, host);
        }
    
        return {
            name: `${data.buildId}/${data.testInstanceId}`,
            queueName: TEST_COMPLETE_QUEUE,
            data: {
                type: "process",
            },
            children: [
                {
                    name: `${data.buildId}/${data.testInstanceId}`,
                    queueName: TEST_EXECUTION_QUEUE,
                    data,
                    children: [],
                },
            ],
        };
    }
}


export { RunnerUtils };