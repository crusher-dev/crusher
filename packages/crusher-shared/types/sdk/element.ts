export interface ICrusherSDKElement {
	click: () => Promise<boolean>;
	hover: () => Promise<boolean>;
	focus: () => Promise<boolean>;
	fill: (text: string) => Promise<boolean>;
	type: (text: string, options: { delay?: number }) => Promise<boolean>;
}
