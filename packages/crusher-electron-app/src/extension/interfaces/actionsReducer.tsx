import { iAction } from "@shared/types/action";

export interface iActionsState {
	list: iAction[];
	selectedActions: { id: number }[];
	last_action: Date | null;
}
