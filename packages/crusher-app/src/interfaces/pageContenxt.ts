import { NextApiRequest, NextApiResponse, NextPageContext } from "next";

export interface iPageContext extends NextPageContext {
	req?: NextApiRequest;
	res?: NextApiResponse;
	metaInfo: {
		headers: any;
		cookies: any;
	};
}
