import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";

export interface ITestInstancesBaseLinesTable extends BaseRowInterface {
	test_id: number;
	context: string;
	host: string;
}
