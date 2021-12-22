// create a function to select first word of content-editable div
function selectFirstWordOfContentEdtiableDiv(element) {
	element.focus();
	document.execCommand("selectAll", false, null);
	const sel = window.getSelection();
	const range = sel.getRangeAt(0);
	console.log(range);
	range.setStart(sel.baseNode, 0);
	range.setEnd(sel.baseNode, 0);
	sel.modify("extend", "forward", "word");
}

selectFirstWordOfContentEdtiableDiv(document.querySelector("[contenteditable]"));
