import { css } from "@emotion/react";
import { useState } from "react";


import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import AddProjectModal from "@ui/containers/dashboard/AddProject";
import { SettingsLayout } from "@ui/layout/SettingsBase";

import Toggle from 'dyson/src/components/atoms/toggle/toggle';
import { GithubSVG } from '@svg/social';

function GitIntegration() {
	return <div className={'flex flex-col justify-between items-start mt-40 mb-24'}>
		<div className={'flex justify-between items-center w-full'}>
			<div>
				<Heading type={2} fontSize={'14'} className={'mb-8'}>
					Git Integration
				</Heading>
				<TextBlock fontSize={12} className={''}>
					Make sure you have selected all the configuration you want
				</TextBlock>
			</div>
			<Toggle></Toggle>
		</div>
		<div>
			<TextBlock fontSize={13} className={"mt-32"}>
				Add from
			</TextBlock>
			<div className={"flex mt-8"}>
				<Button size={"small"} bgColor={"tertiary-dark"} className={"mr-16"}>
					<div className={"flex"}>
						<GithubSVG/>
						<span className={"mt-2 ml-8"}>
					Github
				</span>
					</div>
				</Button>

				<Button size={"small"} bgColor={"tertiary-dark"} >
				<span className={"mt-1"}>
					Gitalb
				</span>
				</Button>


			</div>
		</div>
	</div>;
}
function SlackIntegration() {
	return <div className={'flex justify-between items-start mt-40 mb-24'}>
		<div className={'flex justify-between items-center w-full'}>
			<div className={"flex"}>
				<img src={"/svg/slack-icon.svg"} width={"24rem"}/>
				<div className={"ml-20"}>
					<Heading type={2} fontSize={'14'} className={'mb-8'}>
						Slack Integration
					</Heading>
					<TextBlock fontSize={12} className={''}>
						Make sure you have selected all the configuration you want
					</TextBlock>
				</div>
			</div>
			<Toggle></Toggle>
		</div>

	</div>;
}

export const Integrations = () => {
	const [showModal, setShowModal] = useState(false);
	return (
		<SettingsLayout>
			<Conditional showIf={showModal}>
				<AddProjectModal onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Heading type={1} fontSize={"18"} className={"mb-12"}>
					Integrations
				</Heading>
				<TextBlock fontSize={"12.5"} className={"mb-24"}>
					Make sure you have selected all the configuration you want
				</TextBlock>
				<hr css={basicHR} />
				<SlackIntegration/>
				<hr css={basicHR} />
				<GitIntegration/>

			</div>
		</SettingsLayout>
	);
};



const maxWidthContainer = css`
	width: 680rem;
	margin: 0 auto;
`;

const basicHR = css`
	background: rgba(255, 255, 255, 0.015);
	border-top: 1px solid rgba(196, 196, 196, 0.06);
`;
