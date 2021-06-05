import { IEventMutationRecord } from "./types/IEventMutationRecord";
import { IRegisteredMutationRecord } from "./types/IRegisteredMutationRecord";

class RelevantHoverDetection {
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
}

export { RelevantHoverDetection };