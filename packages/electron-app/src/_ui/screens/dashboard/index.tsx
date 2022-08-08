import React from "react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { useSelector, useStore } from "react-redux";
import { getCurrentSelectedProjct, getIsProxyInitializing, getProxyState, getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { useNavigate } from "react-router-dom";
import { CreateFirstTest } from "./createFirstTest";
import { getSelectedProjectTests, getUserAccountProjects, getSelectedProjectTestsRequest } from "electron-app/src/utils";
import { TestList } from "./testsList";
import { DashboardFooter } from "./footer";
import { LoadingProgressBar } from "../../components/LoadingProgressBar";
import { css } from "@emotion/react";
import { turnOnProxyServers } from "electron-app/src/utils/renderer";
import { StatusMessageBar } from "electron-app/src/ui/layouts/modalContainer";
import { performDeleteTest } from "electron-app/src/ui/commands/perform";
import { sendSnackBarEvent } from "electron-app/src/ui/components/toast";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { ProxyWarningContainer } from "electron-app/src/ui/components/proxy-warning";
import { checkIfLoggedIn } from "electron-app/src/utils/url";
import useRequest from "../../utils/useRequest";
import { useUser } from "../../api/user";

const TitleComponent = ({ projectName }) => {
    const proxyIsInitializing = useSelector(getIsProxyInitializing);
	const proxyState = useSelector(getProxyState);

    const isProxyWorking = Object.keys(proxyState).length;
    return (
        <div css={titleStyle}>
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
`;
const DashboardScreen = () => {
    const {userInfo, projects, error: userError} = useUser();
    const { data: tests, isValidating, error } = useRequest(getSelectedProjectTestsRequest, { refreshInterval: 5000 })
    const [selectedProject, setSelectedProject] = React.useState(null);
    const [showProxyWarning, setShowProxyWarning] = React.useState({show: false, testId: null, startUrl: null});

    const navigate = useNavigate();
    const store = useStore();


    const handleTestDelete = React.useCallback(
        (id) => {
            // setTests(tests.filter((a) => a.id != id));
            if(!(window as any).deletedTest) {
                (window as any).deletedTest = [];
            }
            (window as any).deletedTest.push(id);
            CloudCrusher.deleteTest(id).catch((err) => {
                sendSnackBarEvent({ message: "Error deleting test", type: "error" });
            });
        },
        [tests],
    );
    React.useEffect(() => {
        const selectedProjectId = getCurrentSelectedProjct(store.getState());
        if(!selectedProjectId)
            navigate("/select-project");
        const loggedIn = checkIfLoggedIn();
        if(!loggedIn) {
            return navigate("/login");
		}
        const proxyState = getProxyState(store.getState());
        if (window["showProxyWarning"] && !Object.keys(proxyState).length) {
            setShowProxyWarning({show: true, testId: window["showProxyWarning"].testId, startUrl: window["showProxyWarning"].startUrl});
            window["showProxyWarning"] = false;
        }
        
        turnOnProxyServers();
        // @TODO: Cache this API
        if(selectedProjectId && userInfo &&  userInfo.projects) {
            const project = userInfo.projects.find((p) => (p.id == selectedProjectId));
            if(project) {
                setSelectedProject(project);
            }
        };
    }, [projects]);

    React.useMemo(() => {
            console.error("Error is", userError);
    }, [userError]);
    const isLoading = React.useMemo(() => (!tests), [tests]);
    const testContent = tests && tests.list && tests.list.length ? (<TestList deleteTest={handleTestDelete} tests={tests.list}/>) : (<CreateFirstTest />);
    const content = showProxyWarning.show ? <ProxyWarningContainer testId={showProxyWarning.testId} exitCallback={setShowProxyWarning.bind(this, false)} startUrl={showProxyWarning.startUrl} /> : testContent;
    return (
        <CompactAppLayout title={selectedProject ? <TitleComponent projectName={selectedProject.name}/> : null} footer={<DashboardFooter tests={tests || []}/>}>
               {isLoading ? (<LoadingProgressBar/>) : content}
        </CompactAppLayout>
    );
};

export { DashboardScreen };