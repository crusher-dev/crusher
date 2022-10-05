import { trimMultiLineString } from "@utils/string";
import axios from "axios";

export type TWebHookMessage = {
    payload: any;
    eventType: any;
}

export class DiscordWebhookManager {
    static async send(webhookUrl: string, messageBody: TWebHookMessage) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axios.post(webhookUrl, DiscordWebhookManager.formatMessage(messageBody), config);
        }
        catch (e) {
            console.log(`${e}`)
        }
    }

    static formatMessage(messageBody: TWebHookMessage) {
        const { payload } = messageBody;
        const { buildId, triggeredBy, reportStatus, totalTests, buildReportUrl, projectName, host } = payload;

        const content = `
            **Build ${buildId} started** on  ${projectName} by ${triggeredBy}

              host: ${host}
              ${reportStatus} for ${totalTests} tests

              report url : ${buildReportUrl}
            `;


        const colorCode = reportStatus === "passed" ? 0x9DE764 : reportStatus === "failed" ? 0xFF3FB2 : 0x9c2cf7;
        const message = {
            "embeds": [
                {
                    "type": "rich",
                    "title": `New build started (#${buildId}) for ${projectName} `,
                    "description": `${reportStatus} ${totalTests} tests - by ${triggeredBy}`,
                    "color": colorCode,
                    "fields": [
                        {
                            "name": `host`,
                            "value": `${host}`
                        },
                        {
                            "name": `project`,
                            "value": `${projectName}`
                        }
                        ,
                        {
                            "name": `report URl`,
                            "value": `${buildReportUrl}`
                        }
                    ],
                    "url": `https://google.com`
                }
            ]
        }
        var params = {
            username: "Crusher",
            avatar_url: "https://avatars.githubusercontent.com/u/65721833?s=400&u=8047c10ea1573a0488697b5a22a9a6847db096db&v=4",
            ...message
        }

        return params
    }
}