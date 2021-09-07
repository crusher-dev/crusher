import { css } from "@emotion/react";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";

import { Button, Input } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";

import { SettingsLayout } from "@ui/layout/SettingsBase";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { appStateAtom } from "../../../store/atoms/global/appState";
import { currentProject, projectsAtom } from "../../../store/atoms/global/project";
import { RequestMethod } from "../../../types/RequestOptions";
import { SelectBox } from "../../../../../dyson/src/components/molecules/Select/Select";

const deleteProject = (projectId) => {
	return backendRequest(`/projects/${projectId}/actions/delete`, {
		method: RequestMethod.POST,
	});
};

const updateProjectName = (projectId, name) => {
	return backendRequest(`/projects/${projectId}/actions/update.name`, {
		method: RequestMethod.POST,
		payload: { name },
	});
};

export const ProjectSettings = () => {
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [project] = useAtom(currentProject);
	const [projectsList] = useAtom(projectsAtom);
	const [projectName, setProjectName] = useState(project?.name);
	const [saveButtonDisabled, setSavebuttonDisabled] = useState(true);
	const onlyOneProject = projectsList.length <= 1;

	useEffect(() => {
		const isNameSame = project?.name === projectName;
		setSavebuttonDisabled(isNameSame);
	}, [projectName]);

	const deleteProjectCallback = async () => {
		if (onlyOneProject) {
			sendSnackBarEvent({
				message: "Unable to delete, Only 1 project in this org",
				type: "error",
			});
			return;
		}
		await deleteProject(selectedProjectId);

		window.location = "/";
	};

	const updateProjectNameCallback = async () => {
		await updateProjectName(selectedProjectId, projectName);

		sendSnackBarEvent({
			message: "We have update project info",
		});

		setSavebuttonDisabled(true);
	};

	return (
		<SettingsLayout>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Heading type={1} fontSize={"20"} className={"mb-8"}>
					Overview
				</Heading>
				<TextBlock fontSize={13}>Basic configuration for your test</TextBlock>
				<hr css={basicHR} className={"mt-36"} />

				<Heading type={2} fontSize={"16"} className={"mb-24 mt-38"}>
					Project name
				</Heading>
				<div>
					<Input
						placeholder={"Name of the project"}
						onChange={(e) => {
							setProjectName(e.target.value);
						}}
						initialValue={projectName}
						css={css`
							height: 42rem;
							width: 300rem;
						`}
					/>
					<Button
						bgColor={saveButtonDisabled && "disabled"}
						css={css`
							width: 82rem;
						`}
						className={"mt-12"}
						onClick={() => {
							!saveButtonDisabled && updateProjectNameCallback();
						}}
					>
						Save
					</Button>
				</div>
				<hr css={basicHR} className={"mt-54"} />
				<Heading type={2} fontSize={"16"} className={"mb-12 mt-56"}>
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
					onClick={deleteProjectCallback}
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
