export enum RequestMethod {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
}

export interface RequestOptions {
	method?: RequestMethod;
	headers?: any;
	payload?: any;
}
