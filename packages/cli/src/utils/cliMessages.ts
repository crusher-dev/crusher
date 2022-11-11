let paddedString = (len) => Array.from({ length: len }, () => ' ').join('');

let padString = (string, desiredLength) => {
  const len = string.length; const initialLen = Math.floor((desiredLength - len) / 2);
  const rightLen = desiredLength - (len + initialLen);
  if (len > desiredLength) return string.substring(0, desiredLength);
  return paddedString(initialLen) + string + paddedString(rightLen);
};


export const Message = (chalk, firstMessage, secondMessage, shouldShowInEveryService: boolean = false) => {
	console.log(chalk(padString(firstMessage,9)), ' ', secondMessage + (shouldShowInEveryService ? " " : ""));
};

export const BlankMessage = (firstMessage, shouldShowInEveryService: boolean = false) => {
	console.log('          ', firstMessage + (shouldShowInEveryService ? " " : ""));
};

export const MessageDebug = (chalk, firstMessage, secondMessage, shouldShowInEveryService: boolean = false) => {
	console.debug(chalk(firstMessage), ' ', secondMessage + (shouldShowInEveryService ? " " : ""));
};

export const BlankMessageDebug = (firstMessage, shouldShowInEveryService: boolean = false) => {
	console.debug('          ', firstMessage + (shouldShowInEveryService ? " " : ""));
};

