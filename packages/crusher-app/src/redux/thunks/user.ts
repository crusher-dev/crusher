// import { setUserDataInState } from '../actions/action';
import { backendRequest, cleanHeaders } from "@utils/backendRequest";

export const fetchUserData = (headers = null) => (dispatch) => {
	cleanHeaders(headers);

	return backendRequest("/user/info", { headers: headers })
		.then((userInfo) => {
			// dispatch(setUserDataInState({ ...userInfo, loggedIn: true }));
		})
		.catch((err) => {
			// dispatch(setUserDataInState({ loggedIn: false }));
		});
};
