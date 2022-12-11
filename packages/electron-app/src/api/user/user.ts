import React from "react";
import useRequest from "../../_ui/utils/useRequest";
import { getUserInfoAPIRequest } from "./user.requests";
import { useNavigate } from "react-router-dom";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { useStore } from "react-redux";

export function useUser() {
	const { data: userInfo, error } = useRequest(getUserInfoAPIRequest);
	const navigate = useNavigate();
	const store = useStore();

	React.useEffect(() => {
		if (userInfo && !userInfo.isUserLoggedIn) {
			const userInfoRedux = getUserAccountInfo(store.getState());
			console.log("User info redux", userInfoRedux);
			if (userInfoRedux?.token) {
				// Invalid crdentials error. Logout
				return navigate("/invalid_creds_error");
			}
			return navigate("/login");
		}
	}, [userInfo]);
	const projects = React.useMemo(() => {
		if (userInfo?.projects) {
			return userInfo.projects;
		}
		return null;
	}, [userInfo]);

	return { userInfo, projects, error: error };
}
