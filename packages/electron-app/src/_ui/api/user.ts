import React from "react";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import useRequest from "../utils/useRequest";
import { getUserInfoAPIRequest } from "./user.requests";

export function useUser() {
  const { data: userInfo, error } = useRequest(getUserInfoAPIRequest);
  const projects = React.useMemo(() => {
    if(userInfo && userInfo.projects) {
      return userInfo.projects;
    }
    return null;
  }, [userInfo]);

  return { userInfo, projects, error: error  };
}
