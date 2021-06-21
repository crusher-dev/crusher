import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";
import { iUserConnection } from "@crusher-shared/types/mongo/userConnection";

export const getUserInfo = (state: any): iUserInfoResponse => state.user.info;

export const checkIfUserLoggedIn = (state: any): boolean => !!state.user.info;

export const getUserLoginConnections = (state: any): iUserConnection[] => state.user.loginConnections;
