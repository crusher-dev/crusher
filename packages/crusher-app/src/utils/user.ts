import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";
import { EMAIL_NOT_VERIFIED, NO_TEAM_JOINED, SIGNED_IN, USER_NOT_REGISTERED } from "crusher-server/crusher-server/src/constants";

export function getUserStatus(userInfo: iUserInfoResponse | null) {}

export function loginAndRedirectUser(userInfo);

export const isTempTestPending = () => localStorage.getItem("tempTest") !== null;
