import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { useAtom } from "jotai";
import { useAtomDevtools } from "jotai/devtools";
import { useBasicSEO } from "../src/hooks/seo";
import Head from "next/head";
import "../src/tailwind.css";
import { USER_SYSTEM_API } from "@constants/api";
import { useRouter } from "next/router";
import { LoadingScreen } from "@ui/layout/LoadingScreen";
import { Conditional } from "dyson/src/components/layouts";

import { redirectUserOnMount } from "@utils/routing";
import { backendRequest } from "@utils/backendRequest";

import { userAtom } from "../src/store/atoms/global/user";
import { systemConfigAtom } from "../src/store/atoms/global/systemConfig";
import { teamAtom } from "../src/store/atoms/global/team";
import { projectsAtom } from "../src/store/atoms/global/project";
import { rootGlobalAtom } from "../src/store/atoms/global/rootAtom";
import { appStateAtom, appStateItemMutator } from "../src/store/atoms/global/appState";
import { SWRConfig } from "swr";
import { addPosthog, handleUserFeedback } from "@utils/scriptUtils";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";

function loadUserDataAndRedirect() {
	const router = useRouter();
	const [dataLoaded, setDataLoaded] = useState(false);
	const [, setUser] = useAtom(userAtom);
	const [, setSystem] = useAtom(systemConfigAtom);
	const [, setTeam] = useAtom(teamAtom);
	const [appState] = useAtom(appStateAtom);
	const [, setProjects] = useAtom(projectsAtom);
	const [, setAppStateItem] = useAtom(appStateItemMutator);
	useEffect(() => {
		(async () => {
			const data: IUserAndSystemInfoResponse = await backendRequest(USER_SYSTEM_API, {});
			const { userData, system, team, projects } = data;
			setUser(userData);
			setTeam(team);
			setSystem(system);
			setProjects(projects);

			await redirectUserOnMount(data, router, setDataLoaded.bind(this, true));

			if (!appState.selectedProjectId) {
				setAppStateItem({ key: "selectedProjectId", value: projects && projects[0].id });
			}

			setDataLoaded(true);
		})();

		handleUserFeedback();
		addPosthog();
	}, []);

	return [dataLoaded];
}

function App({ Component, pageProps }: AppProps<any>) {
	const [dataAvailable] = loadUserDataAndRedirect();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	useAtomDevtools(rootGlobalAtom);
	useBasicSEO({ favicon: "/assets/img/favicon.png" });
	return (
		<>
			<Head>
				<link rel="prefetch" href={USER_SYSTEM_API} as="fetch" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<SWRConfig
				value={{
					fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
				}}
			>
				<Conditional showIf={!dataAvailable}>
					<LoadingScreen />
				</Conditional>
				<Conditional showIf={dataAvailable}>
					<Component {...pageProps} />
				</Conditional>
			</SWRConfig>
		</>
	);
}

export default App;
