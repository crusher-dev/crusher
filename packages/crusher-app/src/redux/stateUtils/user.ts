import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";

export const getUserInfo = (state: any): iUserInfoResponse => state.user.info;
