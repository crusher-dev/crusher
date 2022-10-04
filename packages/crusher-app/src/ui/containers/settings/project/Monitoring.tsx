import { css } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";

import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import useSWR, { mutate } from "swr";

import { Card } from "../../../../../../dyson/src/components/layouts/Card/Card";
import { SelectBox } from "../../../../../../dyson/src/components/molecules/Select/Select";
import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { Input } from "dyson/src/components/atoms/input/Input";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import { createProjectMonitoring, deleteProjectMonitoring, getProjectEnvironments, getProjectMonitoring, updateProjectMonitoing } from "@constants/api";
import { LoadingSVG } from "@svg/dashboard";
import { ChevronRight } from "@svg/settings";
import { ChevronDown } from "@svg/testReport";
import { SettingsLayout } from "@ui/layout/SettingsBase";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";
import { converServerToClientSideStateMonitoring, convertToServerSideMonitoring } from "@utils/core/settings/environmentSettingUtils";

import { currentProject } from "../../../../store/atoms/global/project";
import { RequestMethod } from "../../../../types/RequestOptions";
import { useProjectDetails } from "@hooks/common";

const selectBoxCSS = css`
	.selectBox {
		width: 200rem;
	}
`;
const getValues = (environments) => {
	return (
		environments?.map(({ name, id }) => {
			return { label: name, value: id };
		}) ?? []
	);
};

function MonitoringForm({ id }) {
	const { currentProject: project } = useProjectDetails()
	const [monitoringInStore, setMonitoring] = useAtom(monitoringAtom);
	const [savingEnv, setSavingEnv] = useState(false);
	const { notSavedInDB, environmentId, testInterval } = monitoringInStore[id];
	const { data: environments } = useSWR(getProjectEnvironments(project.id));

	const envValues = getValues(environments);

	useEffect(() => {
		if (envValues.length > 0) {
			setEnv([envValues[0].value]);
		}
	}, [envValues]);

	const setEnv = (values) => {
		setMonitoring((monitoring) => {
			[monitoring[id].environmentId] = values;
		});
	};

	const setInterval = (e) => {
		setMonitoring((monitorings) => {
			monitorings[id].testInterval = e.target.value;
		});
	};

	const deleteMonitoringAPI = async () => {
		const currentMonitoringData = monitoringInStore[id];
		await backendRequest(deleteProjectMonitoring(project.id, currentMonitoringData.id), { method: RequestMethod.POST });
		await mutate(getProjectEnvironments(project.id));
	};

	const saveInServer = async () => {
		setSavingEnv(true);
		const currentMonitoringData = monitoringInStore[id];
		const payload = convertToServerSideMonitoring(currentMonitoringData);

		const { notSavedInDB } = currentMonitoringData;

		const backendAPI = notSavedInDB ? createProjectMonitoring(project.id) : updateProjectMonitoing(project.id, currentMonitoringData.id);

		await backendRequest(backendAPI, {
			method: RequestMethod.POST,
			payload,
		});

		setSavingEnv(false);

		sendSnackBarEvent({
			type: "normal",
			message: "Monitoring saved",
		});
	};

	return (
		<div className={"px-24"}>
			<div className={"mt-12 flex justify-between text-13 items-center"}>
				<div>Environment id</div>
				<div
					css={css`
						width: 200rem;
					`}
				>
					<SelectBox css={selectBoxCSS} values={envValues} selected={[environmentId]} callback={setEnv.bind(this)} />
				</div>
			</div>

			<div className={"mt-12 flex justify-between text-13 items-center"}>
				<div>
					Run every <span className={"text-12 ml-3"}>In Sec</span>
				</div>
				<div>
					<Input
						css={css`
							width: 200rem;
							height: 32rem;
						`}
						placeholder={"https://google.com"}
						onBlur={setInterval}
						initialValue={testInterval}
					/>
				</div>
			</div>

			<div className={"flex justify-between items-center mt-40 mb-20 text-13"}>
				<TextBlock
					fontSize={13}
					color={"#d7537b"}
					onClick={deleteMonitoringAPI}
					css={css`
						:hover {
							text-decoration: underline;
						}
					`}
				>
					{!notSavedInDB ? "Delete" : ""}
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

function MonitoringCard({ monitoringData, id }) {
	const { isOpen, testInterval, environmentId } = monitoringData;
	const [environmentsInStore, setEnvironment] = useAtom(monitoringAtom);
	const { notSavedInDB } = environmentsInStore[id];
	const { currentProject: project } = useProjectDetails()
	const { data: environments } = useSWR(getProjectEnvironments(project.id));

	const onClick = () => {
		setEnvironment((monitorings) => {
			if (notSavedInDB) {
				sendSnackBarEvent({ type: "normal", message: "Please save new env before closing" });
				return;
			}

			for (const monitoring of monitorings) {
				monitoring.isOpen = false;
			}
			monitorings[id].isOpen = !isOpen;
		});
	};

	const envName = environments?.filter(({ id }) => id === environmentId)[0]?.name;

	return (
		<Card css={projectListCard}>
			<div className={"flex justify-between items-center"} onClick={onClick} id={"top-section"}>
				<div className={"text-14"}>
					{envName} - every {testInterval} secs
				</div>
				<div className={"text-13"} id={"delete"}>
					{isOpen ? <ChevronDown /> : <ChevronRight />}
				</div>
			</div>

			<Conditional showIf={isOpen}>
				<MonitoringForm id={id} />
			</Conditional>
		</Card>
	);
}

type TMonitoringCard = {
	id?: number;
	environmentId?: number;
	testInterval?: number;
	isOpen: boolean;
	notSavedInDB?: boolean;
};

/*
	Move to environment atom
 */
const monitoringAtom = atomWithImmer<TMonitoringCard[]>([]);

export const Monitoring = () => {
	const { currentProject: project } = useProjectDetails()

	const { data: monitoring } = useSWR(getProjectMonitoring(project.id));

	const [monitoringInStore, setMonitoring] = useAtom(monitoringAtom);

	useEffect(() => {
		if (monitoring === undefined) return;
		setMonitoring(converServerToClientSideStateMonitoring(monitoring));
	}, [monitoring]);

	const addEmptyEnvToStore = useCallback(() => {
		setMonitoring([
			...monitoringInStore,
			{
				environmentId: "",
				browsers: [],
				testInterval: 3600,
				isOpen: true,
				notSavedInDB: true,
			},
		]);
	}, [monitoringInStore]);

	if (!monitoringInStore) return null;
	return (
		<SettingsLayout>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<div className={"flex justify-between items-start mt-16"}>
					<div>
						<Heading type={2} fontSize={"16"} className={"mb-08"}>
							Monitoring
						</Heading>
						<TextBlock fontSize={13} className={"mb-24"} color={"#c1c1c1"}>
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
							Add Monitoring
						</Button>
					</div>
				</div>

				<hr css={basicHR} />

				<Conditional showIf={monitoringInStore.length > 0}>
					{monitoringInStore.map((monitoringData, i) => {
						return <MonitoringCard monitoringData={monitoringData} key={i} id={i} />;
					})}
				</Conditional>
				<Conditional showIf={monitoringInStore.length < 1}>
					<div className={"text-13 mt-40"}>You don't have any monitoring yet in your project.</div>
				</Conditional>
			</div>
		</SettingsLayout>
	);
};

const projectListCard = css`
	padding: 0;
	background: rgb(16 18 21);
	border: 1px solid #171b20;
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
