import axios from "axios";
import { TWebHookMessage } from "..";

export class RemoteWebhook {
    static async send(webhookUrl: string, messageBody: TWebHookMessage) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axios.post(webhookUrl, JSON.stringify(messageBody), config);
        }
        catch (e) {
            console.log(`${e}`)
        }
    }
}