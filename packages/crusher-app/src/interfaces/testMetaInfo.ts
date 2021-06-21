import { EDITOR_TEST_TYPE } from "@crusher-shared/types/editorTestType";
import { iAction } from "@crusher-shared/types/action";

export interface iTestMetaInfo {
	testType: EDITOR_TEST_TYPE;
	id?: number;
	actions: iAction[];
	totalTime?: number;
	postData?: any;
}
