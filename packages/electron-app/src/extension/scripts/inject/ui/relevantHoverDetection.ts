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
	isRunning = true;
	resetTime = Date.now();

	constructor() {
		(window as any).getParentDomMutations = this.getParentDOMMutations.bind(this);
	}

	registerDOMMutation(record: IEventMutationRecord) {
		if (!(window as any).mapRecords) {
			(window as any).mapRecords = this._mapRecords;
		}
		if (!this.isRunning) return;
		if (!document.body.contains(record.targetNode) && !document.body.contains(record.eventNode)) return;

		const { eventNode, targetNode } = record;
		// Just in case
		if (eventNode instanceof SVGElement && eventNode.tagName.toLowerCase() !== "svg") return;

		const alredyHasMap = this._mapRecords.has(targetNode);
		const targetNodeRecords: Map<Node, IRegisteredMutationRecord> = alredyHasMap ? this._mapRecords.get(targetNode)! : new Map();
		if (!alredyHasMap) this._mapRecords.set(targetNode, targetNodeRecords);

		if (targetNodeRecords.has(eventNode)) targetNodeRecords.delete(eventNode);

		targetNodeRecords.set(eventNode, {
			...record,
			dependentOn: null,
			meta: { timeNow: performance.now(), currentUrl: window.location.href },
		});
	}

	pause() {
		this.isRunning = false;
	}

	start() {
		this.isRunning = true;
	}

	isCoDependentNode(node: Node, baseLineTimeStamp: number | null = null, clickRecords: Array<MouseEvent>) {
		return this.getParentDOMMutations(node, baseLineTimeStamp, clickRecords).length > 0;
	}

	reset() {
		this._mapRecords.clear();
		this.resetTime = Date.now();
	}

	getParentDOMMutations(node: Node, baseLineTimeStamp: number | null = null, clickRecords: Array<any>): Array<IRegisteredMutationRecord> {
		let currentNode = node;
		const list = [];

		while (document.body.contains(currentNode) && currentNode != document.body) {
			if (this._mapRecords.has(currentNode) && !(currentNode instanceof SVGElement)) {
				const tmp = this._mapRecords.get(currentNode)!;
				console.log("Values are", Array.from(tmp.values()));
				list.push(
					Array.from(tmp.values())
						.filter((a) => (baseLineTimeStamp ? a.meta.timeNow < baseLineTimeStamp : true))
						.pop() as IRegisteredMutationRecord,
				);
			}
			currentNode = currentNode.parentNode!;
		}
		const out = list
			.reverse()
			.filter((item, index, array) => {
				const timeOfEventStart = parseInt(item.key.split("__")[2]);
				const ls = clickRecords.map((record) => ({
					out: Math.abs(record.timestamp - timeOfEventStart),
					recordTimeStamp: record.timestamp,
					currentTimeStamp: timeOfEventStart,
					item: item.key,
				}));

				console.log("Here's the record", ls);

				return (
					array.findIndex((currentItem) => currentItem.eventNode === item.eventNode) === index &&
					(item.targetNode !== document.body || item.targetNode !== document.body) &&
					document.body.contains(item.targetNode) &&
					document.body.contains(item.eventNode) &&
					timeOfEventStart > this.resetTime &&
					clickRecords.findIndex((record) => Math.abs(record.timestamp - timeOfEventStart) < 600) === -1
				);
			})
			.sort((a, b) => {
				return getElementDepth(a.eventNode) - getElementDepth(b.eventNode);
			});

		return out;
	}
}

export { RelevantHoverDetection };
