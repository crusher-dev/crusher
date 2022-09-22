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
import { Input } from "@dyson/components/atoms";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { getRecorderInfo } from "electron-app/src/store/selectors/recorder";
import { devices } from "electron-app/src/devices";
import { setDevice, setSiteUrl, setTestName } from "../../store/actions/recorder";
import { useInView } from "react-intersection-observer";

function Link({ children, ...props }) {
	return (
		<span css={linkStyle} {...props}>
			{children}
		</span>
	);
}
const linkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;

	color: #ffffff;

	:hover {
		opacity: 0.8;
	}
`;

const PlusIcon = (props) => (
	<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M10.825 4.608h-3.7V1.175a1.175 1.175 0 1 0-2.349 0v3.433H1.175a1.175 1.175 0 0 0 0 2.35h3.601v3.867a1.174 1.174 0 1 0 2.35 0V6.957h3.7a1.175 1.175 0 1 0 0-2.349Z"
			fill="#fff"
		/>
	</svg>
);

function TestList({ userTests }) {
	const navigate = useNavigate();

	return (
		<ul css={testItemStyle}>
			{userTests
				? userTests.map((test) => {
						return (
							<li
								onClick={() => {
									navigate("/recorder");
									setTimeout(() => {
										performReplayTestUrlAction(test.id);
									}, 500);
								}}
							>
								{test.testName}
							</li>
						);
				  })
				: ""}
		</ul>
	);
}

const testItemStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 15rem;
	letter-spacing: 0.03em;

	color: #ffffff;

	li {
		padding: 14px 46px;
		:hover {
			background: rgba(217, 217, 217, 0.04);
			color: #9f87ff;
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

const DeviceItem = ({ label }) => {
	return (
		<div
			css={css`
				width: 100%;
			`}
		>
			{label}
		</div>
	);
};

const recorderDevices = devices
	.filter((device) => device.visible)
	.map((device) => ({
		device: device,
		value: device.id,
		label: device.name,
		component: <DeviceItem label={device.name} />,
	}));

const selectBoxStyle = css`
	margin-left: auto;
	.selectBox {
		:hover {
			border: none;
			border-left-width: 1rem;
			border-left-style: solid;
			border-left-color: #181c23;
			background: black;
		}
		input {
			width: 50rem;
			height: 30rem;
		}
		padding: 14rem;
		height: 30rem !important;
		border: none;
		background: black;
		border-left-width: 1rem;
		border-left-style: solid;
		border-left-color: #181c23;
	}
	.selectBox__value {
		margin-right: 10rem;
		font-size: 13rem;
	}
	width: 104rem;
`;

const inputStyle = css`
	background: #1a1a1c;
	border-radius: 6rem;
	border: 1rem solid #43434f;
	font-family: Gilroy;
	font-size: 14rem;
	min-width: 358rem;
	color: #fff;
	outline: nonet;
	margin-left: auto;
`;

const inputContainerStyle = css`
	display: flex;
	align-items: center;
	color: #fff;
