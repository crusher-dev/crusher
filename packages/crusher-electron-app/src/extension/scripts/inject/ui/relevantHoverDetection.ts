import { IEventMutationRecord } from "./types/IEventMutationRecord";
import { IRegisteredMutationRecord } from "./types/IRegisteredMutationRecord";

function getElementDepth(el) {
	let depth = 0;
	while (null !== el.parentElement) {
		el = el.parentElement;
		depth++;
	}
	return depth;
}

class RelevantHoverDetection {
	private _mapRecords: Map<Node, Map<Node, IRegisteredMutationRecord>> = new Map();

	constructor() {
		(window as any).getParentDomMutations = this.getParentDOMMutations.bind(this);
	}

	registerDOMMutation(record: IEventMutationRecord) {
		if (!(window as any).mapRecords) {
			(window as any).mapRecords = this._mapRecords;
		}
		const { eventNode, targetNode } = record;
		const alredyHasMap = this._mapRecords.has(targetNode);
		const targetNodeRecords: Map<Node, IRegisteredMutationRecord> = alredyHasMap ? this._mapRecords.get(targetNode)! : new Map();
		if (!alredyHasMap) this._mapRecords.set(targetNode, targetNodeRecords);

		if (targetNodeRecords.has(eventNode)) targetNodeRecords.delete(eventNode);

		targetNodeRecords.set(eventNode, {
			...record,
			dependentOn: null,
		});
	}

	isCoDependentNode(node: Node) {
		return this.getParentDOMMutations(node).length > 0;
	}

	getParentDOMMutations(node: Node): Array<IRegisteredMutationRecord> {
		let currentNode = node;
		const list = [];
		while (document.body.contains(currentNode) && currentNode != document.body) {
			if (this._mapRecords.has(currentNode) && !(currentNode instanceof SVGElement)) {
				const tmp = this._mapRecords.get(currentNode)!;
				list.push(Array.from(tmp.values()).pop() as IRegisteredMutationRecord);
			}
			currentNode = currentNode.parentNode!;
		}
		const out = list
			.reverse()
			.filter((item, index, array) => {
				return (
					array.findIndex((currentItem) => currentItem.eventNode === item.eventNode) === index &&
					(item.targetNode !== document.body || item.targetNode !== document)
				);
			})
			.sort((a, b) => {
				return getElementDepth(a.eventNode) - getElementDepth(b.eventNode);
			});

		return out;
	}
}

export { RelevantHoverDetection };
