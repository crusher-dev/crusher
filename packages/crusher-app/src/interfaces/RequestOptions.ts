export enum RequestMethod {
	GET = "GET",
	POST = "POST",
}

export interface RequestOptions {
	method?: RequestMethod;
	headers?: any;
	payload?: any;
}
