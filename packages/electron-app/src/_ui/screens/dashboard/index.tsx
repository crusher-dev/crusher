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
import { goFullScreen } from "electron-app/src/ui/commands/perform";

const TitleComponent = ({ projectName }) => {
    const proxyIsInitializing = useSelector(getIsProxyInitializing);
    const proxyState = useSelector(getProxyState);

    const isProxyWorking = Object.keys(proxyState).length;
    return (
        <div css={titleStyle}>¯
            <span>
                <span css={rocketIconStyle}>🚀</span>
                &nbsp;
                <b css={titleBoldStyle}>{projectName}</b>
            </span>
            <CloudIcon
                shouldAnimateGreen={proxyIsInitializing}
                css={[
                    titleCloudIconStyle,
                    proxyIsInitializing
                        ? css``
                        : isProxyWorking
                            ? undefined
                            : css`
                                path {
                                    fill: rgba(0, 0, 0, 0.8);
                                }
                          `,
                ]}
            />
        </div>
    );
};

const CloudIcon = ({ shouldAnimateGreen, ...props }) => {
    return (
        <svg viewBox={"0 0 16 11"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            {shouldAnimateGreen ? (
                <linearGradient id="lg" x1="0.5" y1="1" x2="0.5" y2="0">
                    <stop offset="0%" stop-opacity="1" stop-color="#A5ED6D" />
                    <stop offset="40%" stop-opacity="1" stop-color="#A5ED6D">
                        <animate attributeName="offset" values="0;1" repeatCount="indefinite" dur="0.8s" begin="0s" />
                    </stop>
                    <stop offset="40%" stop-opacity="0" stop-color="#A5ED6D">
                        <animate attributeName="offset" values="0;1" repeatCount="indefinite" dur="0.8s" begin="0s" />
                    </stop>
                    <stop offset="100%" stop-opacity="0" stop-color="#A5ED6D" />
                </linearGradient>
            ) : (
                ""
            )}
            <path
                d="M12.854 4.47C12.566 1.953 10.504 0 8 0 5.497 0 3.433 1.953 3.147 4.47 1.409 4.47 0 5.932 0 7.735 0 9.538 1.409 11 3.146 11h9.708C14.59 11 16 9.538 16 7.735c0-1.803-1.409-3.265-3.146-3.265Z"
                fill={shouldAnimateGreen ? "url(#lg)" : "#A5ED6D"}
                stroke={"#fff"}
                strokeWidth="0.75"
            />
        </svg>
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

    const navigate = useNavigate();
    const store = useStore();

    React.useEffect(() => {
        setTimeout(setAnimationComplete.bind(this, true), 2200)
    }, [])

    const handleTestDelete = React.useCallback(
        (id) => {
            // setTests(tests.filter((a) => a.id != id));
            if (!(window as any).deletedTest) {
                (window as any).deletedTest = [];
            }
            (window as any).deletedTest.push(id);
            mutate({ ...tests, list: tests.list.filter(test => { return !((window as any).deletedTest || []).includes(test.id) }) })
            CloudCrusher.deleteTest(id).catch((err) => {
                sendSnackBarEvent({ message: "Error deleting test", type: "error" });
            });
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

    const headerComponent = React.useMemo(() => {
        return (
            <div css={headerComponentCss}>
                    <ButtonDropdown
                        dropdownCss={buttonDropdownCss}
                        css={[buttonDropdownMainButtonCss, css`background: transparent !important; width: auto !important; border: none !important;`]}
                        options={[
                            {id: "SAVE", content: (<span css={createTestCss}>
                                <AddIconV3 css={createIconCss}/> <span>test</span>
                            </span>)},
                        ]}
                        primaryOption={"SAVE"}
                        callback={handleCreateTest}
                    />
                   <ButtonDropdown
                        dropdownCss={buttonDropdownCss}
                        css={buttonDropdownMainButtonCss}
                        options={[
                            {id: "SAVE", content: (<span>Run test</span>)},
                        ]}
                        primaryOption={"SAVE"}
                        callback={() => {}}
                    />
            </div>
         
        );
    }, []);
    const isLoading = React.useMemo(() => (!tests), [tests]);
    // To make delete experience fast
    const testContent = tests && tests.list && tests.list.length ? (<TestList deleteTest={handleTestDelete} tests={tests.list.filter(test => { return !((window as any).deletedTest || []).includes(test.id); })} />) : (<CreateFirstTest />);
    const content = showProxyWarning.show ? <ProxyWarningContainer testId={showProxyWarning.testId} exitCallback={setShowProxyWarning.bind(this, false)} startUrl={showProxyWarning.startUrl} /> : testContent;

    const hasNotLoaded = isLoading || !animationComplete;
    return (
        // <Wrapper figmaUrl={"https://www.figma.com/proto/MsJZCnY5NvrDF4kL1oczZq/Crusher-%7C-Aug?node-id=1638%3A5550&scaling=min-zoom&page-id=988%3A3439&starting-point-node-id=988%3A3817"}>
            <CompactAppLayout headerRightSection={headerComponent} showHeader={!hasNotLoaded} css={loadingCSS(hasNotLoaded)} title={selectedProject && !hasNotLoaded ? <TitleComponent projectName={selectedProject.name} /> : null} footer={!hasNotLoaded && <DashboardFooter tests={tests ? tests.list : undefined || []} />}>
                {hasNotLoaded ? (<LoadingProgressBar inAppLoading={false} />) : content}
            </CompactAppLayout>
        // </Wrapper>
    );
};

const headerComponentCss = css`
    display: flex;
`;
const loadingCSS = (hasNotLoaded) => css`
    background: ${hasNotLoaded ? "#0C0C0C" : "#0C0C0C"};
    .dropdown-icon {
        background: transparent !important;
    }
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
