// This class act as communcation channel between runner-utils
// and test-runner.

class CommunicationChannel {
	_listeners: any;

	constructor() {
		this._listeners = {};
	}

	addListener(event: string, listener: (...args: any[]) => void) {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}
		this._listeners[event].push(listener);
	}

	on(event: string, listener: (...args: any[]) => void) {
		this.addListener(event, listener);
	}

	removeListener(event: string, listener: (...args: any[]) => void) {
		if (!this._listeners[event]) {
			return;
		}
		const index = this._listeners[event].indexOf(listener);
		if (index > -1) {
			this._listeners[event].splice(index, 1);
		}
	}

	removeAllListeners(event?: string) {
		if (event) {
			delete this._listeners[event];
		} else {
			this._listeners = {};
		}
	}

	emit(event: string, ...args: any[]) {
		if (!this._listeners[event]) {
			return;
		}
		this._listeners[event].forEach((listener) => {
			listener(...args);
		});
	}
}

export { CommunicationChannel };
