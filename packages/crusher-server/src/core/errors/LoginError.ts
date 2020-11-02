import { HttpError } from 'routing-controllers';

export default class LoginError extends HttpError {
	operationName: any;
	args: any;

	constructor(operationName, args = []) {
		super(500);
		Object.setPrototypeOf(this, LoginError.prototype);
		this.operationName = operationName;
		this.args = args; // can be used for internal logging
	}

	toJSON() {
		return {
			status: this.httpCode,
			failedOperation: this.operationName,
		};
	}
}
