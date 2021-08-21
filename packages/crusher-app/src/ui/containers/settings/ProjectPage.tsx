import { SettingsLayout } from '@ui/layout/SettingsBase';
import { Heading } from 'dyson/src/components/atoms/heading/Heading';
import { css } from '@emotion/react';
import { TextBlock } from 'dyson/src/components/atoms/textBlock/TextBlock';
import { Button, Input } from 'dyson/src/components/atoms';
import { backendRequest } from '@utils/backendRequest';
import { RequestMethod } from '../../../types/RequestOptions';
import { useAtom } from 'jotai';
import { appStateAtom } from '../../../store/atoms/global/appState';
import { currentProject, projectsAtom } from '../../../store/atoms/global/project';
import { useEffect, useState } from 'react';
import projects from '@pages/settings/org/projects';
import { sendSnackBarEvent } from '@utils/notify';
import { useRouter } from 'next/router';

const deleteProject = (projectId)=>{
	return backendRequest(`/project/${projectId}/actions/delete`,{
		method: RequestMethod.POST
	})
}

const updateProjectName = (projectId,name)=>{
	return backendRequest(`/project/${projectId}/actions/update.name`,{
		method: RequestMethod.POST,
		 payload: {name}
	})
}

export const ProjectSettings = () => {
	const router = useRouter()
	const [{selectedProjectId}] = useAtom(appStateAtom);
	const [project] = useAtom(currentProject)
	const [projectsList] = useAtom(projectsAtom)
	const [projectName, setProjectName] = useState(project?.name)
	const [saveButtonDisabled,setSavebuttonDisabled] = useState(true)
	const onlyOneProject = projectsList.length<22;

	useEffect(()=>{
		const isNameSame = project?.name === projectName
		setSavebuttonDisabled(isNameSame)
	},[projectName])

	const deleteProject= async ()=>{
		if(onlyOneProject){
			sendSnackBarEvent({
				message: "Can't delete, Only one project in this org",
				type: "error"
			})
			return;
		}
		await deleteProject(selectedProjectId);

		router.push("/")
	}

	const updateProjectNameCallback= async ()=>{
		await updateProjectName(selectedProjectId,projectName);

		sendSnackBarEvent({
			message: "We have update the name of test",
		})

		setSavebuttonDisabled(true)
	}

	return (
		<SettingsLayout>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Heading type={1} fontSize={20} className={"mb-8"}>
					Overview
				</Heading>
				<TextBlock fontSize={13}>Make sure you have selected all the configuration you want</TextBlock>
				<hr css={basicHR} className={"mt-36"} />

				<Heading type={2} fontSize={16} className={"mb-24 mt-38"}>
					Project name
				</Heading>
				<div>
					<Input
						placeholder={"Name of the project"}
						onChange={(e)=>{setProjectName(e.target.value)}}
						value={projectName}
						css={css`
							height: 42rem;
						`}
					/>
					<Button
						bgColor={saveButtonDisabled && "disabled"}
						css={css`
							width: 82rem;
						`}
						className={"mt-12"}
						onClick={updateProjectNameCallback}
					>
						Save
					</Button>
				</div>
				<hr css={basicHR} className={"mt-54"} />
				<Heading type={2} fontSize={16} className={"mb-12 mt-56"}>
					Delete this project
				</Heading>
				<TextBlock fontSize={13} className={"mb-24"}>
					This action can't be undone.
				</TextBlock>
				<Button
					bgColor={"danger"}
					css={css`
						width: 164rem;
					`}
					onClick={deleteProject}
				>
					Delete project
				</Button>
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
