export enum TOAST_TYPE {
	ERROR = "ERROR",
	INFO = "INFO",
	SUCCESS = "SUCCESS",
}

export interface iToastInfo {
	type: TOAST_TYPE;
	message: string;
}
