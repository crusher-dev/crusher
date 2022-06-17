export interface iPageSeoMeta {
	[metaName: string]: { name: string; value: string };
}
export interface iSeoMetaInformationMeta {
	title: string;
	metaTags: iPageSeoMeta;
}

export interface IDeepLinkAction {
	commandName: string;
	args: any;
}
