import { ActionsInTestEnum } from '@shared/constants/recordedActions';
import { iAction } from '@shared/types/action';
import { resolveToBackendPath, resolveToFrontEndPath } from '@shared/utils/url';
import axios from 'axios';
import { shell } from 'electron';
import { getBrowserActions, getMainActions } from 'runner-utils/src';
import * as url from "url";

class CrusherTests {
    public static async getTest(testId: string, customBackendPath: string | undefined = undefined): Promise<Array<iAction>> {
        const testInfoResponse = await axios.get<{events: Array<iAction>}>(resolveToBackendPath(`/tests/${testId}`, customBackendPath));
        const testSteps = testInfoResponse.data.events;

        return testSteps;
    }

    public static async getReplayableTestActions(actions: Array<iAction>, isMainTest: boolean, customBackendPath: string | undefined = undefined): Promise<Array<iAction>> {
        const out = [];
        const browserActions: Array<iAction> = getBrowserActions(actions);
        if (isMainTest) {
            out.push(...browserActions);
        }
        const runAfterTest = browserActions.find((action) => action.type === ActionsInTestEnum.RUN_AFTER_TEST);
        if (runAfterTest) out.push(...(await this.getReplayableTestActions(await this.getTest(runAfterTest.payload.meta.value, customBackendPath), false)));
    
        const mainActions: Array<iAction> = getMainActions(actions);
        if (!isMainTest) {
            mainActions.map((action) => {
                return action;
            });
        }
        out.push(...mainActions);
    
        return out;
    }
    
    public static async saveTest(events: Array<iAction>, customBackendPath: string | undefined = undefined, customFrontEndPath: string | undefined = undefined) {
       return axios.post(resolveToBackendPath("tests/actions/save.temp", customBackendPath), {
            events: events
        }, {
            headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" },
        })
            .then(async (result) => {
                shell.openExternal(resolveToFrontEndPath(`/?temp_test_id=${result.data.insertId}&temp_test_type=save`, customFrontEndPath));
    
                // @Note: window.open() instead of navigation though hyperlinks
                // hangs the electron app for some reason.
            });
    }

    public static async updateTest(events: Array<iAction>, testId: string, customBackendPath: string | undefined = undefined, customFrontEndPath: string | undefined = undefined) {
        return axios.post(resolveToBackendPath("tests/actions/save.temp", customBackendPath), { events: events }, {
            headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" },
        }).then(async (result) => {
          shell.openExternal(resolveToFrontEndPath(`/?temp_test_id=${result.data.insertId}&temp_test_type=update&update_test_id=${testId}`, customFrontEndPath));
    
          // @Note: window.open() instead of navigation though hyperlinks
          // hangs the electron app for some reason.
        });
    }
}

export { CrusherTests };