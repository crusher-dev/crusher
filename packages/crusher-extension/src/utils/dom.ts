export class DOM {
	static isElement(element: any) {
		return element instanceof Element || element instanceof HTMLDocument;
	}

	static removeAllTargetBlankFromLinks() {
		const { links } = document;
		let i;
		let length;

		for (i = 0, length = links.length; i < length; i++) {
			links[i].target == "_blank" && links[i].removeAttribute("target");
		}
	}

	static disableAllUserEvents(eventExceptions: {
		[eventName: string]: any;
	}): () => void {
		console.debug("Disabling all user events");

		const events = [
			"click",
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
			document.addEventListener(events[i], handler, true);
		}
		return () => {
			for (let i = 0, l = events.length; i < l; i++) {
				document.removeEventListener(events[i], handler, true);
			}
		};
	}
}

export interface iPageSeoMeta {
	[metaName: string]: { name: string; value: string };
}

export function getAllSeoMetaInfo() {
	const metaElements: NodeListOf<HTMLMetaElement> = document.querySelectorAll(
		"meta",
	);
	const metaTagsValuesMap: iPageSeoMeta = (new Array(
		metaElements,
	) as any).reduce((prev: any, current: HTMLMetaElement) => {
		const name = current.getAttribute("name");
		if (!name) {
			return prev;
		}
		return { ...prev, [name]: { name, value: current.content } };
	}, {});

	return metaTagsValuesMap;
}
