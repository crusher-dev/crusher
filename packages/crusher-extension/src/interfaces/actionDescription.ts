import { TOP_LEVEL_ACTION } from "./topLevelAction";
import { ELEMENT_LEVEL_ACTION } from "./elementLevelAction";

export interface iActionDescription {
	id: TOP_LEVEL_ACTION | ELEMENT_LEVEL_ACTION;
	value: string;
	icon: string;
	desc: string;
}