`;

function CreateTestScreen() {
	const [showActionMenu, setShowActionMenu] = React.useState(false);
	const [userTests, setUserTests] = React.useState([]);
	const store = useStore();
	const userAccountInfo = useSelector(getUserAccountInfo);

	let navigate = useNavigate();
	const [testName, setTestNameState] = React.useState("");
	const [testUrl, setTestUrl] = React.useState("");
	const [selectedDevice, setSelectedDevice] = React.useState([recorderDevices[0].value]);

	const handleChangeDevice = (selected) => {
		const device = recorderDevices.find((device) => device.value === selected[0])?.device;
		setSelectedDevice([selected[0]]);
	};

	const handleCreateTest = () => {
		navigate("/recorder");
	};

	const { ref, inView, entry } = useInView({
		/* Optional options */
		threshold: 0,
	});

	React.useEffect(() => {
		document.querySelector("html").style.fontSize = "1px";
	}, []);

	return (
		<div className={"main-container"} css={[containerStyle]} ref={ref}>
			<div
				css={css`
					height: 32px;
					width: 100%;
					background: transparent;
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
				`}
				className={"drag"}
			></div>
			<div css={headerStyle}>
				<div
					css={css`
						position: relative;
						top: 50%;
						transform: translateY(-50%);
					`}
				>
					{/* <Link onClick={() => {  const clientRect = document.querySelector(".main-container").getBoundingClientRect(); window["lastContainerSize"] = {width: clientRect.width, height: clientRect.height}; navigate("/"); }}>Back</Link> */}
				</div>
				<div css={logoStyle}>
					<CrusherHammerColorIcon
						css={css`
							width: 23px;
							height: 23px;
						`}
					/>
				</div>
				<div
					css={css`
						position: relative;
						top: 50%;
						transform: translateY(-50%);
					`}
				>
					<Link
						onClick={() => {
							shell.openExternal("https://docs.crusher.dev");
						}}
					>
						Open App
					</Link>
				</div>
			</div>
			<div css={contentStyle}>
				<div
					css={css`
						padding: 4rem 34rem;
					`}
				>
					<div
						css={css`
							font-family: Cera Pro;
							font-size: 18rem;
							font-weight: bold;
							color: #fff;
						`}
					>
						Create test
					</div>
					<div
						css={css`
							margin-top: 26rem;
						`}
					>
						<div css={inputContainerStyle}>
							<div
								css={css`
									font-size: 13rem;
									color: rgb(255, 255, 255, 0.7);
									font-weight: 600;
								`}
							>
								Test name
							</div>
							<Input
								className={"test-name-input"}
								css={inputStyle}
								placeholder={"Enter name of your test"}
								size={"medium"}
								initialValue={testName}
								autoFocus={true}
								onChange={(e) => {
									setTestNameState(e.target.value);
								}}
							/>
						</div>
						<div
							css={[
								inputContainerStyle,
								css`
									margin-top: 24rem;
								`,
							]}
						>
							<div
								css={css`
									font-size: 13rem;
									color: rgb(255, 255, 255, 0.7);
									font-weight: 600;
								`}
							>
								App URL
							</div>
							<Input
								css={inputStyle}
								placeholder={"Enter url to your app"}
								size={"medium"}
								initialValue={testUrl}
								onChange={(e) => {
									setTestUrl(e.target.value);
								}}
							/>
						</div>
						<div
							css={[
								inputContainerStyle,
								css`
									margin-top: 24rem;
								`,
							]}
						>
							<div
								css={css`
									font-size: 13rem;
									color: rgb(255, 255, 255, 0.7);
									font-weight: 600;
								`}
							>
								Device
							</div>
							<SelectBox
								selected={selectedDevice}
								callback={handleChangeDevice}
								className={"target-device-dropdown"}
								css={selectBoxStyle}
								values={recorderDevices}
							/>
						</div>
					</div>
				</div>
			</div>
			<div css={footerStyle}>
				<div css={footerLeftStyle}>
					{/* <div><span css={infoTextStyle}>5 spec tests</span></div> */}
					<div>
						<span css={infoTextStyle}>View docs</span>
					</div>
				</div>
				<div css={footerRightStyle}>
					<div
						css={css`
							margin-left: 22px;
						`}
					>
						<Button
							id={"verify-save-test"}
							onClick={(e) => {
								e.preventDefault();
								console.log("Selected device is", selectedDevice);
								store.dispatch(setDevice(selectedDevice[0]));
								store.dispatch(setTestName(testName));
								store.dispatch(setSiteUrl(testUrl));
								navigate("/recorder");
							}}
							bgColor="tertiary-outline"
							css={saveButtonStyle}
						>
							<span>Create test</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
const saveButtonStyle = css`
	width: 120rem;
	height: 30rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: bold;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
	}
`;
const infoTextStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;

	color: rgba(255, 255, 255, 0.67);

	:hover {
		opacity: 0.8;
	}
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
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 16px;

	color: #ffffff;
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
	width: 100%;
	height: 100%;
	transition: width 0.3s, height 0.3s;
	background: #161617;
	border-radius: 16px;
	border: 1px solid rgba(255, 255, 255, 0.08);

	display: flex;
	flex-direction: column;
`;

const statusTextStyle = css`
	margin-top: 24px;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	color: #ffffff;
`;

export { CreateTestScreen };
