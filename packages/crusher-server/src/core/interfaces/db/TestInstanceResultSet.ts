import { BaseRowInterface } from "./BaseRowInterface";
import { TestInstanceResultStatus } from "../TestInstanceResultStatus";
import { TestInstanceResultSetConclusion } from "../TestInstanceResultSetConclusion";
import { TestInstanceResultSetStatus } from "../TestInstanceResultSetStatus";

export interface TestInstanceResultSet extends BaseRowInterface {
	id?: number;
	report_id: number;
	instance_id: number;
	target_instance_id: number;
	status: TestInstanceResultSetStatus;
	conclusion?: TestInstanceResultSetConclusion;
}
