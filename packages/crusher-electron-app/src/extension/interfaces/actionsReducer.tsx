import { iAction } from "@shared/types/action";

export interface iActionsState {
	list: Array<iAction>;
	last_action: Date | null;
}
