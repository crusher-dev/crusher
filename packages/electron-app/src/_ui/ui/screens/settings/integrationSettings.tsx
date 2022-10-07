import React from "react";
import { css } from "@emotion/react";
import { HoverButton } from "../../components/hoverButton";
import { GithubIcon, ResetIcon, TickIcon } from "electron-app/src/_ui/constants/icons";
import { TextBlock } from "@dyson/components/atoms";
import { remote } from "electron";
import { shell } from "electron/common";
import { linkOpen, resolveToBackend } from "electron-app/src/utils/url";
import { useStore } from "react-redux";
import { getCurrentSelectedProjct, getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { resolveToFrontend } from "electron-app/src/utils/url";
import useSWR from "swr";
import { getIntegrationsAPIRequest, removeGithubIntegration, removeSlackIntegration } from "electron-app/src/_ui/api/projects/integrations";
import useRequest from "electron-app/src/_ui/utils/useRequest";
import axios from "axios";
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";

const SlackIntegrationItem = () => {
    const store = useStore();
	const { data: integrations } = useRequest(getIntegrationsAPIRequest);
    const [connected, setConnected] = React.useState(false);

    React.useEffect(() => {
        if(integrations?.slackIntegration) {
            const slackIntegrationMeta = integrations.slackIntegration?.meta;

			if (slackIntegrationMeta?.channel) {
				const normalChannel = slackIntegrationMeta.channel.normal;
				const alertChannel = slackIntegrationMeta.channel.alert;
                setConnected([normalChannel?.name ? normalChannel.name : "", alertChannel?.name ? alertChannel.name : ""].join(", "));
			}

        }
    }, [integrations]);

    const handleConnect = () => {
        const userInfo = getUserAccountInfo(store.getState());
        const projectId = getCurrentSelectedProjct(store.getState() as any);
        
		if(userInfo?.token) {
            linkOpen(resolveToFrontend(`${projectId}/settings/integrations?laccess_token=` + userInfo.token + '&item=slack'));
        }
    };

    const handleRemove = () => {
        axios(removeSlackIntegration());
        setConnected(false);
    };
    return (
        <div css={IntegrationItemCss} className="flex items-center py-24 pb-16">
            <div className={"flex-1"}>
                <TextBlock weight={600} fontSize={15} color="#A1A1A1">get alerts on slack</TextBlock>
                <TextBlock fontSize={12} color="#6B6B6B" className="mt-6">We post notifications to Slack on event trigger.</TextBlock>
            </div>
            <div className={"ml-auto"}>
                {connected ? (
                    <div className={"flex items-center"}>
                        <div className={'flex items-center'}>
                            <TickIcon css={tickIconCss}/>
                            <TextBlock className={"ml-6"} color={"#6B6B6B"} fontSize={12}>{connected}</TextBlock>
                        </div>
                        <HoverButton className={"ml-12"} onClick={handleRemove} css={buttonCss} width={70} height={24} >remove</HoverButton>
                    </div>
                ): (
                    <HoverButton onClick={handleConnect} css={buttonCss} width={106} height={32} >Connect</HoverButton>
                )}
            </div>
        </div>
    );
}
const tickIconCss = css`
    width: 9.79px;
    height: 7.8px;
`;
const GithubIntegrationItem = () => {
    const store = useStore();
	const { data: integrations } = useRequest(getIntegrationsAPIRequest);
    const [connected, setConnected] = React.useState(false);

    React.useEffect(() => {
        if(integrations?.gitIntegration) {
            console.log("Git integration", integrations.gitIntegration);
            setConnected(true);
        }
    }, [integrations]);

    const handleLink = () => {
        const userInfo = getUserAccountInfo(store.getState());
        const projectId = getCurrentSelectedProjct(store.getState() as any);

		if(userInfo?.token) {
            linkOpen(resolveToFrontend(`${projectId}/settings/integrations?laccess_token=` + userInfo.token + '&item=github'));
        }
    };

    const handleUnlink = () => {
        axios(removeGithubIntegration(integrations.gitIntegration.id)());
        setConnected(false);
    }

    return (
        <div css={IntegrationItemCss} className="flex items-center py-24 pb-16">
            <div css={css`height: 100%;`}>
                <GithubIcon css={githubIconCss} />
            </div>
            <div className={"flex-1 ml-12"}>

                <TextBlock weight={600} fontSize={15} color="#A1A1A1">link crusher to git repo</TextBlock>
                <TextBlock fontSize={12} color="#6B6B6B" className="mt-6">get status check with each commit</TextBlock>

            </div>
            <div className={"ml-auto"}>

            {connected ? (
                    <div className={"flex items-center"}>
                        <div className={'flex items-center'}>
                            <TickIcon css={tickIconCss}/>
                            <TextBlock className={"ml-6"} color={"#6B6B6B"} fontSize={12}>{integrations.gitIntegration.repoName}</TextBlock>
                        </div>
                        <HoverButton className={"ml-12"} onClick={handleUnlink} css={buttonCss} width={70} height={24} >remove</HoverButton>
                    </div>
                ): (
                    <HoverButton onClick={handleLink} css={buttonCss} width={106} height={32}>
                        <GithubIcon css={css`width: 13px; height: 13px;`} />
                        <span className={"ml-6"}>link</span>
                    </HoverButton>
                )}

     
            </div>
        </div>
    );
}

const githubIconCss = css`width: 16px; height: 16px;`;
const IntegrationItemCss = css`
    :first-of-type {
        border-bottom: 0.5px solid rgba(217, 217, 217, 0.07);
    }
`;
const buttonCss = css`
    background: rgba(255, 255, 255, 0.04);
    border: 0.5px solid #222222;
    border-radius: 8px;

    font-weight: 600;
    font-size: 13px;
    letter-spacing: -0.003em;
    padding-top: 1px;
`;

const IntegrationSettings = () => {

    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <div css={containerCss}>
            <div className={"flex"}>
                <div className={"flex-1"}>
                    <div css={headingCss}>Integration</div>
                    <div className={"mt-6"} css={descriptionCss}>intergrate services to enhance your workflow</div>
                </div>
                <div className={"ml-auto"}>
                        <HoverButton onClick={handleRefresh} css={buttonCss} width={32} height={32} title={"refresh"}>
                            <ResetIcon className={"mb-4"} css={css`width: 12px; height: 12px; `}/>
                        </HoverButton>
                </div>
            </div>
  
            <div className="mt-10">
                <SlackIntegrationItem />
                <GithubIntegrationItem />
            </div>
        </div>
    )
};

const containerCss = css`
    font-size: 14px;
    color: #fff;
`;
const headingCss = css`
    font-weight: 700;
    font-size: 15px;
    color: #C9C9C9;


    letter-spacing: -0.003em;
`;
const descriptionCss = css`
    font-size: 12.5px;
    line-height: 14px;

    letter-spacing: .3px;
    color: #6B6B6B;
`;
export { IntegrationSettings };