import { css } from "@emotion/react";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { getCurrentSelectedProjct, getProxyState } from "electron-app/src/store/selectors/app";
import { ProxyWarningContainer } from "electron-app/src/_ui/ui/containers/components/proxy-warning";
import { sendSnackBarEvent } from "electron-app/src/_ui/ui/containers/components/toast";
import { turnOnProxyServers } from "electron-app/src/utils/renderer";
import React from "react";
import { useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedProjectTestsRequest } from "../../../api/tests/tests.request";
import { useUser } from "../../../api/user/user";
import { LoadingProgressBar } from "../../containers/common/LoadingProgressBar";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import useRequest from "../../../utils/useRequest";
import { CreateFirstTest } from "./createFirstTest";
import { TestList } from "./testsList";
import { ButtonDropdown } from "../../components/buttonDropdown";
import { AddIconV3 } from "electron-app/src/_ui/constants/old_icons";
import { goFullScreen, performRunTests } from "electron-app/src/_ui/commands/perform";
import { StickyFooter } from "../../containers/common/stickyFooter";
import { Footer } from "../../containers/common/footer";
import { useBuildNotifications } from "../../../hooks/tests";
import { triggerLocalBuild } from "../../../utils/recorder";
import { LinkPointer } from "../../components/LinkPointer";
import { linkOpen } from "electron-app/src/utils/url";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { ProxyConfigModifedToast } from "../projectList/proxyConfigModifiedToast";
import { OnboardingSection } from "./testList/onboarding";

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
const DashboardScreen = () => {
	const [animationComplete, setAnimationComplete] = React.useState(false);
	const { userInfo, projects } = useUser();
	const { data: tests, mutate } = useRequest(userInfo?.isUserLoggedIn ? getSelectedProjectTestsRequest : () => null, { refreshInterval: 5000 });
	const [selectedProject, setSelectedProject] = React.useState(null);
	const [showProxyWarning, setShowProxyWarning] = React.useState({ show: false, testId: null, startUrl: null });
	const { addNotification } = useBuildNotifications();

	const navigate = useNavigate();
	const store = useStore();

	React.useEffect(() => {
		const interval = setTimeout(setAnimationComplete.bind(this, true), 200);

		return () => {
			clearTimeout(interval);
		}
	}, []);

	const handleTestDelete = React.useCallback(
		(idArr: any[]) => {
			if (!(window as any).deletedTest) {
				(window as any).deletedTest = [];
			}
			(window as any).deletedTest.push(...idArr);
			console.log("Id arr", idArr);
			mutate({
				...tests,
				list: tests.list.filter((test) => {
					return !((window as any).deletedTest || []).includes(test.id);
				}),
			});
			for (let id of idArr) {
				CloudCrusher.deleteTest(id).catch(() => {
					sendSnackBarEvent({ message: "Error deleting test", type: "error" });
				});
			}
		},
		[tests],
	);

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

	const handleCreateTest = React.useCallback(() => {
		navigate("/recorder");
		goFullScreen();
	}, []);

	const handleRunCallback = (id) => {
		if (id === "RUN_CLOUD") {
			performRunTests(null).then((buildRes) => {
				addNotification({ id: buildRes.buildId });
				// sendSnackBarEvent({ type: "success", message: "Test started successfully!" });
			});
		} else if (id === "RUN_LOCAL") {
			triggerLocalBuild(
				tests.list.map((test) => test.id),
				tests.list,
				null,
				"app"
			);
		}
	};
	const headerComponent = React.useMemo(() => {
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
	const isLoading = React.useMemo(() => !tests, [tests]);
	// To make delete experience fast
	const filteredTests = tests?.list?.length
		? tests.list.filter((test) => {
			return !((window as any).deletedTest || []).includes(test.id);
		})
		: [];

	const testContent = filteredTests.length ? <TestList deleteTest={handleTestDelete} tests={filteredTests} /> : <CreateFirstTest />;
	const content = <>
		{
			showProxyWarning.show ? (
				<ProxyConfigModifedToast onClose={() => setShowProxyWarning(false)} />
			) : ""
		}
		{testContent}
		{filteredTests.length < 3 && (<OnboardingSection />)}
	</>;
	const hasNotLoaded = isLoading || !animationComplete;
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
			headerRightSection={headerComponent}
			showHeader={!hasNotLoaded}
			css={loadingCSS()}
			title={selectedProject && !hasNotLoaded ? <TitleComponent project={selectedProject} /> : null}
		>
			{hasNotLoaded ? <LoadingProgressBar inAppLoading={false} /> : content}
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

