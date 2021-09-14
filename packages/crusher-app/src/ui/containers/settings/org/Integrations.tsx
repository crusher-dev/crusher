import { css } from "@emotion/react";
import { useState } from "react";

import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import AddProjectModal from "@ui/containers/dashboard/AddProject";
import { SettingsLayout } from "@ui/layout/SettingsBase";

import Toggle from "dyson/src/components/atoms/toggle/toggle";
import { GithubSVG } from "@svg/social";
import { Card } from "dyson/src/components/layouts/Card/Card";

function GitIntegration() {
	return (
		<div className={"flex flex-col justify-between items-start mt-40 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div>
					<Heading type={2} fontSize={"14"} className={"mb-8"}>
						Git Integration
					</Heading>
					<TextBlock fontSize={12} className={""}>
						Make sure you have selected all the configuration you want
					</TextBlock>
				</div>
			</div>
			<div
				css={css`
					display: block;
				`}
				className={"w-full"}
			>
				<Card
					className={"mt-28"}
					css={css`
						padding: 18rem 20rem 20rem;
						background: #101215;
					`}
				>
					<div
						className={"font-cera font-700 mb-8 leading-none"}
						css={css`
							font-size: 13.5rem;
							color: white;
						`}
					>
						Connect a git repository
					</div>
					<TextBlock fontSize={12} color={"#E4E4E4"}>
						Seamlessly create Deployments for any commits pushed to your Git repository.
					</TextBlock>

					<div className={"mt-12"}>
						<Button
							bgColor={"tertiary-dark"}
							css={css`
								border-width: 0;
								background: #343a41;
								//
								:hover {
									border-width: 0;
									background: #424850;
								}
							`}
						>
							<div className={"flex items-center"}>
								<GithubSVG height={"12rem"} width={"12rem"} className={"mt-1"} />
								<span className={"mt-2 ml-8"}>Github</span>
							</div>
						</Button>
					</div>
				</Card>

				<TextBlock className={"mt-16"} fontSize={"12"} color={"#A7A7A8"}>
					Learn more about login for connection
				</TextBlock>
			</div>
		</div>
	);
}
function SlackIntegration() {
	return (
		<div className={"flex justify-between items-start mt-40 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div className={"flex"}>
					<img src={"/svg/slack-icon.svg"} width={"24rem"} />
					<div className={"ml-20"}>
						<Heading type={2} fontSize={"14"} className={"mb-8"}>
							Slack Integration
						</Heading>
						<TextBlock fontSize={12} className={""}>
							Make sure you have selected all the configuration you want
						</TextBlock>
					</div>
				</div>
				<Toggle></Toggle>
			</div>
		</div>
	);
}

 const ciIntegrations = ["Gitlab", "Github"];

const ciButtonCSS = css`
  width: 100rem;
`
 const selectedCSS = css`
	background: #6b77df;
	:hover {
		background: #6b77df;
	}
`;
function CIButtons({ setSelectedCI, selectedCI }) {
	return (
		<div className={"flex"}>
			{ciIntegrations.map((item, index) => (
				<Button
					css={[selectedCI === item && selectedCSS,ciButtonCSS]}
					size={"x-small"}
					bgColor={"tertiary-outline"}
					className={"mr-20"}
					onClick={setSelectedCI.bind(this, item)}
				>
					<span className={"mt-7"} css={css`font-size: 13rem !important;`}>Github</span>
				</Button>
			))}
		</div>
	);
}

const CiIntegration = () => {
	const [selectedCI, setSelectedCI] = useState<string | null>(null);
	return (
		<div>
			<Heading type={2} fontSize={"14"} className={"mt-48 mb-8"}>
				CI Integration
			</Heading>
			<TextBlock fontSize={12} className={"mb-28"}>
				Integrate with CI of your choice
			</TextBlock>

			<TextBlock fontSize={"12.6"} className={"mb-12"} >
				Select CI
			</TextBlock>
			<CIButtons selectedCI={selectedCI} setSelectedCI={setSelectedCI} />
			<Conditional showIf={!!selectedCI}>
				<div className={"text-13 mt-36"}>
					<div className={"mb-24"}>
						1. <span className={"ml-16"}>Create and start your server.</span>
					</div>
					<div className={"mb-24"}>
						2. <span className={"ml-16"}>Expose Localtunnel.</span>
					</div>
					<div className={"mb-24"}>
						3. <span className={"ml-16"}>Copy this snipped below.</span>
					</div>
					<div className={"py-20 px-32"} css={codeBackground}>
						//code
						<br />
						ci: run dark
					</div>
				</div>
			</Conditional>
		</div>
	);
};

const codeBackground = css`
	background: #101215;
	border: 1px solid #171c24;
	border-radius: 4px;
`;
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
				<SlackIntegration />
				<hr css={basicHR} />
				<GitIntegration />
				<hr css={basicHR} className={"mt-40"} />
				<CiIntegration />
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
