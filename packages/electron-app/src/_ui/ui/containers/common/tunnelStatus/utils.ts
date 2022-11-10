type status = "initializing" | "tunnel_error" | "working" |  "not_configured"

export const getStatus = ({isProxyDisabled,isProxyWorking,proxyIsInitializing}) : status=>{
    return "not_configured"
    if(isProxyDisabled && !proxyIsInitializing) return "not_configured";
    if(proxyIsInitializing) return "initializing";

    if(isProxyDisabled) return "tunnel_error";
	return "working";
}