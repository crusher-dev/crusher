import React, { RefObject, useEffect, useRef } from "react";

interface iElementCustomScriptModalContent {
	onClose?: any;
	deviceIframeRef: RefObject<HTMLIFrameElement>;
}
const ElementCustomScriptModalContent = (
	props: iElementCustomScriptModalContent,
) => {
	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);

	useEffect(() => {
		if (codeTextAreaRef.current) {
			codeTextAreaRef.current!.value =
				"function validate(element){\n  /* Write your logic here, and return true or false */\n}";
			const editor = (window as any).CodeMirror.fromTextArea(
				codeTextAreaRef.current!,
				{
					mode: "javascript",
					theme: "mdn-like",
				},
			);

			editor.on("keyup", function (cm: any, event: any) {
				if (
					!cm.state
						.completionActive /*Enables keyboard navigation in autocomplete list*/ &&
					event.keyCode != 13
				) {
					/*Enter - do not open autocomplete list just after item has been selected in it*/
					(window as any).CodeMirror.commands.autocomplete(cm, null, {
						completeSingle: false,
					});
				}
			});

			editor
				.getDoc()
				.markText(
					{ line: 0, ch: 0 },
					{ line: 1 },
					{ readOnly: true, inclusiveLeft: true },
				);

			editor
				.getDoc()
				.markText(
					{ line: 2, ch: 0 },
					{ line: 2, ch: 1 },
					{ readOnly: true, inclusiveLeft: true, inclusiveRight: true },
				);
		}
	}, [codeTextAreaRef]);
	return (
		<div style={containerCSS}>
			<textarea id={"custom_script"} ref={codeTextAreaRef}></textarea>
		</div>
	);
};

const containerCSS = {
	paddingTop: "1rem",
};
export { ElementCustomScriptModalContent };
