import { JsonController, Get, Authorized, CurrentUser, Body, Post, Param, Res, BadRequestError } from "routing-controllers";
import { Service, Container, Inject } from "typedi";
import DBManager from "../../core/manager/DBManager";
import UserService from "../../core/services/UserService";
import ProjectService from "../../core/services/ProjectService";
import TestService from "../../core/services/TestService";
import DraftService from "../../core/services/DraftService";
import { Draft } from "../../core/interfaces/db/Draft";
import { addTestRequestToQueue } from "@utils/queue";
import { TestType } from "../../core/interfaces/TestType";
import { TestFramework } from "../../core/interfaces/TestFramework";
import { iUser } from "@crusher-shared/types/db/iUser";
import DraftInstanceService from "../../core/services/DraftInstanceService";
import { InstanceStatus } from "../../core/interfaces/InstanceStatus";
import DraftInstanceResultsService from "../../core/services/DraftInstanceResultsService";
import TestInstanceRecordingService from "../../core/services/TestInstanceRecordingService";
import { TestLiveStepsLogs } from "../models/testLiveStepsLogs";

@Service()
@JsonController("/draft")
export class DraftController {
	@Inject()
	private userService: UserService;
	@Inject()
	private testService: TestService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private draftService: DraftService;
	@Inject()
	private draftInstanceService: DraftInstanceService;
	@Inject()
	private draftInstanceResultsService: DraftInstanceResultsService;
	@Inject()
	private testInstanceRecordingService: TestInstanceRecordingService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Get("/get/:draftId")
	async getTest(@CurrentUser({ required: true }) user, @Param("draftId") draftId) {
		const { user_id } = user;
		return this.draftService.getDraftTest(draftId);
	}

	@Authorized()
	@Post("/createAndRun")
	async createDraft(@CurrentUser({ required: true }) user, @Body() body) {
		const { user_id } = user;
		const { testName, projectId, events, code } = body;
		const draft = await this.draftService.createDraftTest({
			name: testName ? testName : "",
			events: JSON.stringify(events),
			code: code,
			user_id,
			project_id: projectId,
		});
		const draftRecord: Draft = await this.draftService.getDraftTest(draft.insertId);

		if (draftRecord) {
			await addTestRequestToQueue({
				job: null,
				test: {
					...draftRecord,
					testType: TestType.DRAFT,
					framework: TestFramework.PLAYWRIGHT,
				},
			});
		}
		return draftRecord;
	}

	@Authorized()
	@Post("/getLastInstanceStatus/:draftId")
	async getStatus(@CurrentUser({ required: true }) user: iUser, @Param("draftId") draftId: number, @Body() body, @Res() res) {
		const { logsAfter } = body;
		let count = 0;
		const lastInstance = await this.draftInstanceService.getRecentDraftInstance(draftId);
		if (!lastInstance) {
			throw new BadRequestError();
		}

		return new Promise((resolve, reject) => {
			try {
				const interval = setInterval(async () => {
					const testStatus = await this.draftInstanceService.getDraftInstance(lastInstance.id).then(async (instance) => {
						const result = await this.draftInstanceResultsService.getDraftResult(lastInstance.id);

						const testInstanceRecording = await this.testInstanceRecordingService.getTestRecording(lastInstance.id);
						return {
							status: result ? instance.status : InstanceStatus.RUNNING,
							result,
							testInstanceRecording,
						};
					});

					if (logsAfter) {
						TestLiveStepsLogs.find(
							{
								testId: draftId,
								testType: TestType.DRAFT,
								createdAt: { $gt: new Date(logsAfter) },
							},
							function (err, logsArray) {
								const logs = logsArray
									? logsArray.map((log: any) => {
											return log.toObject();
									  })
									: null;
								if (err) {
									console.error(err);
									console.log(logs);
								}
								if (logs) {
									resolve({ status: "FETCHED_LOGS", logs: logs, test: testStatus });
									return clearInterval(interval);
								} else if (count === 5) {
									resolve({ status: "NO_UPDATE", test: testStatus });
									return clearInterval(interval);
								}
								count++;
							},
						);
					} else {
						TestLiveStepsLogs.find(
							{
								testId: draftId,
								testType: TestType.DRAFT,
							},
							function (err, logsArray) {
								const logs = logsArray.map((log: any) => {
									return log.toObject();
								});

								if (err) {
									console.error(err);
									console.log(logs);
								}
								if (logs) {
									resolve({ status: "FETCHED_LOGS", logs: logs, test: testStatus });
									return clearInterval(interval);
								} else if (count === 5) {
									resolve({ status: "NO_UPDATE", test: testStatus });
									return clearInterval(interval);
								}
								count++;
							},
						);
					}
				}, 1000);
			} catch (er) {
				reject(er);
			}
		});
	}
}
