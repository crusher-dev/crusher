import { css } from "@emotion/react";
import { useState } from "react";

import { Card } from "../../../../../../dyson/src/components/layouts/Card/Card";
import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import AddProjectModal from "@ui/containers/dashboard/AddProject";
import { SettingsLayout } from "@ui/layout/SettingsBase";
import useSWR from 'swr';
import { useAtom } from 'jotai';
import { currentProject } from '../../../../store/atoms/global/project';
import { getProjectEnvironments } from '@constants/api';

function EnvironmentCard({environmentData}) {
	return <Card css={projectListCard}>
		<div className={'flex justify-between items-center'}>
			<div className={'text-15'}>fds</div>
			<div className={'text-13'} id={'delete'}>
				Delete
			</div>
		</div>
	</Card>;
}

export const Environment = () => {
	const [showModal, setShowModal] = useState(false);
	const [project] = useAtom(currentProject);

	const {data: environments} = useSWR(getProjectEnvironments(project.id))
	return (
		<SettingsLayout>
			<Conditional showIf={showModal}>
				<AddProjectModal onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<div className={"flex justify-between items-start mt-16"}>
					<div>
						<Heading type={2} fontSize={16} className={"mb-12"}>
							Environments
						</Heading>
						<TextBlock fontSize={13} className={"mb-24"}>
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
							Add a environment
						</Button>
					</div>
				</div>

				<hr css={basicHR} />

				<Conditional showIf={environments.length > 0}>
					{environments.map((environmentData)=>{
						<EnvironmentCard environmentData={environmentData}/>
					})}
				</Conditional>
				<Conditional showIf={environments.length<1}>
						<div className={"text-13 mt-40"}>
							You don't have any environments yet in your project.
						</div>
				</Conditional>
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
