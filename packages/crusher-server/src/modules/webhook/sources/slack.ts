import { TWebHookMessage } from "..";
import axios from "axios";

export class SlackWebHook {
    static async send(webhookUrl: string, messageBody: TWebHookMessage) {
        // try {
        //     await axios.post(webhookUrl, { messageBody });
        // }
        // catch (e) {
        //     console.log(`${e}`)
        // }
    }
}
