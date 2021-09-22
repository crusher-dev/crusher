export class GlobalManagerPolyfill {
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

export class LogManagerPolyfill {
	logStep(...args) {
		console.log(args[2]);
	}
}

export class StorageManagerPolyfill {
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
