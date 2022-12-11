import { css } from "@emotion/react";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { getCurrentSelectedProjct, getProxyState } from "electron-app/src/store/selectors/app";
import { sendSnackBarEvent } from "electron-app/src/_ui/ui/containers/components/toast";
import { generateRandomTestName, turnOnProxyServers } from "electron-app/src/utils/renderer";
import React from "react";
import { useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedProjectTestsRequest } from "../../../../api/tests/tests.request";
import { useUser } from "../../../hooks/user";
import { LoadingProgressBar } from "../../containers/common/LoadingProgressBar";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import useRequest from "../../../utils/useRequest";
import { CreateFirstTest } from "./createFirstTest";
import { TestList } from "./testsList";
import { ButtonDropdown } from "../../components/buttonDropdown";
import { AddIconV3 } from "electron-app/src/_ui/constants/old_icons";
import { goFullScreen, performRunTests } from "electron-app/src/ipc/perform";
import { StickyFooter } from "../../containers/common/stickyFooter";
import { Footer } from "../../containers/common/footer";
import { useBuildNotifications } from "../../../hooks/tests";
import { triggerLocalBuild } from "../../../utils/recorder";
import { LinkPointer } from "../../components/LinkPointer";
import { linkOpen } from "electron-app/src/utils/url";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { ProxyConfigModifedToast } from "../projectList/proxyConfigModifiedToast";
import { OnboardingSection } from "./testList/onboarding";
import axios from "axios";
import { getAllDrafts, saveNewDraftTest } from "electron-app/src/api/tests/draft.tests";
import { getRecorderContext } from "electron-app/src/store/selectors/recorder";
import { TRecorderVariant } from "electron-app/src/store/reducers/recorder";
import { setRecorderContext } from "electron-app/src/store/actions/recorder";
import { ClipboardIcon } from "electron-app/src/_ui/constants/icons";

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

enum ITestTypeEnum {
	"DRAFT" = "DRAFT",
	"SAVED" = "SAVED",
}
const DashboardScreen = () => {
	const [currentTab, setCurrentTab] = React.useState<ITestTypeEnum>(ITestTypeEnum.SAVED);
	const [animationComplete, setAnimationComplete] = React.useState(false);
	const { userInfo, projects } = useUser();
	const { data: tests, mutate } = useRequest(userInfo?.isUserLoggedIn ? getSelectedProjectTestsRequest : () => null, { refreshInterval: 5000 });
	const { data: draftTests } = useRequest(getAllDrafts, { refreshInterval: 5000 });

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

	const listHeading = (
			<div className={"flex items-center"} css={css`color: #fff; font-size: 14rem;`}>
				<div css={[headingCss, hoverTab, currentTab === ITestTypeEnum.DRAFT ? notSelectedTextCss : undefined]} onClick={setCurrentTab.bind(this, ITestTypeEnum.SAVED)}>
					{filteredTests?.length} tests
				</div>
				{draftTests?.length ? (
					<div css={[hoverTab]} className={"flex items-center ml-16"} onClick={setCurrentTab.bind(this, ITestTypeEnum.DRAFT)}>
						<ClipboardIcon css={[css`path { fill: #4A4A4A}`, currentTab === ITestTypeEnum.DRAFT ? css`path { fill: rgba(255, 255, 255, 0.83) }` : undefined]} />
						<span className={"ml-8"} css={[draftHeadingCss, currentTab === ITestTypeEnum.SAVED ? notSelectedTextCss : undefined]}>{draftTests.length} drafts</span>
					</div>
				) : null}
			</div>
	);

	const filteredDraftTests = draftTests?.map((draft) => {
		return {...draft, testName: draft.name, firstRunCompleted: true};
	});
	const testContent = filteredTests.length && currentTab === ITestTypeEnum.SAVED ? <TestList listHeading={listHeading} deleteTest={handleTestDelete} tests={filteredTests} /> : null;
	const draftContent = (draftTests?.length && currentTab === ITestTypeEnum.DRAFT ? <TestList listHeading={listHeading} deleteTest={handleTestDelete} tests={filteredDraftTests} />: null);
	


	const content = <>
		{
			showProxyWarning.show ? (
				<ProxyConfigModifedToast onClose={() => setShowProxyWarning(false)} />
			) : ""
		}
		
		{testContent}
		{draftContent}
		{!testContent && !draftContent ? (<CreateFirstTest/>) : null}
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

const hoverTab = css`
	&:hover {
		opacity: 0.8;
	}
`;
const headingCss = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 14rem;
letter-spacing: 0.03em;

color: rgba(255, 255, 255, 0.83);

`;
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

const draftHeadingCss = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	letter-spacing: 0.03em;
	color: rgba(255, 255, 255, 0.83);

`;

const notSelectedTextCss = css`
color: #A6A6A6;

`;
export { DashboardScreen };

