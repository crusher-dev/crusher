import { SET_USER_DATA } from "@redux/actions/action";

const user = (state = { loggedIn: false }, action) => {
	switch (action.type) {
		case SET_USER_DATA:
			return { ...action.data };
		default:
			return state;
	}
};

export default user;
