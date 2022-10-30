import { DiscordWebhookManager } from "./sources/discord";
import { RemoteWebhook } from "./sources/remote";
import { SlackWebHook } from "./sources/slack";

export type TWebHookMessage = {
    payload: any;
    eventType: any;
}

export class WebhookManager {
    static async send(webhookUrl: string, messageBody: TWebHookMessage) {
        if (webhookUrl.includes("discord.com")) {
            DiscordWebhookManager.send(webhookUrl, messageBody)
        }
        if (webhookUrl.includes("slack.com")) {
            SlackWebHook.send(webhookUrl, messageBody)
        }
        RemoteWebhook.send(webhookUrl, messageBody)
    }
}