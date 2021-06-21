function createRange(
	node: Node,
	chars: { count: number },
	range: Range | null = null,
): Range {
	if (!range) {
		range = document.createRange();
		range.selectNode(node);
		range.setStart(node, 0);
	}

	if (chars.count === 0) {
		range.setEnd(node, chars.count);
	} else if (node && chars.count > 0) {
		if (node.nodeType === Node.TEXT_NODE) {
			if (node.textContent!.length < chars.count) {
				chars.count -= node.textContent!.length;
			} else {
				range.setEnd(node, chars.count);
				chars.count = 0;
			}
		} else {
			for (let lp = 0; lp < node.childNodes.length; lp++) {
				range = createRange(node.childNodes[lp], chars, range);

				if (chars.count === 0) {
					break;
				}
			}
		}
	}

	return range;
}

function setCurrentCursorPositionInContentEditable(
	root: HTMLElement,
	chars: number,
) {
	if (chars >= 0) {
        const range = createRange(root.parentNode!, {
			count: chars,
		});

        if (range) {
			range.collapse(false);
			selection!.removeAllRanges();
			selection!.addRange(range);
		}
    }
}

export { setCurrentCursorPositionInContentEditable };
