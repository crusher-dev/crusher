import { css } from "@emotion/react";
import { useState } from "react";
import React from "react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import AddProjectModal from "@ui/containers/dashboard/AddProject";
import { SettingsLayout } from "@ui/layout/SettingsBase";
import { GithubIntegration } from "./github";
import { VercelIntegration } from "./vercel";
import { SlackIntegration } from "./slack";
import { CICDIntegration } from "./ci-cd";
import { WebHookIntegration } from "./webhook";

export const Integrations = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedSection, setShowSelectedSection] = useState(null);

	React.useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const section = query.get("item");
		if (section) {
			setShowSelectedSection(section);
		}
	});

	if (selectedSection) {
		return (
			<SettingsLayout hideSidebar={true}>
				<div className={"text-24 mb-100"} css={maxWidthContainer}>
					<Heading type={1} fontSize={"18"} className={"mb-12"}>
						Integrations
					</Heading>
					<TextBlock fontSize={"12.5"} className={"mb-24"} color={"#787878"}>

					</TextBlock>
					<hr css={basicHR} />
					{selectedSection === "slack" ? (<SlackIntegration />) : ""}
					{selectedSection === "github" ? (<GithubIntegration />) : ""}
					{selectedSection === "vercel" ? (<VercelIntegration />) : ""}
				</div>
			</SettingsLayout>
		)
	}
	return (
		<SettingsLayout>
			<Conditional showIf={showModal}>
				<AddProjectModal onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Heading type={1} fontSize={"18"} className={"mb-12"}>
					Integrations
				</Heading>
				<TextBlock fontSize={"13"} className={"mb-24"} color={"#787878"}>
					Integrate crusher in your current workflow
				</TextBlock>
				<hr css={basicHR} />
				<SlackIntegration />

				<hr css={basicHR} />
				<GithubIntegration />
				<hr css={basicHR} className={"mt-40"} />
				<VercelIntegration/>
				<hr css={basicHR} className={"mt-40"} />

				<WebHookIntegration />
				<hr css={basicHR} className={"mt-24 mb-24"} />
				<CICDIntegration />
				{/* <CiIntegration /> */}
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
