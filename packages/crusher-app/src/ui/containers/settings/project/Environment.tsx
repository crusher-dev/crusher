import { css } from '@emotion/react';
import React, { useCallback, useEffect, useState } from 'react';

import { Card } from '../../../../../../dyson/src/components/layouts/Card/Card';
import { Button } from 'dyson/src/components/atoms';
import { Heading } from 'dyson/src/components/atoms/heading/Heading';
import { TextBlock } from 'dyson/src/components/atoms/textBlock/TextBlock';
import { Conditional } from 'dyson/src/components/layouts';

import { SettingsLayout } from '@ui/layout/SettingsBase';
import useSWR from 'swr';
import { useAtom } from 'jotai';
import { currentProject } from '../../../../store/atoms/global/project';
import { createProjectEnvironment, getProjectEnvironments } from '@constants/api';
import { ChevronRight } from '@svg/settings';
import { atomWithImmer } from 'jotai/immer';
import { ChevronDown } from '@svg/testReport';
import { Input } from 'dyson/src/components/atoms/input/Input';
import { AddSVG, LoadingSVG } from '@svg/dashboard';
import { CloseSVG } from 'dyson/src/components/icons/CloseSVG';
import { backendRequest } from '@utils/common/backendRequest';
import { RequestMethod } from '../../../../types/RequestOptions';
import { convertEnvToServerSide } from '@utils/core/settings/environmentSettingUtils';

function VarirableSection({ envId }) {
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
			<div className={"text-13 mt-32 mb-28 font-600"}>Variables</div>

			{vars?.map((_var, i) => {
				return (
					<div className={"mb-20 flex justify-between text-13 items-center"}>
						<div className={"flex"}>
							<div className={"flex items-center"}>
								Name
								<Input
									css={css`
										height: 32rem;
										width: 150rem;
									`}
									className={"ml-20"}
									placeholder={"Enter some name"}
									onBlur={changeVarValue.bind(this, i, "variableName")}
								/>
							</div>
							<div className={"flex items-center ml-80"}>
								Value
								<Input
									css={css`
										height: 32rem;
										width: 150rem;
									`}
									className={"ml-20"}
									placeholder={"Enter some name"}
									onBlur={changeVarValue.bind(this, i, "variableValue")}
								/>
							</div>
						</div>
						<CloseSVG height={10} width={10} onClick={deleteVar.bind(this, i)} />
					</div>
				);
			})}

			<div className={"flex justify-end mt-12 mb-20"}>
				<Button bgColor={"tertiary-dark"} className={"flex items-center text-12"} size={"small"} onClick={addVar}>
					<AddSVG className={""} />
				</Button>
			</div>
		</React.Fragment>
	);
}

function EnvironmentForm({ id }) {
	const [project]= useAtom(currentProject)
	const [environmentsInStore, setEnvironment] = useAtom(environmentsAtom);
	const [savingEnv, setSavingEnv] = useState(false);
	const changeName = (e) => {
		setEnvironment((environemnt) => {
			environemnt[id].name = e.target.value;
		});
	};


	const {notSavedInDb} = environmentsInStore[id]

	const saveInServer = async ()=>{
		setSavingEnv(true)
		const currentEnvData = 	environmentsInStore[id];
		const payload = convertEnvToServerSide(currentEnvData)
		await backendRequest(createProjectEnvironment(project.id),{
			method: RequestMethod.POST,
			payload
		})

		setSavingEnv(false)
	}

	return (
		<div>
			<div className={"mt-30 flex justify-between text-13 items-center"}>
				<div>Name of the env</div>
				<div>
					<Input
						css={css`
							height: 36rem;
						`}
						placeholder={"Enter some name"}
						onBlur={changeName}
					/>
				</div>
			</div>

			<VarirableSection envId={id} />

			<div className={"flex justify-between items-center mt-40 mb-20 text-13"}>
				<TextBlock
					fontSize={13}
					color={"#d7537b"}
					css={css`
						:hover {
							text-decoration: underline;
						}
					`}
				>
					{notSavedInDb? "Delete" : ""}
				</TextBlock>
				<Button
					bgColor={"tertiary-dark"}
					css={css`
						width: 120rem;
					`}
					onClick={saveInServer}
					className={"flex items-center justify-center"}
				>
					<Conditional showIf={savingEnv}>
						<LoadingSVG height={12} className={"mr-8"}/>
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

	const {notSavedInDB} = environmentsInStore[id]

	const onClick = ()=>{
		setEnvironment((environemnt) => {
			if(notSavedInDB) return
			environemnt[id].isOpen = !isOpen;
		});
	};




	return (
		<Card css={projectListCard}>
			<div className={"flex justify-between items-center"} onClick={onClick}>
				<div className={"text-15"}>
					{name} {isOpen}
				</div>
				<div className={"text-13"} id={"delete"}>
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
	browserType: "CHROME" | "FIREFOX" | "SAFARI" | "ALL";
	vars: Record<string, any>;
	isOpen: false;
	notSavedInDB?: boolean;
};

/*
	Move to environment atom
 */
const environmentsAtom = atomWithImmer<TEnvironment[]>([]);

export const Environment = () => {
	const [project] = useAtom(currentProject);

	const { data: environments } = useSWR(getProjectEnvironments(project.id));
	const [environmentsInStore, setEnvironment] = useAtom(environmentsAtom);

	useEffect(() => {
		setEnvironment(environments);
	}, [environments]);

	const addEmptyEnvToStore = useCallback(() => {
		setEnvironment([
			...environmentsInStore,
			{
				name: "New env",
				browserType: "ALL",
				vars: [],
				isOpen: true,
				notSavedInDB: true,
			},
		]);
	}, []);

	if (!environmentsInStore) return null;
	return (
		<SettingsLayout>
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
							onClick={addEmptyEnvToStore.bind(this)}
							css={css`
								width: 164rem;
							`}
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
	padding: 12rem 24rem;
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
