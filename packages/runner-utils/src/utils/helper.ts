const generateScreenshotName = (selector: string, stepIndex: number): string => {
	return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
};

export { generateScreenshotName };
