import { ACTIONS_IN_TEST } from "../../constants/recordedActions";
import { TEST_TYPE } from "../testType";

export interface iLiveStepLogs {
	_id: string;
	actionType: ACTIONS_IN_TEST;
	body: any;
	testId: number;
	testType: TEST_TYPE;
	meta: any;
}
