import React from "react";
import { List } from "../../components/app/list";
import { TOP_LEVEL_ACTION } from "../../../interfaces/topLevelAction";
import { ELEMENT_LEVEL_ACTIONS_LIST } from "../../../constants/elementLevelActions";

const ElementLevelActionsList = () => {
	const items = ELEMENT_LEVEL_ACTIONS_LIST.map((action) => {
		return {
			id: action.id,
			icon: action.icon,
			title: action.id.toUpperCase(),
			desc: action.value,
		};
	});

	const handleActionSelected = (id: TOP_LEVEL_ACTION) => {
		console.log("Selected element action: ", id);
	};

	return (
		<List
			heading={"Select Element Action"}
			items={items}
			onItemClick={handleActionSelected}
		></List>
	);
};

export { ElementLevelActionsList };
