import { css } from "@emotion/react";

import { Button, Input } from "dyson/src/components/atoms";
import { Modal } from "dyson/src/components/molecules/Modal";
import { useCallback, useState } from "react";
import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "../../../types/RequestOptions";
import { LoadingSVG } from "@svg/dashboard";
import { Conditional } from "dyson/src/components/layouts";
import { projectsAtom } from "../../../store/atoms/global/project";
import { useAtom } from "jotai";
import { appStateItemMutator } from "../../../store/atoms/global/appState";
import { useRouter } from "next/router";
import { sendSnackBarEvent } from '@utils/notify';

const addProject = (name) => {
	return backendRequest("/projects/actions/create", {
		method: RequestMethod.POST,
		payload: { name },
	});
};

export const AddProjectModal = ({ onClose }) => {
	const [projectName, changeProjectName] = useState("");
	const [processing, setProcessing] = useState(false);
	const [projects, setProjectsAtom] = useAtom(projectsAtom);
	const [, setAppStateItem] = useAtom(appStateItemMutator);
	const router = useRouter();

	const isNoName = projectName.length === 0;

	const addProjectCallback = useCallback(() => {
		(async () => {
			const data = await addProject(projectName);
			const { id, name, teamID } = data;
			const projectObject = { id, name, teamID };
			setProjectsAtom([...projects, projectObject]);

			setAppStateItem({ key: "selectedProjectId", value: id });
			onClose();
			await router.push("/app/dashboard");

			sendSnackBarEvent({message: "Created and switched project"})

		})();

		setProcessing(true);
	}, [projectName]);
	return (
		<Modal onOutsideClick={onClose} onClose={onClose}>
			<div className={"font-cera text-16 font-600 leading-none"}>Create new project</div>
			<div className={"text-13 mt-8"}>Organize test under one group</div>
			<div
				className={"mt-44 text-13 font-600 mb-16"}
				css={css`
					color: #d8d8d8;
				`}
			>
				Enter Project name
			</div>
			<Input
				placeholder={"Himanshu's killer app"}
				css={css`
					width: 100%;
				`}
				onChange={(e) => {
					changeProjectName(e.target.value);
				}}
				value={projectName}
				disabled={processing}
			/>

			<div className={"flex justify-end mt-12"}>
				<Button
					css={css`
						min-width: 132rem;
					`}
					disabled={isNoName || processing}
					bgColor={isNoName ? "disabled" : ""}
					title={isNoName && "Please enter project name"}
					onClick={addProjectCallback}
				>
					<div className={"flex justify-center items-center"}>
						<Conditional showIf={processing}>
							<LoadingSVG
								css={css`
									margin-right: 8rem !important;
								`}
								color={"#fff"}
								height={16}
								width={16}
							/>
						</Conditional>
						Save test
					</div>
				</Button>
			</div>
		</Modal>
	);
};

export default AddProjectModal;
