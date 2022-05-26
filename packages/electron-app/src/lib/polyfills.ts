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
		console.log(args[2]);
	}
}

class StorageManagerPolyfill {
	uploadAsset(...args) {
		return "random.jpg";
	}
	uploadBuffer(buffer, destionation) {
		return "uploadBuffer.jpg";
	}
	upload(filePath, destination) {
		return "upload.jpg";
	}
	remove(filePath) {
		return "remove.jpg";
	}
}

export { GlobalManagerPolyfill, LogManagerPolyfill, StorageManagerPolyfill };
