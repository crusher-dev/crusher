import { iAction } from "crusher-shared/types/action";

const validActionTypeRegex = new RegExp(/(PAGE|ELEMENT|BROWSER)\_[A-Z0-1_]*$/);

class Actions {
  // @Note: This means Browser actions would be exeucted at first no matter
  // their order of placement in the list.
	getBrowserActions(actions: iAction[]) {
		return actions.filter((action: iAction) => {
			const matches = validActionTypeRegex.exec(action.type);
			return action && matches[1] === "BROWSER";
		});
  }

  getMainActions(actions: iAction[]) {
		return actions.filter((action: iAction) => {
			const matches = validActionTypeRegex.exec(action.type);
			return action && matches[1] !== "BROWSER";
		});
  }
}

export { Actions };
