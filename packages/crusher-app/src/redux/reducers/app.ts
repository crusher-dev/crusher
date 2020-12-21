import IAction from "@interfaces/redux/action";

const app = (state = { setting: {} }, action: IAction<any>) => {
	switch (action.type) {
		default:
			return state;
	}
};
export default app;
