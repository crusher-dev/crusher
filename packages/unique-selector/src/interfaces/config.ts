export interface UserConfiguration {
	root?: HTMLElement;
	regexMatch?: String;
	findOnlyUnique?: Boolean;
	maxDepth?: Number;
	optimizedMinLength?: Number;
	thresholdComputation?: Number; // No of computation to find particular elements
}

export interface Configuration {
	root: HTMLElement;
	regexMatch?: String;
	findOnlyUnique: Boolean;
	maxDepth: Number;
	optimizedMinLength: Number;
	thresholdComputation: Number; // No of computation to find particular elements
}

export const DefaultConfiguration: Configuration = {
	// @ts-ignore
	root: document,
	// maxDepth: 10,
	// optimizedMinLength: 3,
	// thresholdComputation: 1000
};
