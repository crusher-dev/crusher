class ExportsManager {
	store: Map<string, any>;

	constructor(initialStore: [string, any][] = []) {
		this.store = new Map(initialStore);
	}

	has(key: string): boolean {
		return this.store.has(key);
	}

	get(key: string): any {
		return this.store.get(key);
	}

	set(key: string, value: any): boolean {
		this.store.set(key, value);
		return true;
	}

	getEntriesArr(): [string, any][] {
		return Array.from(this.store.entries());
	}
}

export { ExportsManager };
