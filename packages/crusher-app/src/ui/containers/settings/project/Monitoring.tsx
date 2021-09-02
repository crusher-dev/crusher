import { css } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";

import { Card } from "../../../../../../dyson/src/components/layouts/Card/Card";
import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import { SettingsLayout } from "@ui/layout/SettingsBase";
import useSWR from "swr";
import { useAtom } from "jotai";
import { currentProject } from "../../../../store/atoms/global/project";
import { createProjectMonitoring, getProjectMonitoring } from "@constants/api";
import { ChevronRight } from "@svg/settings";
import { atomWithImmer } from "jotai/immer";
import { ChevronDown } from "@svg/testReport";
import { Input } from "dyson/src/components/atoms/input/Input";
import { LoadingSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { RequestMethod } from "../../../../types/RequestOptions";
import { converServerToClientSideStateMonitoring, convertToServerSideMonitoring } from "@utils/core/settings/environmentSettingUtils";
import { sendSnackBarEvent } from "@utils/common/notify";

function MonitoringForm({ id }) {
	const [project] = useAtom(currentProject);
	const [monitoringInStore, setMonitoring] = useAtom(monitoringAtom);
	const [savingEnv, setSavingEnv] = useState(false);
	const { notSavedInDb, environmentId, testInterval } = monitoringInStore[id];

	const setEnv = (e) => {
		setMonitoring((monitoring) => {
			monitoring[id].environmentId = e.target.value;
		});
	};

	const setInterval = (e) => {
		setMonitoring((monitorings) => {
			monitorings[id].testInterval = e.target.value;
		});
	};

	const saveInServer = async () => {
		setSavingEnv(true);
		const currentMonitoringData = monitoringInStore[id];
		const payload = convertToServerSideMonitoring(currentMonitoringData);
		await backendRequest(createProjectMonitoring(project.id), {
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
				<div>
					<Input
						css={css`
							height: 36rem;
						`}
						placeholder={"https://google.com"}
						onBlur={setEnv}
						initialValue={environmentId}
					/>
				</div>
			</div>

			<div className={"mt-12 flex justify-between text-13 items-center"}>
				<div>
					testInterval <span className={"text-12 ml-8"}>In Sec</span>
				</div>
				<div>
					<Input
						css={css`
							height: 36rem;
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
					css={css`
						:hover {
							text-decoration: underline;
						}
					`}
				>
					{!notSavedInDb ? "Delete" : ""}
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
						<LoadingSVG height={12} width={12} className={"mr-8"} />
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
				<div className={"text-14"}>
					{environmentId} - {testInterval}
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
	const [project] = useAtom(currentProject);

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
						<Heading type={2} fontSize={16} className={"mb-12"}>
							Monitoring
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
	#top-section {
		padding: 12rem 24rem;
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
