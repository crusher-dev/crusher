export enum RequestMethod {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
}

export interface RequestOptions {
	method?: RequestMethod;
	headers?: any;
	payload?: any;
}
