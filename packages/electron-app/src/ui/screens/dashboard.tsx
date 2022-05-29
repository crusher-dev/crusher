import React from "react";
import { css } from "@emotion/react";
import { Button } from "@dyson/components/atoms/button/Button";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { DownIcon, LoadingIconV2 } from "../icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { LoadingScreen } from "./loading";
import { getCloudUserInfo, getUserTests, goFullScreen, performReplayTestUrlAction } from "../commands/perform";
import { ModelContainerLayout } from "../layouts/modalContainer";


const PlusIcon = (props) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.825 4.608h-3.7V1.175a1.175 1.175 0 1 0-2.349 0v3.433H1.175a1.175 1.175 0 0 0 0 2.35h3.601v3.867a1.174 1.174 0 1 0 2.35 0V6.957h3.7a1.175 1.175 0 1 0 0-2.349Z"
      fill="#fff"
    />
  </svg>
)

const CreateTestLink = (props) => {
    return (
        <span css={createTestLinkStyle} {...props}>
            <PlusIcon css={css`width: 12px;`}/>
            <span>Create test</span>
        </span>
    )
}
const createTestLinkStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 500;
font-size: 14px;

color: #FFFFFF;
display: flex;
align-items: center;
gap: 10px;

:hover {
    opacity: 0.8;
}
`;


function TestList({userTests}) {
    const navigate = useNavigate();
    const [lastHoverItem, setLastHoverItem] = React.useState(0);

    return (
        <ul css={testItemStyle}>
            {userTests ? userTests.map((test, index) => {
                return (<li css={[lastHoverItem === index ? testItemHoverStyle : undefined]} onMouseEnter={setLastHoverItem.bind(this, index)}>
                    <span>{test.testName}</span>
                    {!test.firstRunCompleted ? (<LoadingIconV2 css={css`width: 16px; height: 16px; margin-left: 8px;`}/>) : ""}
                    <div className={"action-buttons"} css={[css`display: none; position: absolute; right: 18rem; top: 50%; transform: translateY(-50%); color: #9F87FF`, lastHoverItem === index ? css`display: block;` : undefined]}>
                        <div css={css`display: flex; align-items: center; gap: 18rem;`}>
                        <EditIcon css={css`width: 13rem; height: 13rem; :hover { opacity: 0.8; }`} onClick={() => { navigate("/recorder"); goFullScreen(); setTimeout(() => {performReplayTestUrlAction(test.id);}, 500); }}/>
                        <div css={css`display: flex; align-items: center; gap: 6rem; :hover { opacity: 0.8 }`} onClick={() => { navigate("/recorder"); goFullScreen(); setTimeout(() => {performReplayTestUrlAction(test.id);}, 500); }}>
                        <PlayIcon css={css`width: 10rem; height: 12rem;`}/>
                        <span css={runTextStyle}>Run</span>  
                        </div>
                        </div>
                    </div>
                </li>);
            }) : ""}
        </ul>
    )
}

