import { IRegisteredMutationRecord } from "./IRegisteredMutationRecord";

export interface IRelevantEvent {
	evt: IRegisteredMutationRecord;
	index: number;
	isSame: boolean;
}
