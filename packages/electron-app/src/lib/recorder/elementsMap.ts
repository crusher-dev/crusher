import { v4 as uuidv4 } from "uuid";

class ElementsIdMap {
	static map: Map<Node, string> = new Map();

	static getUniqueId(node: Node): string {
		if (this.map.has(node)) return this.map.get(node);
		const id = uuidv4();
		this.map.set(node, id);

		if (node instanceof HTMLElement) {
			console.log("CRUSHER_SAVE_ELEMENT_HANDLE", node, id);
		}
		return id;
	}
}

export { ElementsIdMap };
