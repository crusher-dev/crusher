import {IEventMutationRecord} from "./IEventMutationRecord";

export interface IRegisteredMutationRecord extends IEventMutationRecord {
	dependentOn: IRegisteredMutationRecord | null;
}