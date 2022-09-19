
/*
	A function to replace text within outer brackets, counting the number of brackets
	e.g.
		"Click on [input[type="text"]] [https://google.com]" => "Click on (input[type="text"]) (https://google.com)"
		"Navigate to [https://google.com]" => "Navigate to (https://google.com)"
*/
let parseStepNameText = (text: string): Array<{ type: "normal" | "highlight"; value: string }> => {
	let count = 0;
	let start = 0;
	let end = 0;
	let newText = "";
	let finalArr = [];
	for (let i = 0; i < text.length; i++) {
		if (text[i] === "[") {
			count++;
			if (count === 1) {
				start = i;
				finalArr.push({ type: "normal", value: newText });
				newText = "";
			}
		} else if (text[i] === "]") {
			count--;
			if (count === 0) {
				end = i;
				finalArr.push({ type: "highlight", value: text.substring(start + 1, end) });
			}
		} else if (count === 0) {
			newText += text[i];
		}
	}
	if (count !== 0) {
		finalArr.push({ type: "highlight", value: text.substring(start + 1) });
		newText = "";
	}
	if (newText && newText.length) {
		finalArr.push({ type: "normal", value: newText });
	}
	return finalArr;
};

const TextHighlighter = ({text}) => {
    return parseStepNameText(text).map((a) => {
        if (a.type === "highlight") {
            return (
                <span className="highlight-box" title={a.value}>
                    {a.value.length > 15 ? `${a.value.substring(0, 15)}...` : a.value}
                </span>
            );
        } else {
            return <span title={a.value}>{a.value}</span>;
        }
  });
};
export { parseStepNameText, TextHighlighter };