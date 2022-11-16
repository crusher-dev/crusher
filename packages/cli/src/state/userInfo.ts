import { Analytics } from "../../../crusher-shared/modules/analytics/AnalyticsManager";

// eslint-disable-next-line unicorn/filename-case
export interface IUserInfo {
  id: number;
  teamName: string;
  email: string;
  name: string;
  token: string;
}

let userInfo: IUserInfo | null = null;

const setUserInfo = (_userInfo: IUserInfo) => {
  if(_userInfo) {
    Analytics.identifyUser(
      {
        userId: _userInfo.email
      }
    );
  }
  
  userInfo = _userInfo;
};

const getUserInfo = () => {
  return userInfo;
};

export { setUserInfo, getUserInfo };
