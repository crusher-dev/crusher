import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";

import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { ICreateDraftTestsPayload, IDraftTestsTable, IUpdateDraftTestsPayload } from "./interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";


@Service()
class DraftTestsService {
	@Inject()
	private dbManager: DBManager;

    async createDraftTest(payload: ICreateDraftTestsPayload) {
        return this.dbManager.insert("INSERT INTO public.draft_tests (name, events, user_id, project_id) VALUES (?, ?, ?, ?)", [
            payload.name,
            JSON.stringify(payload.events),
            payload.userId,
            payload.projectId
        ]);
    }

    @CamelizeResponse()
    async getDraftsByProjectId(projectId: number): Promise<KeysToCamelCase<IDraftTestsTable>> {
        return this.dbManager.fetchAllRows("SELECT * FROM public.draft_tests WHERE project_id = ?", [projectId]) as any;
    }

    @CamelizeResponse()
    async getDraftById(draftId: number): Promise<KeysToCamelCase<IDraftTestsTable>> {
        return this.dbManager.fetchSingleRow("SELECT * FROM public.draft_tests WHERE id = ?", [draftId]) as any;
    }

    async deleteDraftById(draftId: number) {
        return this.dbManager.delete("DELETE FROM public.draft_tests WHERE id = ?", [draftId]);
    }

    async updateDraftById(draftId: number, payload: KeysToCamelCase<IUpdateDraftTestsPayload>) {
        return this.dbManager.update("UPDATE public.draft_tests SET name = ?, events = ? WHERE id = ?", [payload.name, JSON.stringify(payload.events), draftId]);
    }
}

export { DraftTestsService };
