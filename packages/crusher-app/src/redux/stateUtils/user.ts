import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";

export const getUserInfo = (state: any): iUserInfoResponse => state.user.info;

export const checkIfUserLoggedIn = (state: any): boolean => !!state.user.info;
