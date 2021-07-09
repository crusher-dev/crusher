export interface LiveLogs {
	actionType: string;
	body: {
		message: string;
	};
	meta: {
		timeTaken: string;
		[key: string]: any;
	};
}
