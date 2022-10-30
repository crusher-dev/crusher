import { css } from "@emotion/react";
import { useState } from "react";

import { useAtom } from "jotai";

import { Card } from "../../../../../../dyson/src/components/layouts/Card/Card";
import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import AddProjectModal from "@ui/containers/dashboard/AddProject";
import { SettingsLayout } from "@ui/layout/SettingsBase";

import { projectsAtom } from "../../../../store/atoms/global/project";

export const OrgProjects = () => {
	const [showModal, setShowModal] = useState(false);
	const [projects] = useAtom(projectsAtom);
	return (
		<SettingsLayout>
			<Conditional showIf={showModal}>
				<AddProjectModal onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<div className={"flex justify-between items-start mt-16"}>
					<div>
						<Heading type={2} fontSize={"18"} className={"mb-8"}>
							Project List
						</Heading>
						<TextBlock fontSize={13} className={"mb-24"} color={"#787878"}>
							Make sure you have selected all the configuration you want
						</TextBlock>
					</div>
					<div>
						<Button
							onClick={setShowModal.bind(this, true)}
							css={css`
								width: 164rem;
							`}
						>
							Add a project
						</Button>
					</div>
				</div>

				<hr css={basicHR} />

				{projects.map((project) => {
					const { id } = project;
					return (
						<Card css={projectListCard} key={id}>
							<div className={"flex justify-between items-center"}>
								<div className={"text-15"}>{project.name}</div>
								<div className={"text-13"} id={"delete"}></div>
							</div>
						</Card>
					);
				})}
			</div>
		</SettingsLayout>
	);
};

const projectListCard = css`
	padding: 12rem 20rem;
	#delete {
		:hover {
			text-decoration: underline;
		}
	}
`;

const maxWidthContainer = css`
	width: 680rem;
	margin: 0 auto;
`;

const basicHR = css`
	background: rgba(255, 255, 255, 0.015);
	border-top: 1px solid rgba(196, 196, 196, 0.06);
`;
