import { focusOnWindow, saveAndGetUserInfo } from "electron-app/src/ui/commands/perform";
import { waitForUserLogin } from "electron-app/src/utils";

let _interval = null;

const loginUserToCloud = async (loginCallback) => {
    if(_interval) { clearInterval(_interval); _interval = null; }
    
    const {loginKey, interval} = await waitForUserLogin((loginToken: string) => {
        if(_interval) { clearInterval(_interval); _interval = null; }
            
        saveAndGetUserInfo(loginToken).then((userInfo) => {
           loginCallback(userInfo);
        });
    });

    return { loginKey, interval };
}

export { loginUserToCloud };
