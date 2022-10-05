import { css } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";

import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import useSWR, { mutate } from "swr";

import { Card } from "../../../../../../dyson/src/components/layouts/Card/Card";
import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { Input } from "dyson/src/components/atoms/input/Input";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { CloseSVG } from "dyson/src/components/icons/CloseSVG";
import { Conditional } from "dyson/src/components/layouts";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";

import { createProjectEnvironment, deleteProjectEnv, getProjectEnvironments, updateProjectEnv } from "@constants/api";
import { AddSVG, LoadingSVG } from "@svg/dashboard";
import { ChevronRight } from "@svg/settings";
import { ChevronDown } from "@svg/testReport";
import { SettingsLayout } from "@ui/layout/SettingsBase";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";
import { sentenceCase } from "@utils/common/textUtils";
import { converServerToClientSideState, convertEnvToServerSide } from "@utils/core/settings/environmentSettingUtils";

import { currentProject } from "../../../../store/atoms/global/project";
import { RequestMethod } from "../../../../types/RequestOptions";
import { useProjectDetails } from "@hooks/common";

function VariableSection({ envId }) {
	const [environmentsInStore, setEnvironment] = useAtom(environmentsAtom);

	const { vars } = environmentsInStore[envId];

	const addVar = () => {
		setEnvironment((environemnt) => {
			environemnt[envId].vars.push({
				variableName: {
					value: "",
				},
				variableValue: {
					value: "",
				},
			});
		});
	};

	const deleteVar = (i) => {
		setEnvironment((environemnt) => {
			environemnt[envId].vars.splice(i, 1);
		});
	};

	const changeVarValue = (i, type: "variableName" | "variableValue", e) => {
		setEnvironment((environemnt) => {
			environemnt[envId].vars[i][type].value = e.target.value;
		});
	};

	return (
		<React.Fragment>
			<div className={"text-13 mt-32 mb-24 font-600"}>Variables</div>

			{vars?.map((_var, i) => {
				return (
					<div className={"mb-20 flex justify-between text-13 items-center"}>
						<div className={"flex"}>
							<div className={"flex items-center"}>
								Name
								<Input
									css={css`
										width: 150rem;
									`}
									className={"ml-20"}
									placeholder={"Enter some name"}
									onBlur={changeVarValue.bind(this, i, "variableName")}
									initialValue={_var.variableName.value}
								/>
							</div>
							<div className={"flex items-center ml-80"}>
								Value
								<Input
									css={css`
										width: 150rem;
									`}
									className={"ml-20"}
									placeholder={"Enter some name"}
									onBlur={changeVarValue.bind(this, i, "variableValue")}
									initialValue={_var.variableValue.value}
								/>
							</div>
						</div>
						<CloseSVG height={"10rem"} width={"10rem"} onClick={deleteVar.bind(this, i)} />
					</div>
				);
			})}

			<div className={"flex justify-end mt-12 mb-20"}>
				<Button
					bgColor={"tertiary"}
					className={"flex items-center text-12"}
					css={css`
						height: 24rem;
					`}
					onClick={addVar}
				>
					<AddSVG height={8} width={8} />
				</Button>
			</div>
		</React.Fragment>
	);
}

const selectBoxCSS = css`
	.selectBox {
		width: 200rem;
	}
`;
const getBrowserValues = () => {
	return (
		["CHROME", "FIREFOX", "SAFARI"].map((browserName) => {
			return { label: sentenceCase(browserName), value: browserName };
		}) ?? []
	);
};

