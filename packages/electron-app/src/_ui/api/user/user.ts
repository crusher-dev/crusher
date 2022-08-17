import React from "react";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import useRequest from "../../utils/useRequest";
import { getUserInfoAPIRequest } from "./user.requests";
import { useNavigate } from "react-router-dom";

export function useUser() {
  const { data: userInfo, error } = useRequest(getUserInfoAPIRequest);
  const navigate = useNavigate();

  React.useEffect(() => {
    if(userInfo && !userInfo.isUserLoggedIn){
      return navigate("/login");
    }
  }, [userInfo]);
  const projects = React.useMemo(() => {
    if(userInfo && userInfo.projects) {
      return userInfo.projects;
    }
    return null;
  }, [userInfo]);

  return { userInfo, projects, error: error  };
}
