import { BaseRowInterface } from './baseRow';

export interface iTest extends BaseRowInterface {
	id: number;
	project_id: number;
	name: string;
	events: string;
	user_id: number;
	featured_video_uri: string | null;
	deleted: boolean;
	draft_id: number;
}
