import { BaseRowInterface } from "./baseRow";
import { PLATFORM } from "../platform";

export interface iTest extends BaseRowInterface {
	id: number;
	project_id: number;
	name: string;
	code: string;
	framework: PLATFORM;
	events: string;
	user_id: number;
	featured_video_uri: string | null;
	deleted: boolean;
	draft_id: number;
}
