const eventMutationArr: iRegisteredMutationRecord[] = [];

interface iRegisteredMutationRecord {
	eventNode: Node;
	eventType: string;
	targetNode: Node;
	targetChanges: any;
	dependentOn: iRegisteredMutationRecord | null;
}

export function pushToEventMutationArr(eventStackMapKey: string, targetNode: any, targetChanges: any) {
	const eventNode = (window as any).crusherMap[eventStackMapKey];
	if (!eventNode) return;
	const dependentOn = getEventNodeInCaseDOMWasMutated(eventNode);
	eventMutationArr.push({
		eventNode,
		eventType: "hover",
		targetNode,
		targetChanges,
		dependentOn,
	});
}

export function getEventNodeInCaseDOMWasMutated(currentActionNode: Node) {
	const relevantEvents = eventMutationArr.filter((e) => {
		return e.targetNode === currentActionNode || e.targetNode.contains(currentActionNode);
	});
	return relevantEvents.length > 0 ? relevantEvents[relevantEvents.length - 1] : eventMutationArr[0];
}
