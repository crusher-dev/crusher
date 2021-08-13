import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase, Nullable } from "@modules/common/typescript/interface";

export interface ITestTable extends BaseRowInterface {
	id: number;
	project_id: number;
	name: string;
	events: string;
	user_id: number;
	featured_video_uri: string;
	featured_screenshot_uri: string;
	draft_job_id?: boolean;
	deleted: boolean;
	meta?: string;
}

export type ICreateTestPayload = KeysToCamelCase<
	Omit<ITestTable, "id" | "deleted" | "featured_screenshot_uri" | "featured_video_uri"> &
		Nullable<Pick<ITestTable, "featured_screenshot_uri" | "featured_video_uri">>
>;
