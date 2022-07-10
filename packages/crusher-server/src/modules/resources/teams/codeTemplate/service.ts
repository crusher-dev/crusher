import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { Inject, Service } from "typedi";
import { ICodeTemplateTable, ICreateCodeTemplatePayload, IUpdateCodeTemplatePayload } from "./interface";

@Service()
class CodeTemplateService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getCodesForTeam(teamId: number): Promise<Array<KeysToCamelCase<ICodeTemplateTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM public.custom_codes WHERE team_id = ?", [teamId]);
	}

	@CamelizeResponse()
	async get(id: number): Promise<KeysToCamelCase<ICodeTemplateTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.custom_codes WHERE id = ?", [id]);
	}

	async create(payload: ICreateCodeTemplatePayload) {
		return this.dbManager.insert("INSERT INTO public.custom_codes (team_id, code, name) VALUES (?, ?, ?)", [payload.teamId, payload.code, payload.name]);
	}

	async delete(id: number) {
		return this.dbManager.fetchSingleRow("DELETE FROM public.custom_codes WHERE id = ?", [id]);
	}

	async update(payload: IUpdateCodeTemplatePayload) {
		return this.dbManager.fetchSingleRow("UPDATE public.custom_codes SET code = ?, name = ? WHERE id = ?", [payload.code, payload.name, payload.id]);
	}
}

export { CodeTemplateService };
