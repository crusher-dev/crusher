import { css } from "@emotion/react";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { getCurrentSelectedProjct, getIsProxyInitializing, getProxyState } from "electron-app/src/store/selectors/app";
import { ProxyWarningContainer } from "electron-app/src/ui/components/proxy-warning";
import { sendSnackBarEvent } from "electron-app/src/ui/components/toast";
import { turnOnProxyServers } from "electron-app/src/utils/renderer";
import React from "react";
import { useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSelectedProjectTestsRequest } from "../../api/tests/tests.request";
import { useUser } from "../../api/user/user";
import { LoadingProgressBar } from "../../components/LoadingProgressBar";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import useRequest from "../../utils/useRequest";
import { CreateFirstTest } from "./createFirstTest";
import { DashboardFooter } from "./footer";
import { TestList } from "./testsList";
import Wrapper from "figma-design-scaler/dist/dist/main";
import { ButtonDropdown } from "../../components/buttonDropdown";
import { AddIconV3 } from "electron-app/src/ui/icons";
import { goFullScreen, performRunTests } from "electron-app/src/ui/commands/perform";
import { CloudIcon } from "../../icons";
import { StickyFooter } from "../../components/stickyFooter";
import { Footer } from "../../components/footer";
import { useBuildNotifications } from "../../hooks/tests";
import { triggerLocalBuild } from "../../utils/recorder";

const TitleComponent = ({ projectName }) => {

    return (
        <div css={titleStyle}>
            <span>
                <b css={titleBoldStyle}>{projectName}</b>
            </span>
        </div>
    );
};


const rocketIconStyle = css`
	font-size: 12px;
	color: #ffffff;
`;
const titleBoldStyle = css`
	font-weight: 700;
	font-size: 13.5rem;
	color: #fff !important;
`;
const titleCloudIconStyle = css`
	width: 12rem;
	height: 11rem;
	margin-left: 12rem;
`;
const titleStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;

	color: rgba(255, 255, 255, 0.67);

	display: flex;
	align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
const DashboardScreen = () => {
    const [animationComplete, setAnimationComplete] = React.useState(false);
    const { userInfo, projects } = useUser();
    const { data: tests, isValidating, mutate } = useRequest(userInfo && userInfo.isUserLoggedIn ? getSelectedProjectTestsRequest : () => null, { refreshInterval: 5000 })
    const [selectedProject, setSelectedProject] = React.useState(null);
    const [showProxyWarning, setShowProxyWarning] = React.useState({ show: false, testId: null, startUrl: null });
    const { addNotification } = useBuildNotifications();

    const navigate = useNavigate();
    const store = useStore();

    React.useEffect(() => {
        setTimeout(setAnimationComplete.bind(this, true), 2200)
    }, [])

    const handleTestDelete = React.useCallback(
        (idArr: Array<any>) => {
            // setTests(tests.filter((a) => a.id != id));
            if (!(window as any).deletedTest) {
                (window as any).deletedTest = [];
            }
            (window as any).deletedTest.push(...idArr);
            console.log("Id arr", idArr);
            mutate({ ...tests, list: tests.list.filter(test => { return !((window as any).deletedTest || []).includes(test.id) }) });
            for (let id of idArr) {
                // CloudCrusher.deleteTest(id).catch((err) => {
                //     sendSnackBarEvent({ message: "Error deleting test", type: "error" });
                // });
            }
        },
        [tests],
    );

    React.useEffect(() => {
        const selectedProjectId = getCurrentSelectedProjct(store.getState());
        if (!selectedProjectId)
            return navigate("/select-project");
        const proxyState = getProxyState(store.getState());
        if (window["showProxyWarning"] && !Object.keys(proxyState).length) {
            setShowProxyWarning({ show: true, testId: window["showProxyWarning"].testId, startUrl: window["showProxyWarning"].startUrl });
            window["showProxyWarning"] = false;
        }

        turnOnProxyServers();
        // @TODO: Cache this API
        if (selectedProjectId && userInfo && userInfo.projects) {
            const project = userInfo.projects.find((p) => (p.id == selectedProjectId));
            if (project) {
                setSelectedProject(project);
            }
        };
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
            triggerLocalBuild(tests.list.map(test => test.id));
        }
    };
    const headerComponent = React.useMemo(() => {
        return (
            <div css={headerComponentCss}>
                <ButtonDropdown
                    dropdownCss={buttonDropdownCss}
                    hideDropdown={true}
                    css={[buttonDropdownMainButtonCss, css`background: transparent !important; width: auto !important; border: none !important; margin-right: 18px;`]}
                    options={[
                        {
                            id: "SAVE", content: (<span css={createTestCss}>
                                <AddIconV3 css={createIconCss} /> <span>test</span>
                            </span>)
                        },
                    ]}
                    primaryOption={"SAVE"}
                    callback={handleCreateTest}
                />
                <ButtonDropdown
                    dropdownCss={buttonDropdownCss}
                    css={buttonDropdownMainButtonCss}
                    options={[
                        { id: "RUN_LOCAL", content: (<span>Run tests</span>) },
                        { id: "RUN_CLOUD", content: (<span>Run tests (cloud)</span>) },

                    ]}
                    primaryOption={"RUN_LOCAL"}
                    callback={handleRunCallback}
                />
            </div>

        );
    }, [handleRunCallback]);
    const isLoading = React.useMemo(() => (!tests), [tests]);
    // To make delete experience fast
    const filteredTests = tests && tests.list && tests.list.length ? tests.list.filter(test => { return !((window as any).deletedTest || []).includes(test.id) }) : [];

    const testContent = filteredTests.length ? (<TestList deleteTest={handleTestDelete} tests={filteredTests} />) : (<CreateFirstTest />);
    const content = showProxyWarning.show ? <ProxyWarningContainer testId={showProxyWarning.testId} exitCallback={setShowProxyWarning.bind(this, false)} startUrl={showProxyWarning.startUrl} /> : testContent;

    const hasNotLoaded = isLoading || !animationComplete;
    return (

        <CompactAppLayout footer={<><Footer /><StickyFooter /></>} headerRightSection={headerComponent} showHeader={!hasNotLoaded} css={loadingCSS(hasNotLoaded)} title={selectedProject && !hasNotLoaded ? <TitleComponent projectName={selectedProject.name} /> : null}>
            {hasNotLoaded ? (<LoadingProgressBar inAppLoading={false} />) : content}
        </CompactAppLayout>

    );
};

const headerComponentCss = css`
    display: flex;
    .dropdown-icon {
        background: transparent !important;
    }
`;
const loadingCSS = (hasNotLoaded) => css`
    background: #080809;
`;
const buttonDropdownCss = css`
	left: 0rem !important;
	height: max-content !important;
	top: calc(100% + 4rem) !important;
`;
const buttonDropdownMainButtonCss = css`
	width: 76rem;
	height: 30rem;
	padding: 0rem !important;
    border-radius: 6rem !important;
    background: hsla(268, 100%, 60%, 1) !important;

    font-family: 'Gilroy' !important;
    font-style: normal !important;
    font-weight: 600 !important;
    font-size: 14rem !important;

    color: #FFFFFF !important;
`;
const createIconCss = css`
    width: 11rem;
    height: 11rem;
`;
const createTestCss = css`
    display: flex;
    gap: 7rem;
    align-items: center;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 13.6rem;

    color: #FFFFFF;
`;

export { DashboardScreen };
