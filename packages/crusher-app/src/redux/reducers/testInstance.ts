import { CLEAR_ALL_LOGS, SET_TEST_INSTANCE_LOGS } from "@redux/actions/testInstance";

const initialState = {
	logs: {},
};

const testInstance = (state = initialState, action) => {
	switch (action.type) {
		case SET_TEST_INSTANCE_LOGS:
            return {
				...state,
				logs: {
					...state.logs,
					[action.instanceId]: action.logs,
				},
			};
		case CLEAR_ALL_LOGS:
			return {
				...state,
				logs: {},
			};
		default:
			return state;
	}
};

export default testInstance;
