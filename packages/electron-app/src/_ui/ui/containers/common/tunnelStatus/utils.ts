import { shell } from "electron";

type status = "initializing" | "tunnel_error" | "working" |  "not_configured"

export const getStatus = ({isProxyDisabled,isProxyWorking,proxyIsInitializing}) : status=>{
    if(isProxyDisabled && !proxyIsInitializing) return "not_configured";
    if(proxyIsInitializing) return "initializing";
    if(isProxyDisabled) return "tunnel_error";
	return "working";
}

export const openConfig = (projectConfigFile) => {
    if (!projectConfigFile) {
        alert("Project not linked locally");
        return;
    }
    shell.openPath(projectConfigFile);
};
