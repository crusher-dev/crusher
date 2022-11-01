import { css } from "@emotion/react";
import React from "react";

import { useAtom } from "jotai";
import useSWR from "swr";

import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import { getGitIntegrations } from "@constants/api";
import { useProjectDetails } from "@hooks/common";
import { GitSVG } from "@svg/onboarding";
import { connectedToGitAtom } from "./hooks";
import { LinkedRepo } from "./state/linkedRepo";
import { GithubProjectsList } from "./state/gitProjectsList";
import { ConnectGithubIntegration } from "./state/connectGithubIntegration";

function GithubIntegration() {
	const [connectedToGit] = useAtom(connectedToGitAtom);
	const { currentProject: project } = useProjectDetails();
	const { data: linkedRepo } = useSWR(getGitIntegrations(project?.id));

	const hadLinkedRepo = !!linkedRepo?.linkedRepo;
	return (
		<div className={"flex flex-col justify-between items-start mt-44 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div className={"flex"}>
					<GitSVG
						css={css`
							path {
								fill: #fff !important;
							}
						`}
						height={28}
						width={28}
					/>
					<div className={"ml-16"}>
						<Heading type={2} fontSize={"14"} className={"mb-8"}>
							Git Integration
						</Heading>
						<TextBlock fontSize={12} color={"#787878"}>
							Integrate with Github, Gitlab to get checks with each commit
						</TextBlock>
					</div>
				</div>
			</div>

			<Conditional showIf={hadLinkedRepo}>
				<LinkedRepo />
			</Conditional>
			<Conditional showIf={!hadLinkedRepo}>
				<Conditional showIf={!connectedToGit?.type}>
					<ConnectGithubIntegration />
				</Conditional>
				<Conditional showIf={!!connectedToGit}>
					<GithubProjectsList />
				</Conditional>
			</Conditional>
		</div>
	);
}

export { GithubIntegration };