function EnvironmentForm({ id }) {

	const { currentProject: project } = useProjectDetails()
	const [environmentsInStore, setEnvironment] = useAtom(environmentsAtom);
	const [savingEnv, setSavingEnv] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { notSavedInDB, host, name, browser } = environmentsInStore[id];

	const changeName = (e) => {
		setEnvironment((environemnt) => {
			environemnt[id].name = e.target.value;
		});
	};

	const setHost = (e) => {
		setEnvironment((environemnt) => {
			environemnt[id].host = e.target.value;
		});
	};

	const saveInServer = async () => {
		setSavingEnv(true);
		const currentEnvData = environmentsInStore[id];
		const payload = convertEnvToServerSide(currentEnvData);

		const backendAPI = notSavedInDB ? createProjectEnvironment(project.id) : updateProjectEnv(project.id, currentEnvData.id);

		await backendRequest(backendAPI, {
			method: RequestMethod.POST,
			payload,
		});

		setSavingEnv(false);

		sendSnackBarEvent({
			type: "normal",
			message: "Environment has been saved",
		});
	};

	const deleteEnvAPI = async () => {
		const currentEnvData = environmentsInStore[id];
		await backendRequest(deleteProjectEnv(project.id, currentEnvData.id), { method: RequestMethod.POST });
		await mutate(getProjectEnvironments(project.id));
	};

	const setbrowser = (values) => {
		setEnvironment((environment) => {
			environment[id].browser = values;
		});
	};

	return (
		<div className={"px-28 pb-40"}>
			<div className={"mt-30 flex justify-between text-13 items-center"}>
				<div>Name of the env</div>
				<div>
					<Input
						css={css`
							height: 36rem;
						`}
						placeholder={"Enter some name"}
						onBlur={changeName}
						initialValue={name}
						size={"medium"}
					/>
				</div>
			</div>

			<div className={"mt-20 flex justify-between text-13 items-center"}>
				<div>Browsers</div>
				<div
					css={css`
						width: 200rem;
					`}
				>
					<SelectBox css={selectBoxCSS} isMultiSelect={true} values={getBrowserValues()} selected={browser} callback={setbrowser.bind(this)} />
				</div>
			</div>

			<div className={"mt-20 flex justify-between text-13 items-center"}>
				<div>Host</div>
				<div>
					<Input
						css={css`
							height: 36rem;
						`}
						placeholder={"Your website URL"}
						onBlur={setHost}
						initialValue={host}
						size={"medium"}
					/>
				</div>
			</div>

			<VariableSection envId={id} />

			<div className={"flex justify-between items-center mt-40 mb-20 text-13"}>
				<TextBlock
					fontSize={13}
					color={"#d7537b"}
					onClick={deleteEnvAPI.bind(this)}
					css={css`
						:hover {
							text-decoration: underline;
						}
					`}
				>
					<Conditional showIf={!notSavedInDB}>
						<Conditional showIf={deleting}>
							<div className={"flex items-center"}>
								<LoadingSVG height={12} width={12} className={"mr-8"} /> Deleting
							</div>
						</Conditional>
						<Conditional showIf={!deleting}>
							<span
								onClick={() => {
									deleteEnvAPI();
									setDeleting(true);
								}}
							>
								Delete
							</span>
						</Conditional>
					</Conditional>
				</TextBlock>
				<Button
					bgColor={"tertiary"}
					css={css`
						width: 120rem;
					`}
					onClick={saveInServer}
					className={"flex items-center justify-center"}
				>
					<Conditional showIf={savingEnv}>
						<LoadingSVG height={"12rem"} width={"12rem"} className={"mr-8"} />
					</Conditional>
					Save
				</Button>
			</div>
		</div>
	);
}

function EnvironmentCard({ environmentData, id }) {
	const { name, isOpen } = environmentData;
	const [environmentsInStore, setEnvironment] = useAtom(environmentsAtom);

	const { notSavedInDB } = environmentsInStore[id];

	const onClick = () => {
		setEnvironment((environemnt) => {
			if (notSavedInDB) {
				sendSnackBarEvent({ type: "normal", message: "Please save new env before closing" });
				return;
			}

			for (const env of environemnt) {
				env.isOpen = false;
			}
			environemnt[id].isOpen = !isOpen;
		});
	};

	return (
		<Card css={projectListCard}>
			<div className={"flex justify-between items-center"} onClick={onClick} id={"top-section"}>
				<div className={"text-14"}>{name}</div>
				<div className={"flex text-12 items-center"} id={"delete"}>
					{isOpen ? <ChevronDown /> : <ChevronRight />}
				</div>
			</div>

			<Conditional showIf={isOpen}>
				<EnvironmentForm id={id} />
			</Conditional>
		</Card>
	);
}

type TEnvironment = {
	id?: number;
	name?: string;
	host: string;
	browser: string[];
	vars: Record<string, any>[];
	isOpen: boolean;
	notSavedInDB?: boolean;
};

/*
	Move to environment atom
 */
const environmentsAtom = atomWithImmer<TEnvironment[]>([]);

export const Environment = () => {

	const { currentProject } = useProjectDetails()

	const { data: environments } = useSWR(getProjectEnvironments(currentProject.id));
	const [environmentsInStore, setEnvironment] = useAtom(environmentsAtom);

	useEffect(() => {
		if (environments === undefined) return;
		setEnvironment(converServerToClientSideState(environments));
	}, [environments]);

	const addEmptyEnvToStore = useCallback(() => {
		setEnvironment([
			...environmentsInStore,
			{
				name: "New env",
				browser: ["CHROME", "FIREFOX", "SAFARI"],
				host: "",
				vars: [],
				isOpen: true,
				notSavedInDB: true,
			},
		]);
	}, [environmentsInStore]);

	if (!environmentsInStore) return null;
	return (
		<SettingsLayout>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<div className={"flex justify-between items-start mt-16"}>
					<div>
						<Heading type={2} fontSize={"18"} className={"mb-8"}>
							Environments
						</Heading>
						<TextBlock fontSize={13} className={"mb-24"} color={"#787878"}>
							manage environment for crusher
						</TextBlock>
					</div>
					<div>
						<Button
							onClick={addEmptyEnvToStore.bind(this)}

						>
							Add environment
						</Button>
					</div>
				</div>

				<hr css={basicHR} />

				<Conditional showIf={environmentsInStore.length > 0}>
					{environmentsInStore.map((environmentData, i) => {
						return <EnvironmentCard environmentData={environmentData} key={i} id={i} />;
					})}
				</Conditional>
				<Conditional showIf={environmentsInStore.length < 1}>
					<div className={"text-13 mt-40"}>You don't have any environments yet in your project.</div>
				</Conditional>
			</div>
		</SettingsLayout>
	);
};

const projectListCard = css`
	padding: 0;
	#top-section {
		padding: 14rem 20rem;
	}
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
