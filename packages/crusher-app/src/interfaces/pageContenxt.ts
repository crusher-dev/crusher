import { NextPageContext } from "next";

export interface iPageContext extends NextPageContext {
	metaInfo: {
		headers: any;
		cookies: any;
	};
}
