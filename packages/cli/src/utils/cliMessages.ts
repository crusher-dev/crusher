export const Message = (chalk, firstMessage, secondMessage, shouldShowInEveryService: boolean = false) => {
	console.log(chalk(firstMessage), ' ', secondMessage + (shouldShowInEveryService ? " " : ""));
};

export const BlankMessage = (firstMessage, shouldShowInEveryService: boolean = false) => {
	console.log('          ', firstMessage + (shouldShowInEveryService ? " " : ""));
};
