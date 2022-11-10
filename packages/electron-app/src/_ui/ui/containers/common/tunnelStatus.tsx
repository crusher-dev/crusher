import React from "react";
import { css } from "@emotion/react";
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip";
import { shell } from "electron";
import {  getIsProxyInitializing, getProxyState } from "electron-app/src/store/selectors/app";
import { useSelector } from "react-redux";

import { getCurrentProjectConfigPath } from "electron-app/src/_ui/utils/project";
import { CloudIcon } from "./tunnelStatus/components/cloudIcon";
import { LinkPointer } from "../../components/LinkPointer";
import { getStatus } from "./tunnelStatus/utils";
import { Conditional } from "@dyson/components/layouts";

const openConfig = (projectConfigFile) => {
    if (!projectConfigFile) {
        alert("Project not linked locally");
        return;
    }
    shell.openPath(projectConfigFile);
};

const NotConfigured = ()=>{
    return (
        <div className={"flex items-center"}>
            Not configured 
            <div className={"ml-8"} css={lineCSS}></div>
            <LinkPointer css={pointerCSS} onClick={openConfig} className={"ml-8"}>Open config</LinkPointer>
        </div>
    )
}

const lineCSS = css`min-width: 1px; height: 16px; background: rgba(255,255,255,0.10)`
const pointerCSS = css`.pointer-icon { path { fill: rgba(255, 255, 255, 0.35); } } `
const separatorCSS = css`min-width: 2px; height: 20px; background: rgba(255,255,255,0.15)`

const ProxyToolTip = ({status})=>{
    const [projectConfigFile, setProjectConfigFile] = React.useState(null);
	React.useEffect(() => {
		const projectConfigFile = getCurrentProjectConfigPath();
		setProjectConfigFile(projectConfigFile);
	}, []);

    return (
        <div className={"flex items-center"}>
            <div className="mt-1">
                <Conditional showIf={status === "initializing"}>
                    initializing
                </Conditional>
                <Conditional showIf={status === "tunnel_error"}>
                    error with tunnel
                </Conditional>
                <Conditional showIf={status === "not_configured"}>
                    tunnel not configured
                </Conditional>
            </div>
             <div className={"ml-8"} css={lineCSS}></div>
            <LinkPointer css={pointerCSS} onClick={openConfig.bind(this,projectConfigFile)} className={"ml-8"}>config</LinkPointer>
        </div> 
    )
}

const TunnelsList = ()=>{
    const proxyState = useSelector(getProxyState);
    const seperator = (<div className={"ml-8"} css={separatorCSS}></div>);

    const links = Object.entries(proxyState).map((a: any) => {
        return (
            <>
                {seperator}
                <LinkPointer
                    css={pointerCSS}
                    onClick={() => shell.openExternal(a[1].tunnel)}
                    className={"ml-8"}>
                    {a[0]}
                </LinkPointer>
            </>
        )
    });
    return (
        <div className={"flex items-center"}>
            active
            {links}
        </div>
    );
}

export function TunnelStatus({}) {
	const proxyState = useSelector(getProxyState);
    const proxyIsInitializing = useSelector(getIsProxyInitializing);
    const isProxyWorking = Object.keys(proxyState).length;
	const isProxyDisabled = !proxyIsInitializing && !isProxyWorking;


    const proxyStatus = getStatus({
        isProxyDisabled, isProxyWorking,proxyIsInitializing
    })

  return (
                    <Tooltip content={
                        proxyStatus === "working" ? 
                        <TunnelsList/>
                        : (<ProxyToolTip status={proxyStatus}/>)
                    } placement="top" type="hover">
						<div>
                        <CloudIcon
                          isProxyDisabled={isProxyDisabled}
                          isProxyWorking={isProxyWorking}
                          proxyIsInitializing={proxyIsInitializing}
                          css={[cloudIconCss, clickableCss]}
                        />
						</div>
					</Tooltip>
  );
}
  
const cloudIconCss = css`
	width: 16px;
	height: 11px;
`;
const clickableCss = css`
	:hover {
		opacity: 0.8;
	}
`;