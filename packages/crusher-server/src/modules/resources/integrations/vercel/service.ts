import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { SlackOAuthResponse } from "@modules/slack/interface";
import { SlackService } from "@modules/slack/service";
import { BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { IIntegrationsTable, IntegrationServiceEnum } from "../interface";
import { IntegrationsService } from "../service";
import axios from "axios";
import * as qs from "qs";
import { GithubIntegrationService } from "../githubIntegration.service";

const CLIENT_ID = "oac_WuaVOjkHktjvIDiOUaSKr7ep";
const CLIENT_SECRET = "eqE49TZVVecTdxDp1WrLDSkN";

@Service()
class VercelService {
	@Inject()
	private dbManager: DBManager;
    @Inject()
    private integrationService: IntegrationsService;
    @Inject()
    private gitIntegrationService: GithubIntegrationService;


    async getIntegrationRecordFromRepoName(repoFullName: string): Promise<KeysToCamelCase<IIntegrationsTable>> {
      const githubIntegrationRecord = await this.gitIntegrationService.getIntegrationRecord(repoFullName);
      if(!githubIntegrationRecord) throw new Error("Github integration not found for " + repoFullName);

      const vercelIntegrationRecord = await this.integrationService.getVercelIntegration(githubIntegrationRecord.projectId);
      if(!vercelIntegrationRecord) throw new Error("Vercel integration not found for " + repoFullName);

      return vercelIntegrationRecord;
    }

    async linkVercelIntegration(payload: { userId: string, projectId: number; accessToken: string; }) {
      const vercelIntegrationRecord = await this.integrationService.getVercelIntegration(payload.projectId);
      if(vercelIntegrationRecord) {
        return this.integrationService.updateIntegration({
          accessToken: payload.accessToken,
          userId: payload.userId,
        }, vercelIntegrationRecord.id);
      }
      return this.integrationService.addIntegration({
            userId: payload.userId,
            accessToken: payload.accessToken,
      }, IntegrationServiceEnum.VERCEL, payload.projectId);
    }

    async getAccessToken(code): Promise<string> {
        const data = await axios.post('https://api.vercel.com/v2/oauth/access_token', qs.stringify({
          code,
          // @TODO: Add to this env
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: "https://5000-w3cj-expressapistarte-ktz0dzo1h2l.ws-us54.gitpod.io/configure",
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }).then(function (response) {
          console.log(response.data);
          return response.data;
        }).catch((e)=>{
          console.error(e);
          return e;
        });
        
        return data.access_token;
    }
}

export { VercelService };
