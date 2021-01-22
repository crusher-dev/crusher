export interface SelectorData {
	value: String;
	type: String;
	uniquenessScore: Number;
	meta?: object;
}

export interface UniqueSelectorResult {
	mostUniqueSelector: SelectorData;
	list: SelectorData[];
}
