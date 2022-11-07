export const Message = (chalk, firstMessage, secondMessage) => {
	(console as any).logPlain("\n");
	(console as any).logPlain(chalk(firstMessage), ' ', secondMessage);
};
  
export const BlankMessage = (firstMessage) => {
	(console as any).logPlain('          ', firstMessage);
};