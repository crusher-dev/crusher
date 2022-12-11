import { css } from "@emotion/react";
import { getCurrentSelectedProjct, getProxyState } from "electron-app/src/store/selectors/app";
import { generateRandomTestName, turnOnProxyServers } from "electron-app/src/utils/renderer";
import React from "react";
import { useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/user";
import { LoadingProgressBar } from "../../containers/common/LoadingProgressBar";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { ButtonDropdown } from "../../components/buttonDropdown";
import { AddIconV3 } from "electron-app/src/_ui/constants/old_icons";
import { goFullScreen, performRunTests } from "electron-app/src/ipc/perform";
import { StickyFooter } from "../../containers/common/stickyFooter";
import { Footer } from "../../containers/common/footer";
import { useBuildNotifications, useProjectTests } from "../../../hooks/tests";
import { triggerLocalBuild } from "../../../utils/recorder";
import { LinkPointer } from "../../components/LinkPointer";
import { linkOpen } from "electron-app/src/utils/url";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { ProxyConfigModifedToast } from "../projectList/proxyConfigModifiedToast";
import { OnboardingSection } from "./containers/onboarding";
import axios from "axios";
import { saveNewDraftTest } from "electron-app/src/api/tests/draft.tests";
import { getRecorderContext } from "electron-app/src/store/selectors/recorder";
import { TRecorderVariant } from "electron-app/src/store/reducers/recorder";
import { setRecorderContext } from "electron-app/src/store/actions/recorder";
import { DashboardTestsList } from "./list";
import { useCallback } from "react";
import { CreateFirstTest } from "./containers/createFirstTest";

const TitleComponent = ({ project }) => {
	const { name, id } = project;
	return (
		<div css={titleStyle}>
			<b css={titleBoldStyle}>{name}</b>
			<LinkPointer onClick={linkOpen.bind(this, resolveToFrontEndPath(`/${id}/dashboard`))} css={openAppCss}>
				app
			</LinkPointer>
		</div>
	);
};

const openAppCss = css`
	margin-top: -3px;
	font-weight: 400;
	font-size: 13px;
	color: #828282;
`;

const titleBoldStyle = css`
	font-weight: 700;
	font-size: 13.5rem;
	color: #fff !important;
`;

const titleStyle = css`
	width: max-content;
	font-size: 13rem;

	color: rgba(255, 255, 255, 0.67);
	display: flex;
	align-items: center;
	position: absolute;
	top: 65%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	gap: 2px;
`;


const useDashboardHeader = () => {
	const { tests } = useProjectTests();
	const { addNotification } = useBuildNotifications();

	const store = useStore();
	const navigate = useNavigate();

	const handleRunCallback = (id) => {
		if (id === "RUN_CLOUD") {
			performRunTests(null).then((buildRes) => {
				addNotification({ id: buildRes.buildId });
			});
		} else if (id === "RUN_LOCAL") {
			triggerLocalBuild(
				tests.map((test) => test.id),
				tests,
				null,
				"app"
			);
		}
	};

	const handleCreateTest = React.useCallback(async () => {
		store.dispatch(setRecorderContext({
			variant: TRecorderVariant.CREATE_TEST,
			origin: "app",
			startedAt: Date.now(),
		}));

		const testName = generateRandomTestName();
		axios(saveNewDraftTest({ name: testName, events: [] })).then((res) => {
			const { draftId } = res.data;
			const recorderContext = getRecorderContext(store.getState() as any);
			if (recorderContext && recorderContext.variant === TRecorderVariant.CREATE_TEST) {
				store.dispatch(setRecorderContext({
					...recorderContext,
					testName,
					draftId: draftId
				}))
			}
		}).catch((err) => {
			console.log("Failed to create draft for this session", err);
		})


		navigate("/recorder");
		goFullScreen();
		navigate({
				pathname: '/recorder',
				search: '?firstTest=true',
			  });
	
	}, []);

	const getHeaderActions = useCallback(() => {
		return (
			<div css={headerComponentCss}>
				<ButtonDropdown
					dropdownCss={buttonDropdownCss}
					hideDropdown={true}
					css={[
						buttonDropdownMainButtonCss,
						css`
							background: transparent !important;
							width: auto !important;
							border: none !important;
						`,
					]}
					options={[
						{
							id: "SAVE",
							content: (
								<span css={createTestCss}>
									<AddIconV3 css={createIconCss} /> <span>new test</span>
								</span>
							),
						},
					]}
					primaryOption={"SAVE"}
					callback={handleCreateTest}
				/>
				<ButtonDropdown
					dropdownCss={buttonDropdownCss}
					css={[
						buttonDropdownMainButtonCss,
						css`
							background: #b341f9 !important;
						`,
					]}
					options={[
						{ id: "RUN_LOCAL", content: <span>Run tests</span> },
						{ id: "RUN_CLOUD", content: <span>In cloud</span> },
					]}
					primaryOption={"RUN_LOCAL"}
					callback={handleRunCallback}
				/>
			</div>
		);
	}, [handleRunCallback]);


	return { headerActions: getHeaderActions() }
}

const DashboardScreen = () => {
	const [animationComplete, setAnimationComplete] = React.useState(false);
	const { userInfo, projects } = useUser();
	const { tests } = useProjectTests();
	const { headerActions } = useDashboardHeader();

	const [selectedProject, setSelectedProject] = React.useState(null);
	const [showProxyWarning, setShowProxyWarning] = React.useState({ show: false, testId: null, startUrl: null });

	const navigate = useNavigate();
	const store = useStore();

	React.useEffect(() => {
		const interval = setTimeout(setAnimationComplete.bind(this, true), 200);

		return () => {
			clearTimeout(interval);
		}
	}, []);

	React.useEffect(() => {
		const selectedProjectId = getCurrentSelectedProjct(store.getState());
		if (!selectedProjectId) return navigate("/select-project");
		const proxyState = getProxyState(store.getState());
		if (window["showProxyWarning"] && !Object.keys(proxyState).length) {
			setShowProxyWarning({ show: true, testId: window["showProxyWarning"].testId, startUrl: window["showProxyWarning"].startUrl });
			window["showProxyWarning"] = false;
		}

		turnOnProxyServers();
		// @TODO: Cache this API
		if (selectedProjectId && userInfo && userInfo.projects) {
			const project = userInfo.projects.find((p) => p.id == selectedProjectId);
			if (project) {
				setSelectedProject(project);
			}
		}
	}, [projects]);




	const isLoading = React.useMemo(() => !tests, [tests]);
	const hasNotLoaded = isLoading || !animationComplete;
	
	const getMainContent = () => {
		return (
			<>
					{
						showProxyWarning.show ? (
							<ProxyConfigModifedToast onClose={() => setShowProxyWarning(false)} />
						) : ""
					}
					<DashboardTestsList/>
					{(tests.length < 3 && tests.length) ? (<OnboardingSection />) : null}
			</>
		);
	}
	return (
		<CompactAppLayout
			footer={
				hasNotLoaded ? null : (
					<>
						<Footer />
						<StickyFooter />
					</>
				)
			}
			headerRightSection={headerActions}
			showHeader={!hasNotLoaded}
			css={loadingCSS()}
			title={selectedProject && !hasNotLoaded ? <TitleComponent project={selectedProject} /> : null}
		>
			{hasNotLoaded ? <LoadingProgressBar inAppLoading={false} /> : getMainContent()}
		</CompactAppLayout>
	);
};

const headerComponentCss = css`
	display: flex;
	position: relative;
	top: 22%;
	.dropdown-icon {
		background: transparent !important;
	}
`;
const loadingCSS = () => css`
	background: #080808;
`;
const buttonDropdownCss = css`
	left: 0rem !important;
	height: max-content !important;
	top: calc(100% + 4rem) !important;
`;
const buttonDropdownMainButtonCss = css`
	background: #cd60ff;
	border: 1px solid #7d41ad;
	width: fit-content;
	border-radius: 8px !important;
	background: hsla(268, 100%, 60%, 1) !important;

	font-family: "Gilroy" !important;
	font-style: normal !important;
	font-weight: 600 !important;
	font-size: 13rem !important;
	height: 30rpx;
	color: #ffffff !important;
`;
const createIconCss = css`
	width: 11rem;
	height: 11rem;
`;
const createTestCss = css`
	display: flex;
	gap: 6rem;
	align-items: center;

	font-weight: 500;
	font-size: 13rem;

	color: #ffffff;

	:hover {
		color: #bc66ff !important;
		svg path {
			fill: #bc66ff !important;
		}
	}
`;


export { DashboardScreen };

