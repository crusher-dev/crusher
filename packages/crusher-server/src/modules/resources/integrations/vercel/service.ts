import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { SlackOAuthResponse } from "@modules/slack/interface";
import { SlackService } from "@modules/slack/service";
import { BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { IIntegrationsTable, IntegrationServiceEnum } from "../interface";
import { IntegrationsService } from "../service";

@Service()
class VercelService {
	@Inject()
	private dbManager: DBManager;
    @Inject()
    private integrationService: IntegrationsService;

    async linkVercelIntegration(payload: { userId: string, projectId: number }) {
        return this.integrationService.addIntegration(payload, IntegrationServiceEnum.VERCEL, payload.projectId);
    }
}

export { VercelService };
