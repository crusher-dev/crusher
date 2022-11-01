import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { SlackOAuthResponse } from "@modules/slack/interface";
import { SlackService } from "@modules/slack/service";
import { BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ICreateVercelIntegrationPayload, IIntegrationsTable, IntegrationServiceEnum, IVercelIntegrations } from "../interface";
import { IntegrationsService } from "../service";
import axios from "axios";
import * as qs from "qs";
import { GithubIntegrationService } from "../githubIntegration.service";
import { VERCEL_CONFIG } from "../../../../../config/vercel";
import { BuildReportStatusEnum } from "@modules/resources/buildReports/interface";
import { TeamsService } from "@modules/resources/teams/service";


@Service()
class VercelService {
	@Inject()
	private dbManager: DBManager;
    @Inject()
    private integrationService: IntegrationsService;
    @Inject()
    private gitIntegrationService: GithubIntegrationService;
    @Inject()
    private teamsService: TeamsService;


    async getIntegrationRecordFromRepoName(repoFullName: string): Promise<{ githubIntegrationRecord: any; vercelIntegrationRecord: KeysToCamelCase<IIntegrationsTable> & {meta: {accessToken: string; userId: number;}}}> {
      const githubIntegrationRecord = await this.gitIntegrationService.getIntegrationRecord(repoFullName);
      if(!githubIntegrationRecord) throw new Error("Github integration not found for " + repoFullName);

      const team = await this.teamsService.getTeamFromProjectId(githubIntegrationRecord.projectId);
      const vercelIntegrationRecord = await this.integrationService.getVercelIntegration(team.id);
      if(!vercelIntegrationRecord) throw new Error("Vercel integration not found for " + repoFullName);

      return {githubIntegrationRecord, vercelIntegrationRecord};
    }

    async linkVercelIntegration(payload: { userId: string; teamId: number; projectId: number; vercelTeamId?: string; configurationId?: string; accessToken: string; }) {
      const vercelIntegrationRecord = await this.integrationService.getVercelIntegration(payload.teamId);
      if(vercelIntegrationRecord) {
        return this.integrationService.updateIntegration({
          accessToken: payload.accessToken,
          userId: payload.userId,
          vercelTeamId: payload.vercelTeamId,
          configurationId: payload.configurationId,
          teamId: payload.teamId
        }, vercelIntegrationRecord.id);
      }
      return this.integrationService.addIntegration({
            userId: payload.userId,
            teamId: payload.teamId,
            vercelTeamId: payload.vercelTeamId,
            configurationId: payload.configurationId,
            accessToken: payload.accessToken,
      }, IntegrationServiceEnum.VERCEL, payload.projectId, payload.teamId);
    }

    async getProjects(accessToken: string, teamId: string | null = null): Promise<any> {
      const apiUrl = `https://api.vercel.com/v9/projects` + (teamId ? `?teamId=${teamId}` : "");

      return axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(function (response) {
        console.log(response.data);
        return response.data;
      }).catch((e)=>{
        console.error("Error while requesting projects", e);
        return null;
      });
    }
  
    async getAccessToken(code): Promise<string> {
        const data = await axios.post('https://api.vercel.com/v2/oauth/access_token', qs.stringify({
          code,
          // @TODO: Add to this env
          client_id: VERCEL_CONFIG.CLIENT_ID,
          client_secret: VERCEL_CONFIG.CLIENT_SECRET,
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

    async createDeploymentStatus(acessToken, deployId, teamId,status) {
      console.log("Deplyoment satus", `https://api.vercel.com/v1/deployments/${deployId}/checks` + (teamId ? `?teamId=${teamId}` : ""));
      console.log("Access token", acessToken);

      return axios.post(`https://api.vercel.com/v1/deployments/${deployId}/checks` + (teamId ? `?teamId=${teamId}` : ""), {
         blocking: true,
         name: "Crusher check",
       }, {
         headers: {
           Authorization: `Bearer ${acessToken}`
         }
       }).then(function (response) {
         console.log(response.data);
         return response.data;
       }).catch((e)=>{
        console.error("Error", e.response.data.error);
         return e;
       })
    }


    async updateDeploymentStatus(accessToken, deployId,checkId, teamId,status, detailsUrl) {
      return axios.patch(`https://api.vercel.com/v1/deployments/${deployId}/checks/${checkId}` + (teamId ? `?teamId=${teamId}` : ""), {
        status: status,
        detailsUrl: detailsUrl
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(function (response) {
        console.log(response.data);
        return response.data;
      }).catch((e)=>{
        return e;
      });
    }

    async finishDeploymentChecks(accessToken, deployId, checkId, teamId, conclusion: "failed" | "neutral" | "succeeded", detailsUrl) {
      return axios.patch(`https://api.vercel.com/v1/deployments/${deployId}/checks/${checkId}` + (teamId ? `?teamId=${teamId}` : ""), {
        status: "completed",
        detailsUrl: detailsUrl,
        conclusion: conclusion
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(function (response) {
        console.log(response.data);
        return response.data;
      }).catch((e)=>{
        console.error("Error is" ,e.response.data.error);
        return e;
      });
    }

    getVercelConclusionFromBuildReportStatus(buildReportStatus: BuildReportStatusEnum) {
      switch (buildReportStatus) {
        case BuildReportStatusEnum.PASSED:
          return "succeeded";
        case BuildReportStatusEnum.FAILED:
          return "failed";
        case BuildReportStatusEnum.MANUAL_REVIEW_REQUIRED:
          return "neutral";
        default:
          return "neutral";
      }
    }


    async addVercelIntegrationForProject(payload: Omit<ICreateVercelIntegrationPayload, "meta"> & {meta: any}) {
      return this.dbManager.insert(`INSERT INTO public.vercel_integrations (project_id, user_id, name, vercel_project_id, meta, integration_id) VALUES (?, ?, ?, ?, ?, ?)`, [
        payload.projectId,
        payload.userId,
        payload.name,
        payload.vercelProjectId,
        JSON.stringify(payload.meta),
        payload.integrationId
      ]);
    }
  
    async updateVercelIntegrationForProject(integrationMeta: any, id: number) {
      return this.dbManager.update(`UPDATE public.vercel_integrations SET meta = ? WHERE id = ?`, [JSON.stringify(integrationMeta), id]);
    }
  
    async deleteVercelIntegrationForProject(projectId: number) {
      return this.dbManager.delete(`DELETE FROM public.vercel_integrations WHERE project_id = ?`, [projectId]);
    }

    @CamelizeResponse()
    async getVercelIntegrationForProject(projectId: any): Promise<KeysToCamelCase<IVercelIntegrations>> {
      return this.dbManager.fetchSingleRow(`SELECT * FROM public.vercel_integrations WHERE project_id = ?`, [projectId]);
    }

    @CamelizeResponse()
    async getVercelIntegrationFromVercelProjectId(projectId: any): Promise<KeysToCamelCase<IVercelIntegrations>> {
      return this.dbManager.fetchSingleRow(`SELECT * FROM public.vercel_integrations WHERE vercel_project_id = ?`, [projectId]);
    }
}

export { VercelService };
