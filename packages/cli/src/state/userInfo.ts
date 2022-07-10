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
  userInfo = _userInfo;
};

const getUserInfo = () => {
  return userInfo;
};

export { setUserInfo, getUserInfo };
