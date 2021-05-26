import { IEventMutationRecord } from "./types/IEventMutationRecord";
import { IRegisteredMutationRecord } from "./types/IRegisteredMutationRecord";
import { IRelevantEvent } from "./types/IRelevantEvent";
import { ACTIONS_IN_TEST } from "../../../../../crusher-shared/constants/recordedActions";

class RelevantHoverDetection {
    private _mutationRecords: Array<IRegisteredMutationRecord>;

    registerDOMMutation(record: IEventMutationRecord){
        const { eventNode } = record;
		const dependentOn = this.getInterdependentHoverNode(eventNode);
        this._mutationRecords.push({...record, dependentOn: dependentOn});
    }

    getInterdependentHoverNode(currentActionNode: Node) : IRegisteredMutationRecord | null{
        const relevantEvents: Array<any> = [];
		this._mutationRecords.filter((record, index) => {
			const n =
				record.targetNode.isEqualNode(currentActionNode) ||
				record.targetNode.contains(currentActionNode);
			if (n) {
				relevantEvents.push({
					evt: record,
					index,
					isSame: record.targetNode.isEqualNode(currentActionNode),
				});
			}
			return;
		});
		const otherArr: Array<IRelevantEvent & { secondIndex: number }> = [];
		relevantEvents.filter(function (e, index) {
			if (e.isSame) {
				otherArr.push({
					...e,
					secondIndex: index,
				});
			}
		});
		
        if (otherArr.length > 1) {
			const firstDependent = otherArr[0].evt.dependentOn;
			for (let i = 0; i < otherArr.length - 1; i++) {
				delete this._mutationRecords[otherArr[0].index];
				otherArr.splice(0, 1);
				relevantEvents.splice(otherArr[0].secondIndex, 1);
			}
			otherArr[0].evt.dependentOn = firstDependent;
		}

		for (let i = 0; i < otherArr.length; i++) {
			relevantEvents[otherArr[i].secondIndex] = otherArr[i];
		}

		return relevantEvents.length > 0
			? relevantEvents[relevantEvents.length - 1].evt
			: null;
    }

    async getDependentHoverNodesList(actionType: ACTIONS_IN_TEST, target: HTMLElement) {
		let finalActions: Array<any> = [];
		finalActions.push(target);
		let relevantNodeRecord = this.getInterdependentHoverNode(target);
		if (relevantNodeRecord && relevantNodeRecord.eventNode) {
			let isLast = false;
			while (!isLast) {
				finalActions = [relevantNodeRecord.eventNode, ...finalActions];
				if (!relevantNodeRecord.dependentOn) {
					isLast = true;
					break;
				}
				relevantNodeRecord = relevantNodeRecord.dependentOn;
			}
		}

		const newArray = [];
		if (finalActions.length) newArray.push(finalActions[0]);
		for (let i = 1; i < finalActions.length; i++) {
			const current = finalActions[i];
			if (current.contains(finalActions[i - 1])) {
				continue;
			}
			if (newArray[newArray.length - 1].contains(current)) {
				newArray[newArray.length - 1] = current;
				continue;
			}
			newArray.push(current);
		}

		return finalActions;
	}
}

export { RelevantHoverDetection };