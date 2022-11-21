import { v4 as uuidv4 } from "uuid";

class ElementsIdMap {
	static map: Map<Node, string> = new Map();

	static getUniqueId(node: Node): { value: string; isNew: boolean } {
		if (this.map.has(node)) {
			return { value: this.map.get(node), isNew: false };
		}
		const id = uuidv4();
		this.map.set(node, id);

		if (node instanceof HTMLElement) {
			window["crusherSdk.saveElementHandle"]({ element: node, uniqueElementId: id });
		}
		return { value: id, isNew: true };
	}
}

export { ElementsIdMap };
