import { IEventMutationRecord } from "./types/IEventMutationRecord";
import { IRegisteredMutationRecord } from "./types/IRegisteredMutationRecord";

class RelevantHoverDetection {
<<<<<<< HEAD
	private _mutationRecords: Array<IRegisteredMutationRecord> = [];
	private _mapRecords: Map<Node, Array<IRegisteredMutationRecord>> = new Map();

	registerDOMMutation(record: IEventMutationRecord) {
		if (!(window as any).mapRecords) {
			(window as any).mapRecords = this._mapRecords;
		}
		const { targetNode } = record;
		const targetNodeRecords: Array<IRegisteredMutationRecord> = this._mapRecords.has(
			targetNode,
		)
			? this._mapRecords.get(targetNode)!
			: [];

		targetNodeRecords.push({
			...record,
			dependentOn: null,
		});
		this._mapRecords.set(targetNode, targetNodeRecords);
	}

	getInterdependentHoverNode(
		currentActionNode: Node,
	): IRegisteredMutationRecord | null {
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

	async getDependentHoverNodesList(
		actionType: ACTIONS_IN_TEST,
		target: HTMLElement,
	) {
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
=======
    private _mapRecords: Map<Node, Map<Node, IRegisteredMutationRecord>> = new Map();

    registerDOMMutation(record: IEventMutationRecord){
        if(!(window as any).mapRecords) {
            (window as any).mapRecords = this._mapRecords;
        }
        const { eventNode, targetNode } = record;
        const alredyHasMap = this._mapRecords.has(targetNode);
        const targetNodeRecords: Map<Node, IRegisteredMutationRecord> = alredyHasMap ? this._mapRecords.get(targetNode)! : new Map();
        if(!alredyHasMap) this._mapRecords.set(targetNode, targetNodeRecords);

        if(targetNodeRecords.has(eventNode))
            targetNodeRecords.delete(eventNode);

        targetNodeRecords.set(eventNode, {
            ...record,
            dependentOn: null
        });
    }

    isCoDependentNode(node: Node) {
        return this.getParentDOMMutations(node).length > 0;
    }

    getParentDOMMutations(node: Node): Array<IRegisteredMutationRecord> {
       let currentNode = node;
       const list = [];
       while(document.body.contains(currentNode)) {
            if(this._mapRecords.has(currentNode)){
                const tmp = this._mapRecords.get(currentNode)!;
                list.push(Array.from(tmp.values()).pop() as IRegisteredMutationRecord);
            }
            currentNode = currentNode.parentNode!;
       }
       return list.reverse();
    }
>>>>>>> 5da04c0191eeef9d706f3a70beaff4001d34cbc6
}

export { RelevantHoverDetection };
