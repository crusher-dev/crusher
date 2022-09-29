import { setUserAccountInfo } from "electron-app/src/store/actions/app";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { saveAndGetUserInfo } from "electron-app/src/_ui/commands/perform";
import { waitForUserLogin } from "electron-app/src/utils/renderer";

let _interval = null;

const loginUserToCloud = async (loginCallback, store) => {
    if (_interval) { clearInterval(_interval); _interval = null; }
    const { loginKey, interval } = await waitForUserLogin((loginToken: string) => {
        if (_interval) { clearInterval(_interval); _interval = null; }

        const userInfo = getUserAccountInfo(store.getState());
        store.dispatch(setUserAccountInfo({ ...(userInfo ? userInfo : {}), token: loginToken }));

        saveAndGetUserInfo(loginToken).then((userInfo) => {
            loginCallback(userInfo);
        });
    });

    return { loginKey, interval };
}

export { loginUserToCloud };
