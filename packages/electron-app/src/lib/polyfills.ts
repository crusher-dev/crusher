/*
	These polyfills are used when using runner-utils
	since the electron app is not a production environment.
*/
class GlobalManagerPolyfill {
	map;
	constructor() {
		this.map = new Map();
	}
	has(key) {
		return this.map.has(key);
	}
	get(key) {
		return this.map.get(key);
	}
	set(key, value) {
		this.map.set(key, value);
	}
}

class LogManagerPolyfill {
	logStep(...args) {
		console.log(`[Runner] ` + args[2]);
	}
}

class StorageManagerPolyfill {
	uploadAsset() {
		return "random.jpg";
	}
	uploadBuffer() {
		return "uploadBuffer.jpg";
	}
	upload() {
		return "upload.jpg";
	}
	remove() {
		return "remove.jpg";
	}
}

export { GlobalManagerPolyfill, LogManagerPolyfill, StorageManagerPolyfill };
