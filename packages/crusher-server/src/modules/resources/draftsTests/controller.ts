import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ProjectEnvironmentController } from "../projects/environments/controller";
import { ICreateDraftTestsPayload, IUpdateDraftTestsPayload } from "./interface";
import { DraftTestsService } from "./service";

@Service()
@JsonController()
class DraftTestsController {
	@Inject()
    private draftTestsService: DraftTestsService;

    @Authorized()
    @Post("/projects/:project_id/drafts")
    async createDraftTest(@CurrentUser({require: true}) user, @Param("project_id") projectId: number, @Body() payload: ICreateDraftTestsPayload) {
        const { user_id: userId } = user;

        const insertRecord = await this.draftTestsService.createDraftTest({ 
            ...payload,
            projectId,
            userId
        });

        return {
            draftId: insertRecord.insertId,
        }
    }

    @Authorized()
    @Get("/projects/:project_id/drafts")
    async getDraftsByProjectId(@Param("project_id") projectId: number) {
        return this.draftTestsService.getDraftsByProjectId(projectId);
    }

    @Authorized()
    @Get("/drafts/:draft_id")
    async getDraftById(@Param("draft_id") draftId: number) {
        return this.draftTestsService.getDraftById(draftId);
    }

    @Authorized()
    @Delete("/drafts/:draft_id")
    async deleteDraftById(@Param("draft_id") draftId: number) {
        return this.draftTestsService.deleteDraftById(draftId);
    }

    @Authorized()
    @Put("/drafts/:draft_id")
    async updateDraftById(@Param("draft_id") draftId: number, @Body() payload: IUpdateDraftTestsPayload) {
        return this.draftTestsService.updateDraftById(draftId, payload);
    }
}

export { DraftTestsController };
