// for (i = 0, length = links.length; i < length; i++) {
// 	links[i].target == "_blank" && links[i].removeAttribute("target");
// }
export class DOM {
	static isElement(element: any) {
		return element instanceof Element || element instanceof HTMLDocument;
	}

	static removeAllTargetBlankFromLinks() {}

	static disableAllUserEvents(eventExceptions: { [eventName: string]: any }): () => void {
		console.debug("Disabling all user events");

		const events = [
			"contextmenu",
			"dblclick",
			"mousedown",
			"mouseenter",
			"mouseleave",
			"mousemove",
			"mouseover",
			"mouseout",
			"mouseup",
			"keydown",
			"keypress",
			"keyup",
			"blur",
			"change",
			"focus",
			"focusin",
			"focusout",
			"input",
			"invalid",
			"reset",
			"search",
			"select",
			"submit",
			"drag",
			"dragend",
			"dragenter",
			"dragleave",
			"dragover",
			"dragstart",
			"drop",
			"copy",
			"cut",
			"paste",
			"mousewheel",
			"wheel",
			"touchcancel",
			"touchend",
			"touchmove",
			"touchstart",
		];

		const eventExceptionNames = Object.keys(eventExceptions);

		const handler = (event: Event) => {
			event.stopPropagation();
			event.preventDefault();

			if (eventExceptionNames.includes(event.type)) {
				eventExceptions[event.type](event);
			}
			return false;
		};

		for (let i = 0, l = events.length; i < l; i++) {
			window.addEventListener(events[i], handler, true);
		}
		return () => {
			for (let i = 0, l = events.length; i < l; i++) {
				window.removeEventListener(events[i], handler, true);
			}
		};
	}
}

export interface iPageSeoMeta {
	[metaName: string]: { name: string; value: string };
}

export function getAllSeoMetaInfo() {
	const metaElements: HTMLMetaElement[] = (document.querySelectorAll("meta") as any).slice();
	const metaTagsValuesMap: iPageSeoMeta = metaElements.reduce((prev: any, current: HTMLMetaElement) => {
		const name = current && typeof current.getAttribute === "function" ? current.getAttribute("name") : null;
		if (!name) {
			return prev;
		}
		return { ...prev, [name]: { name, value: current.content } };
	}, {});

	return metaTagsValuesMap;
}

export function openLinkInNewTab(url: string) {
	const link = document.createElement("a");
	link.href = url;
	link.target = "_blank";

	const event = new window.MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: true,
	});

	link.dispatchEvent(event);
}

function getElementTagNameLowerCase(element: HTMLElement) {
	return element.tagName.toLowerCase();
}
export function getElementDescription(node: Node): string | null {
	if (node.nodeType !== node.ELEMENT_NODE) {
		return null;
	}
	const htmlElement = node as HTMLElement;
	const tagNameNormalized = getElementTagNameLowerCase(htmlElement);
	const idStep = htmlElement.id ? `#${htmlElement.id}` : null;
	if (idStep) {
		return `${tagNameNormalized}${idStep}`;
	}
	const classStepsArr = htmlElement.classList.length
		? htmlElement.classList
				.toString()
				.split(" ")
				.map((c) => `.${c}`)
		: null;
	if (classStepsArr) {
		return `${tagNameNormalized}${classStepsArr.join("")}`;
	}

	return tagNameNormalized;
}
