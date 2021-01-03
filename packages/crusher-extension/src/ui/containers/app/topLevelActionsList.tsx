import React from "react";
import { TOP_LEVEL_ACTIONS_LIST } from "../../../constants/topLevelActions";
import { List } from "../../components/app/list";
import { TOP_LEVEL_ACTION } from "../../../interfaces/topLevelAction";

const TopLevelActionsList = () => {
	const items = TOP_LEVEL_ACTIONS_LIST.map((action) => {
		return {
			id: action.id,
			icon: action.icon,
			title: action.id.toUpperCase(),
			desc: action.value,
		};
	});

	const handleActionSelected = (id: TOP_LEVEL_ACTION) => {
		console.log("Selected top level action: ", id);
	};

	return (
		<List
			heading={"Select Action"}
			items={items}
			onItemClick={handleActionSelected}
		></List>
	);
};

export { TopLevelActionsList };
