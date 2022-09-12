export const Message = (chalk, firstMessage, secondMessage) => {
	console.log(chalk(firstMessage), ' ', secondMessage);
};

export const BlankMessage = (firstMessage) => {
	console.log('          ', firstMessage);
};
