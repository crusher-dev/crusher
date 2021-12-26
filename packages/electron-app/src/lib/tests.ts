import { ActionsInTestEnum } from '@shared/constants/recordedActions';
import { iAction } from '@shared/types/action';
import { resolveToBackendPath } from '@shared/utils/url';
import axios from 'axios';
import { getBrowserActions, getMainActions } from 'runner-utils/src';

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
    
}

export { CrusherTests };