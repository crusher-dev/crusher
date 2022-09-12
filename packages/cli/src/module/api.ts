import axios from "axios";
import { resolveBackendServerUrl } from "../utils/utils";

type IAuthUserResponse = {
    status: "WRONG_CREDS" | "LOGGED_IN" | "SIGNUP_SUCCESS"
    token?: string;
};
 
class CloudCrusher {
    static async authUser(email: string, password: string, payload: { discordInviteCode: string }): Promise<IAuthUserResponse> {
        const authApi = resolveBackendServerUrl("/user/actions/auth");
        return axios.post(resolveBackendServerUrl("/users/actions/auth"), {
            email: email,
            password: password,
            discordInviteCode: payload.discordInviteCode,
        }).then((res) => res.data);
    }
};

export { CloudCrusher };