const EditIcon = (props) => (
    <svg
    viewBox={"0 0 13 13"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m12.833 6.87-2.157-2.157a.537.537 0 0 0-.775 0l-.645.643V.886a.883.883 0 0 0-.883-.884H.883A.885.885 0 0 0 0 .885V8.34c0 .488.395.884.883.884h4.484l-.109.106a.842.842 0 0 0-.138.276l-.551 2.711c-.104.533.275.748.636.663l2.709-.554c.111 0 .194-.056.276-.138l4.643-4.646a.53.53 0 0 0 0-.772ZM1.06 8.165V1.063h7.137v5.346L6.434 8.162H1.06v.003Zm6.466 3.216-1.74.36.357-1.743 4.118-4.12L11.67 7.26l-4.144 4.12Z"
      fill="#7A7A7A"
    />
  </svg>
  )
  

const runTextStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13rem;


letter-spacing: 0.03em;
position: relative;
top: 2rem;

color: #B061FF;
`;

const PlayIcon = (props) => (
    <svg
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.386 14c-.23 0-.456-.062-.656-.178-.45-.258-.73-.76-.73-1.306V1.484C0 .937.28.436.73.178A1.303 1.303 0 0 1 2.07.195l9.296 5.644c.194.123.353.294.464.497a1.385 1.385 0 0 1-.464 1.824L2.07 13.805a1.317 1.317 0 0 1-.684.195Z"
        fill="#B061FF"
      />
    </svg>
  )

const testItemStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 14px;
letter-spacing: 0.03em;

color: #FFFFFF;

li {
    padding: 14px 46px;
    position: relative;
    display: flex;
}
`;

const testItemHoverStyle = css`
background: rgba(217, 217, 217, 0.04);
color: #9F87FF;
`;

function ActionButtonDropdown({ setShowActionMenu, ...props }) {

	const MenuItem = ({ label, onClick, ...props }) => {
		return (
			<div
				css={css`
					padding: 6rem 13rem;
					:hover {
						background: #687ef2 !important;
					}
				`}
				onClick={onClick}
			>
				{label}
			</div>
		);
	};

	const handleViewDetails = () => {
		setShowActionMenu(false);
	};
	return (
		<div
			className={"flex flex-col justify-between h-full"}
			css={css`
				font-size: 13rem;
				color: #fff;
			`}
		>
			<div>
				<MenuItem onClick={handleViewDetails} label={"View Details"} className={"close-on-click"} />
			</div>
		</div>
	);
}

const DashboardFooter = ({userTests}) => {
    const [showActionMenu, setShowActionMenu] = React.useState(false);
    const navigate = useNavigate();

    const handleCreateTest = () => {
        navigate("/recorder");
        goFullScreen();
    };

    return (<>
        <div css={footerLeftStyle}>
        {/* <div><span css={infoTextStyle}>5 spec tests</span></div> */}
        <div><span css={infoTextStyle}>{userTests.length} no-code tests</span></div>
    </div>
    <div css={footerRightStyle}>
        <div>
            <CreateTestLink onClick={handleCreateTest}/>
        </div>
        <div css={css`margin-left: 22px;`}>
            
        <Dropdown
    initialState={showActionMenu}
    component={<ActionButtonDropdown setShowActionMenu={setShowActionMenu.bind(this)}/>}
    callback={setShowActionMenu.bind(this)}
    dropdownCSS={css`
        left: 0rem;
        width: 150rem;
    `}
>
        <Button
            id={"verify-save-test"}
            onClick={(e) => {
                e.preventDefault();
            }}
            bgColor="tertiary-outline"
            css={saveButtonStyle}
        >
            <span>Run all tests</span>
        </Button>

    <div
        css={css`
            background: #9461ff;
            display: flex;
            align-items: center;
            padding: 0rem 9rem;
            border-top-right-radius: 6rem;
            border-bottom-right-radius: 6rem;
            border-left-color: #00000036;
            border-left-width: 2.5rem;
            border-left-style: solid;
            :hover {
                opacity: 0.8;
            }
        `}
    >
        <DownIcon
            fill={"#fff"}
            css={css`
                width: 9rem;
            `}
        />
    </div>
</Dropdown>
        </div>
    </div></>
    )
}
function DashboardScreen() {
    const [userTests, setUserTests] = React.useState([]);
    const [selectedProject, setSelectedProject] = React.useState(null);
    const store = useStore();
    const userAccountInfo = useSelector(getUserAccountInfo);
    const [userInfo, setUserInfo] = React.useState({});

    let navigate = useNavigate();
      
    React.useEffect(()=> {
        document.querySelector("html").style.fontSize = "1px";
        const userInfo = getUserAccountInfo(store.getState());
        if(!userInfo) {
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        }
    }, []);

    React.useEffect(() => {
        if(userAccountInfo) {

            getCloudUserInfo().then((userInfo) => {
                setUserInfo(userInfo);

                const queryParamString = window.location.hash.split("?")[1];
                const queryParams = new URLSearchParams(queryParamString);
                const projectId = queryParams.get("project_id") || window.localStorage.getItem("projectId");
                setSelectedProject(projectId);
                if(!projectId) {
                    navigate("/select-project");
                    return;
                }
                window.localStorage.setItem("projectId", projectId);
            
                getUserTests(projectId).then((tests) => {
                    console.log("User tests are", tests.list);
    
                    setUserTests(tests.list);
                });
            });

         
        }  
    }, [userAccountInfo]);

    const userProject = userInfo && userInfo.projects ? userInfo.projects.find((p) => p.id == selectedProject) : null;
    
    console.log("User project", userProject);
    const userProjectName = userProject ? userProject.name : null;

    const TitleComponent = React.useMemo(() => {
        return (
            <div css={titleStyle}>
                <span>
                    <span css={rocketIconStyle}>🚀</span>
                    &nbsp;&nbsp;
                    <b css={titleBoldStyle}>{userProjectName}</b> - master
                </span>
                <CloudIcon css={titleCloudIconStyle}/>
            </div>
        )
    }, [userProjectName]);

    if(!userAccountInfo) {
        return (<LoadingScreen/>)
    }

    return (
		<ModelContainerLayout title={TitleComponent} footer={<DashboardFooter userTests={userTests}/>}>
             <TestList userTests={userTests}/>
		</ModelContainerLayout>
	);
}

const rocketIconStyle = css`font-size: 12px;`;
const titleBoldStyle = css`font-weight: 700;`;
const titleCloudIconStyle = css`width: 16rem; height: 11rem; margin-left: 12rem;`;
const titleStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 14px;

color: #FFFFFF;

    display: flex;
    align-items: center;
`;

const CloudIcon = (props) => (
    <svg
      viewBox={"0 0 16 11"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.854 4.47C12.566 1.953 10.504 0 8 0 5.497 0 3.433 1.953 3.147 4.47 1.409 4.47 0 5.932 0 7.735 0 9.538 1.409 11 3.146 11h9.708C14.59 11 16 9.538 16 7.735c0-1.803-1.409-3.265-3.146-3.265Z"
        fill="#A5ED6D"
      />
    </svg>
  )

const saveButtonStyle = css`
	width: 120rem;
	height: 30rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	border-right-width: 0rem;
	border-top-right-radius: 0rem;
	border-bottom-right-radius: 0rem;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
		border-right-width: 0rem;
		border-top-right-radius: 0rem;
		border-bottom-right-radius: 0rem;
	}
`;
const infoTextStyle = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 14rem;

    color: rgba(255, 255, 255, 0.67);
`;

const footerLeftStyle = css`
    display: flex;
    align-items: center;
    gap: 24px;
`;
const footerRightStyle = css`
    display: flex;
    margin-left: auto;
    align-items: center;
`;

export { DashboardScreen };