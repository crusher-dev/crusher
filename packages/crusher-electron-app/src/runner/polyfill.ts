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
