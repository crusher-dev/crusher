import React from "react";
import { css, Global } from "@emotion/react";
import { BrowserButton } from "../components/buttons/browser.button";
import { Button } from "@dyson/components/atoms/button/Button";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { CrusherHammerColorIcon, DownIcon } from "../icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import { getAppSettings, getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { LoadingScreen } from "./loading";
import { getCloudUserInfo, getUserTests, goFullScreen, performReplayTest, performReplayTestUrlAction } from "../commands/perform";
import { shell } from "electron";
import { useInView } from "react-intersection-observer";

function Link({children, ...props}) { 
    return(
        <span css={linkStyle} {...props}>
            {children}
        </span>
    )
}
const linkStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 14rem;

color: #FFFFFF;

:hover {opacity: 0.8}
`



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


function ProjectList({userInfo}) {
    const navigate = useNavigate();


    return (
        <ul css={testItemStyle}>
            {userInfo && userInfo.projects ? userInfo.projects.map((project) => {
                return (<li onClick={() => { navigate("/test-list?project_id=" + project.id); }}>
                    <span>{project.name}</span>
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
font-size: 15rem;
letter-spacing: 0.03em;

color: #FFFFFF;

li {
    padding: 14px 46px;
    position: relative;
    .action-buttons {
        display: none;
    }
    :hover {
        background: rgba(217, 217, 217, 0.04);
        color: #9F87FF;
        .action-buttons {
            display: block;
        }
    }
}
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

function SelectProjectScreen() {
    const [showActionMenu, setShowActionMenu] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState({});
    const store = useStore();
    const userAccountInfo = useSelector(getUserAccountInfo);

    let navigate = useNavigate();

    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
      });

      
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
            });
        }
    }, [userAccountInfo]);

    const handleCreateTest = () => {
        const clientRect = document.querySelector(".main-container").getBoundingClientRect(); window["lastContainerSize"] = {width: clientRect.width, height: clientRect.height};
        navigate("/recorder");
        goFullScreen();
    }

    if(!userAccountInfo) {
        return (<LoadingScreen/>)
    }


    return (
        <div className={"main-container"} ref={ref} css={[containerStyle, inView ? css`width: 100%; height: 100%;` : undefined]}>
           	<div
				css={css`
					height: 32px;
					width: 100%;
					background: transparent;
					display: flex;
					justify-content: center;
					align-items: center;
                    position: absolute
				`}
				className={"drag"}
			></div>
            <div css={headerStyle}>
                <div css={css`    position: relative;
    top: 50%;
    transform: translateY(-50%);`}>
        <div css={localProjectTextStyle}>Your local project</div>
                </div>
                <div css={logoStyle}><CrusherHammerColorIcon css={css`width: 23px; height: 23px;`}/></div>
                <div css={css`    position: relative;
    top: 50%;
    transform: translateY(-50%);`}><Link onClick={() => { 
        shell.openExternal("https://docs.crusher.dev");
    }}>Open App</Link></div>
            </div>
            <div css={contentStyle}>
                <ProjectList userInfo={userInfo}/>
            </div>
            <div css={footerStyle}>
                <div css={footerLeftStyle}>
                    {/* <div><span css={infoTextStyle}>5 spec tests</span></div> */}
                    <div><span css={infoTextStyle}>{userInfo.projects ? userInfo.projects.length : 0} no-code tests</span></div>
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
                </div>
            </div>
        </div>
    )
}

const localProjectTextStyle = css`
font-family: Gilroy;
font-style: normal;
font-weight: 600;
font-size: 16rem;

color: #FFFFFF;

`;
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
const contentStyle = css`
    flex: 1;
    padding-top: 18px;
    overflow-y: overlay;
    ::-webkit-scrollbar {
        background: transparent;
        width: 8rem;
    }
    ::-webkit-scrollbar-thumb {
        background: white;
        border-radius: 14rem;
    }
`;
const footerStyle = css`
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px 28px;
    display: flex;
`;
const headerStyle = css`
    display: flex;
    padding: 20px 47px;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

`;

const logoStyle = css`
    flex: 1;
    display: flex;
    justify-content: center;
`;

const navBarStyle = css`
display: flex;
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 16px;

color: #FFFFFF;
.navItem {
    :hover {
        opacity: 0.8;
    }
}
`;

const containerStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 100%; height: 100%;
    background: #161617;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: width 0.3s, height 0.3s;
    display: flex;
    flex-direction: column;
`;

const statusTextStyle = css`
    margin-top: 24px;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
`;

export { SelectProjectScreen };