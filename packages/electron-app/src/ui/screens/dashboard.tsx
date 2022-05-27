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
import { getUserTests, performReplayTest, performReplayTestUrlAction } from "../commands/perform";
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


function TestList({userTests}) {
    const navigate = useNavigate();


    return (
        <ul css={testItemStyle}>
            {userTests ? userTests.map((test) => {
                return (<li onClick={() => { navigate("/recorder"); setTimeout(() => {performReplayTestUrlAction(test.id);}, 500); }}>{test.testName}</li>);
            }) : ""}
        </ul>
    )
}

const testItemStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 15rem;
letter-spacing: 0.03em;

color: #FFFFFF;

li {
    padding: 14px 46px;
    :hover {
        background: rgba(217, 217, 217, 0.04);
        color: #9F87FF;
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

function DashboardScreen() {
    const [showActionMenu, setShowActionMenu] = React.useState(false);
    const [userTests, setUserTests] = React.useState([]);
    const store = useStore();
    const userAccountInfo = useSelector(getUserAccountInfo);

    let navigate = useNavigate();

    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
      });

      
    React.useEffect(()=> {
        const userInfo = getUserAccountInfo(store.getState());
        if(!userInfo) {
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        }
    }, []);

    React.useEffect(() => {
        if(userAccountInfo) {
            getUserTests().then((tests) => {
                console.log("User tests are", tests.list);

                setUserTests(tests.list);
            });
        }  
    }, [userAccountInfo]);

    const handleCreateTest = () => {
        const clientRect = document.querySelector(".main-container").getBoundingClientRect(); window["lastContainerSize"] = {width: clientRect.width, height: clientRect.height};
        navigate("/create-test");
    }

    if(!userAccountInfo) {
        return (<LoadingScreen/>)
    }


    return (
        <div className={"main-container"} ref={ref} css={[containerStyle, window["lastContainerSize"] ? css`width: ${window["lastContainerSize"].width}px; height: ${window["lastContainerSize"].height}px;` : undefined, inView ? css`width: 1028rem; height: 570rem;` : undefined]}>
            <div css={headerStyle}>
                <div css={css`    position: relative;
    top: 50%;
    transform: translateY(-50%);`}>
                    <Link>{userTests.length} tests</Link>
                </div>
                <div css={logoStyle}><CrusherHammerColorIcon css={css`width: 23px; height: 23px;`}/></div>
                <div css={css`    position: relative;
    top: 50%;
    transform: translateY(-50%);`}><Link onClick={() => { 
        shell.openExternal("https://docs.crusher.dev");
    }}>Open App</Link></div>
            </div>
            <div css={contentStyle}>
                <TestList userTests={userTests}/>
            </div>
            <div css={footerStyle}>
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
					width: 130rem;
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
                        <span>Run test</span>
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
const saveButtonStyle = css`
	width: 80rem;
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
    width: 1028rem; height: 570rem;
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

export { DashboardScreen };