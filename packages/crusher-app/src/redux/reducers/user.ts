import { UserInfo } from "@interfaces/userInfo";
import { SET_USER_DATA } from "@redux/actions/project";
import { DELETE_USER_LOGIN_CONNECTION, SET_USER_LOGGED_IN, SET_USER_LOGIN_CONNECTIONS, USER_LOGOUT } from "@redux/actions/user";
import { iUserConnection } from "@crusher-shared/types/mongo/userConnection";

interface UserData {
	loggedIn: boolean;
	info: UserInfo | null;
	loginConnections: iUserConnection[];
}

const initialState: UserData = {
	loggedIn: false,
	info: null,
	loginConnections: [],
};

const user = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_USER_DATA:
			return { ...state, ...action.data };

		case SET_USER_LOGGED_IN:
			return {
				...state,
				loggedIn: true,
				info: action.info,
			};
		case SET_USER_LOGIN_CONNECTIONS:
			return {
				...state,
				loginConnections: action.payload.connections,
			};
		case DELETE_USER_LOGIN_CONNECTION: {
			const newLoginConnections = state.loginConnections.filter((connection) => connection.id !== action.payload.connectionId);

			return {
				...state,
				loginConnections: newLoginConnections,
			};
		}
		case USER_LOGOUT:
			return initialState;

		default:
			return state;
	}
};

export default user;
