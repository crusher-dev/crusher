import { JsonController, Get, Authorized, CurrentUser, Body, Post, Param, Res, BadRequestError } from "routing-controllers";
import { Service, Container, Inject } from "typedi";
import DBManager from '../../../core/manager/DBManager';
import { iUser } from '../../../../../crusher-shared/types/db/iUser';
import DraftV2Service from '../../../core/services/v2/DraftV2Service';
import DraftInstanceService from '../../../core/services/DraftInstanceService';
import { DRAFT_LOGS_STATUS, iDraftLogsResponse } from '.././../../../../crusher-shared/types/response/draftLogsResponse';

@Service()
@JsonController("/v2/draft")
export class DraftControllerV2 {

	private dbManager: DBManager;

	@Inject()
	private draftV2Service: DraftV2Service;
	@Inject()
	private draftInstanceService: DraftInstanceService;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Post("/getLogs/:draftId")
	async getStatus(@CurrentUser({ required: true }) user: iUser, @Param("draftId") draftId: number, @Body() body, @Res() res): Promise<iDraftLogsResponse> {
		const { logsAfter } = body;
		let count = 0;
		const lastInstance = await this.draftInstanceService.getRecentDraftInstance(draftId);
		if (!lastInstance) {
			throw new BadRequestError();
		}

		return new Promise((resolve, reject) => {
			try {
				const interval = setInterval(async () => {
					const testStatus = await this.draftV2Service.getDraftInstanceStatus(lastInstance.id);

					return this.draftV2Service.getDraftLogs(lastInstance.id, logsAfter).then((logs)=>{
						resolve({ status: DRAFT_LOGS_STATUS.UPDATE_LOGS, logs: logs, test: testStatus });
					}).catch((err)=>{
						if(count++ === 5){
							resolve({ status: DRAFT_LOGS_STATUS.NO_UPDATE, test: testStatus });
							clearInterval(interval);
						}
					});
				}, 1000);
			} catch (er) {
				reject(er);
			}
		});
	}
}
