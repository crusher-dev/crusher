import React from "react";
import { css } from "@emotion/react";
import { HoverButton } from "../../components/hoverButton";
import { GithubIcon } from "electron-app/src/_ui/constants/icons";
import { TextBlock } from "@dyson/components/atoms";

const SlackIntegrationItem = () => {
    return (
        <div css={IntegrationItemCss} className="flex items-center py-24 pb-16">
            <div className={"flex-1"}>
                <TextBlock weight={600} fontSize={15} color="#A1A1A1">get alerts on slack</TextBlock>
                <TextBlock fontSize={12} color="#6B6B6B" className="mt-6">get alerts on slack</TextBlock>
            </div>
            <div className={"ml-auto"}>
                <HoverButton css={buttonCss} width={106} height={32} >Connect</HoverButton>
            </div>
        </div>
    );
}

const GithubIntegrationItem = () => {
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
                <HoverButton css={buttonCss} width={106} height={32}>
                    <GithubIcon css={css`width: 13px; height: 13px;`} />
                    <span className={"ml-6"}>link</span>
                </HoverButton>
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
    return (
        <div css={containerCss}>
            <div css={headingCss}>Integration</div>
            <div className={"mt-6"} css={descriptionCss}>use crusher to enhance your worflow</div>

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