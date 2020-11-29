import { UserInfo } from "@interfaces/userInfo";
import { SET_USER_DATA } from "@redux/actions/project";
import { SET_USER_LOGGED_IN, USER_LOGOUT } from "@redux/actions/user";

interface UserData {
	loggedIn: boolean;
	info: UserInfo | null;
}

const initialData: UserData = {
	loggedIn: false,
	info: null,
};

const user = (state = initialData, action: any) => {
	switch (action.type) {
		case SET_USER_DATA:
			return { ...action.data };

		case SET_USER_LOGGED_IN:
			return {
				loggedIn: true,
				info: action.info,
			};

		case USER_LOGOUT:
			return {
				loggedIn: false,
				info: null,
			};

		default:
			return state;
	}
};

export default user;
