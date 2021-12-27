import { ActionsInTestEnum } from '@shared/constants/recordedActions';
import { iAction } from '@shared/types/action';
import { resolveToBackendPath, resolveToFrontEndPath } from '@shared/utils/url';
import axios from 'axios';
import { shell } from 'electron';
import { getBrowserActions, getMainActions } from 'runner-utils/src';
import * as url from "url";

class CrusherTests {
    public static async getTest(testId: string): Promise<Array<iAction>> {
        const testInfoResponse = await axios.get<{events: Array<iAction>}>(resolveToBackendPath(`/tests/${testId}`, "https://backend.crusher.dev"));
        const testSteps = testInfoResponse.data.events;

        return testSteps;
    }

    public static async getReplayableTestActions(actions: Array<iAction>, isMainTest: boolean): Promise<Array<iAction>> {
        const out = [];
        const browserActions: Array<iAction> = getBrowserActions(actions);
        if (isMainTest) {
            out.push(...browserActions);
        }
        const runAfterTest = browserActions.find((action) => action.type === ActionsInTestEnum.RUN_AFTER_TEST);
        if (runAfterTest) out.push(...(await this.getReplayableTestActions(await this.getTest(runAfterTest.payload.meta.value), false)));
    
        const mainActions: Array<iAction> = getMainActions(actions);
        if (!isMainTest) {
            mainActions.map((action) => {
                return action;
            });
        }
        out.push(...mainActions);
    
        return out;
    }
    
    public static async saveTest(events: Array<iAction>) {
       return axios.post(resolveToBackendPath("tests/actions/save.temp", `https://backend.crusher.dev/`), {
            events: events
        }, {
            headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" },
        })
            .then(async (result) => {
                shell.openExternal(resolveToFrontEndPath(`/?temp_test_id=${result.data.insertId}`, `https://app.crusher.dev/`));
    
                // @Note: window.open() instead of navigation though hyperlinks
                // hangs the electron app for some reason.
            });
    }
}

export { CrusherTests };