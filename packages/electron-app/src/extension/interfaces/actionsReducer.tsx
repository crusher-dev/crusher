import { iAction } from "@shared/types/action";

export interface iActionsState {
	list: Array<iAction>;
	selectedActions: Array<{ id: number }>;
	last_action: Date | null;
}
