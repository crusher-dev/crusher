import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase, Nullable } from "@modules/common/typescript/interface";

export interface ITestTable extends BaseRowInterface {
	id: number;
	project_id: number;
	name: string;
	events: string;
	user_id: number;
	featured_video_url: string;
	featured_screenshot_url: string;
	featured_clip_video_url?: string;
	draft_job_id?: number;
	deleted: boolean;
	meta?: string;
	emoji?: string;
}

export interface ITemplatesTable extends BaseRowInterface {
	id: number;
	events: string;
	name: string;
	project_id: number;
	user_id: number;
}

export type ICreateTemplatePayload = KeysToCamelCase<
	Omit<ITemplatesTable, "id" | "user_id" | "project_id" | "created_at" | "updated_at"> & Nullable<Pick<ITemplatesTable, "user_id" | "project_id">>
>;

export type ICreateTestPayload = KeysToCamelCase<
	Omit<ITestTable, "id" | "deleted" | "featured_screenshot_uri" | "featured_video_url"> &
		Nullable<Pick<ITestTable, "featured_screenshot_url" | "featured_video_url">>
>;
