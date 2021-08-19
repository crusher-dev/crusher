const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

if (IS_DEVELOPMENT) {
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}
