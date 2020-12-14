export class DOM {
	static removeAllTargetBlankFromLinks() {
		const { links } = document;
		let i;
		let length;

		for (i = 0, length = links.length; i < length; i++) {
			links[i].target == "_blank" && links[i].removeAttribute("target");
		}
	}
}
