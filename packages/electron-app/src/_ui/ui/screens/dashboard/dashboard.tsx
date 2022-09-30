import React from "react";
import { css } from "@emotion/react";
import { Button } from "@dyson/components/atoms/button/Button";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { DownIcon, LoadingIconV2 } from "../../../constants/old_icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import { getCurrentSelectedProjct, getIsProxyInitializing, getProxyState, getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { LoadingScreen } from "../loading";
import {
	getCloudUserInfo,
	getUserTests,
	goFullScreen,
	performDeleteTest,
	performReplayTestUrlAction,
	performRunTests,
	turnOnProxy,
	updateTestName,
} from "../../../commands/perform";
import { sendSnackBarEvent } from "../../containers/components/toast";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { shell } from "electron";
import { CreateFirstTest } from "../../containers/components/create-first-test";
import { ProxyWarningContainer } from "../../containers/components/proxy-warning";

import { setSelectedProject } from "electron-app/src/store/actions/app";
import { getUserAccountProjects } from "electron-app/src/utils";
import { checkIfLoggedIn, resolveToFrontend } from "electron-app/src/utils/url";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { InsufficientPermissionScreen } from "../inSufficientPermission";

const PlusIcon = (props) => (
	<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M10.825 4.608h-3.7V1.175a1.175 1.175 0 1 0-2.349 0v3.433H1.175a1.175 1.175 0 0 0 0 2.35h3.601v3.867a1.174 1.174 0 1 0 2.35 0V6.957h3.7a1.175 1.175 0 1 0 0-2.349Z"
			fill="#fff"
		/>
	</svg>
);

const CreateTestLink = (props) => {
	return (
		<span css={createTestLinkStyle} {...props}>
			<PlusIcon
				css={css`
					width: 8px;
				`}
			/>
			<span>New test</span>
		</span>
	);
};
const createTestLinkStyle = css`

	font-weight: 500;
	font-size: 14px;
	line-height: 14px;

	color: #ffffff;
	display: flex;
	align-items: center;
	gap: 8px;

	span {
		margin-top: 0.6rem;
	}

	:hover {
		opacity: 0.8;
		color: #b061ff;
		path {
			fill: #b061ff;
		}
	}
`;

function TestListItem({ test, isActive, deleteItem, setLockState, projectId, onMouseEnterCallback }) {
	const [isEditMode, setIsEditMode] = React.useState(false);
	const [testName, setTestName] = React.useState(test.testName);
	const [showMenu, setShowMenu] = React.useState({ shouldShow: false, pos: null });
	const inputRef = React.useRef(null);
	const navigate = useNavigate();
	const containerRef = React.useRef(null);

	const handleDoubleClick = React.useCallback(() => {
		setIsEditMode(true);
		setTimeout(() => {
			inputRef.current.focus();
			inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
		});
	}, [inputRef]);

	const handleSave = () => {
		setIsEditMode(false);

		updateTestName(test.id, testName);
	};

	const handleKeyDown = () => {
		if (event.key === "Enter") {
			handleSave();
		}
	};

	const handleRun = React.useCallback(() => {
		navigate("/recorder");
		goFullScreen();
		performReplayTestUrlAction(test.id, true);
	}, [test, projectId]);

	const handleOutsideClick = React.useCallback(() => {
		handleSave();
	}, [inputRef]);

	const handleRightClick = (e) => {
		const pos = { x: e.clientX, y: e.clientY };
		const constainerRects = containerRef.current.getBoundingClientRect();

		const dropdownPos = { x: pos.x - constainerRects.left, y: pos.y - constainerRects.top };
		setShowMenu({ shouldShow: true, pos: dropdownPos });
		setLockState(true);
	};

	const InnerComponent = (
		<span onDoubleClick={handleDoubleClick}>
			<input
				size={isEditMode ? 20 : testName.length}
				ref={inputRef}
				css={[
					css`
						background: transparent;
						border: 1px solid transparent;
						padding: 6px 8px;
					`,
					isEditMode
						? css`
								border: 1px solid rgba(255, 255, 255, 0.25);
								border-radius: 4px;
						  `
						: undefined,
				]}
				onKeyDown={handleKeyDown}
				onChange={(e) => {
					setTestName(e.target.value);
				}}
				value={testName}
				disabled={!isEditMode}
			/>
		</span>
	);

	const handleDropdownCallack = React.useCallback(
		(val) => {
			setLockState(val);
			if (!val) {
				setShowMenu({ shouldShow: false, pos: null });
			} else {
				if (showMenu.pos) return;
				setShowMenu(val);
			}
		},
		[showMenu],
	);

	return (
		<li
			ref={containerRef}
			css={[
				css`
					position: relative;
				`,
				isActive ? testItemHoverStyle : undefined,
			]}
			onContextMenu={handleRightClick}
			onMouseEnter={onMouseEnterCallback.bind(this, showMenu)}
		>
			{isEditMode ? <OnOutsideClick onOutsideClick={handleOutsideClick}>{InnerComponent}</OnOutsideClick> : InnerComponent}
			{showMenu?.pos ? (
				<Dropdown
					initialState={true}
					css={css`
						position: absolute;
						left: ${showMenu.pos.x}px;
						top: ${showMenu.pos.y}px;
					`}
					component={
						<TestItemMenuDropdown
							draftJobId={test.draftBuildId}
							testId={test.id}
							deleteTest={deleteItem}
							setIsEditMode={handleDoubleClick}
							setShowActionMenu={handleDropdownCallack.bind(this)}
						/>
					}
					callback={handleDropdownCallack.bind(this)}
					dropdownCSS={css`
						position: absolute;
						width: 130rem;
						left: 0rem;
						top: 0rem;
					`}
				>
					{" "}
				</Dropdown>
			) : undefined}
			{!test.firstRunCompleted ? (
				<LoadingIconV2
					css={[
						css`
							width: 18px;
							height: 18px;
							margin-left: -5x;
						`,
						isEditMode
							? css`
									margin-left: 8px;
							  `
							: undefined,
					]}
				/>
			) : (
				""
			)}
			<div
				className={"action-buttons"}
				css={[
					css`
						display: none;
						color: #9f87ff;
						margin-left: auto;
					`,
					isActive
						? css`
								display: block;
						  `
						: undefined,
				]}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 18rem;
					`}
				>
					<EditIcon
						css={css`
							width: 13rem;
							height: 13rem;
							:hover {
								opacity: 0.8;
							}
						`}
						onClick={() => {
							navigate("/recorder");
							goFullScreen();
							setTimeout(() => {
								performReplayTestUrlAction(test.id);
							}, 500);
						}}
					/>
					<div
						onClick={handleRun}
						css={css`
							display: flex;
							align-items: center;
							gap: 6rem;
							:hover {
								opacity: 0.8;
							}
						`}
					//  onClick={() => { navigate("/recorder"); goFullScreen(); setTimeout(() => {performReplayTestUrlAction(test.id);}, 500); }}
					>
						<PlayIcon
							css={css`
								width: 10rem;
								height: 12rem;
							`}
						/>
						<span css={runTextStyle}>Run</span>
					</div>
				</div>
			</div>
		</li>
	);
}
function TestList({ userTests, deleteTest, projectId }) {
	const [lastHoverItem, setLastHoverItem] = React.useState(0);
	const [lockState, setLockState] = React.useState(false);

	const handleSetLockState = (value) => {
		setLockState(value);
	};

	const onMouseEnterCallback = React.useCallback(
		(index) => {
			if (!lockState) {
				setLastHoverItem(index);
			}
		},
		[lockState],
	);

	return (
		<ul css={testItemStyle}>
			{userTests
				? userTests.map((test, index) => {
					return (
						<TestListItem
							key={test.id}
							deleteItem={deleteTest}
							projectId={projectId}
							test={test}
							isActive={lastHoverItem === index}
							setLockState={handleSetLockState}
							onMouseEnterCallback={onMouseEnterCallback.bind(this, index)}
						/>
					);
				})
				: ""}
		</ul>
	);
}

const EditIcon = (props) => (
	<svg viewBox={"0 0 13 13"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="m12.833 6.87-2.157-2.157a.537.537 0 0 0-.775 0l-.645.643V.886a.883.883 0 0 0-.883-.884H.883A.885.885 0 0 0 0 .885V8.34c0 .488.395.884.883.884h4.484l-.109.106a.842.842 0 0 0-.138.276l-.551 2.711c-.104.533.275.748.636.663l2.709-.554c.111 0 .194-.056.276-.138l4.643-4.646a.53.53 0 0 0 0-.772ZM1.06 8.165V1.063h7.137v5.346L6.434 8.162H1.06v.003Zm6.466 3.216-1.74.36.357-1.743 4.118-4.12L11.67 7.26l-4.144 4.12Z"
			fill="#7A7A7A"
		/>
	</svg>
);

const runTextStyle = css`

	font-weight: 600;
	font-size: 13rem;

	letter-spacing: 0.03em;
	position: relative;
	top: 2rem;

	color: #b061ff;
`;

const PlayIcon = (props) => (
	<svg viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M1.386 14c-.23 0-.456-.062-.656-.178-.45-.258-.73-.76-.73-1.306V1.484C0 .937.28.436.73.178A1.303 1.303 0 0 1 2.07.195l9.296 5.644c.194.123.353.294.464.497a1.385 1.385 0 0 1-.464 1.824L2.07 13.805a1.317 1.317 0 0 1-.684.195Z"
			fill="#B061FF"
		/>
	</svg>
);

const testItemStyle = css`

	font-size: 14px;
	letter-spacing: 0.03em;

	color: #ffffff;
	height: 38rem;

	li {
		padding: 6px 24px;
		padding-right: 28px;
		position: relative;
		display: flex;
		align-items: center;
	}
`;

const testItemHoverStyle = css`
	background: rgba(217, 217, 217, 0.04);
	color: #9f87ff;
`;

function TestItemMenuDropdown({ testId, draftJobId, setShowActionMenu, setIsEditMode, deleteTest }) {
	const MenuItem = ({ label, onClick }) => {
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

	const handleRename = () => {
		setShowActionMenu(false);
		setIsEditMode(true);
	};

	const handleDelete = () => {
		setShowActionMenu(false);
		deleteTest(testId);
	};

	const handleViewReport = () => {
		setShowActionMenu(false);
		shell.openExternal(resolveToFrontend(`/app/build/${draftJobId}`));
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
				<MenuItem onClick={handleViewReport} label={"View Report"} className={"close-on-click"} />
				<MenuItem onClick={handleRename} label={"Rename"} className={"close-on-click"} />
				<MenuItem onClick={handleDelete} label={"Delete"} className={"close-on-click"} />
			</div>
		</div>
	);
}
function DropwdownContent({ setShowActionMenu }) {
	const MenuItem = ({ label, onClick }) => {
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

	const handleRunTestsCloud = React.useCallback(() => {
		window["messageBarCallback"](-1);

		performRunTests(null).then((buildRes) => {
			window["messageBarCallback"](buildRes.buildId);
			// sendSnackBarEvent({ type: "success", message: "Test started successfully!" });
		});

		setShowActionMenu(false);
	}, []);
	return (
		<div
			className={"flex flex-col justify-between h-full"}
			css={css`
				font-size: 13rem;
				color: #fff;
			`}
		>
			<div>
				<MenuItem onClick={handleRunTestsCloud} label={<span>Run tests (cloud)</span>} className={"close-on-click"} />
			</div>
		</div>
	);
}

const DashboardFooter = ({ userTests, projectId }) => {
	const [showActionMenu, setShowActionMenu] = React.useState(false);
	const navigate = useNavigate();

	const handleCreateTest = () => {
		navigate("/recorder");
		goFullScreen();
	};

	React.useEffect(() => {
		if (window["testsToRun"] && window["testsToRun"].list.length) {
			navigate("/recorder");
			goFullScreen();
			performReplayTestUrlAction(window["testsToRun"].list[0], true);
		}
	}, []);
	const handleRunAll = React.useCallback(() => {
		const testIdArr = userTests.map((a) => {
			return a.id;
		});
		window["testsToRun"] = { list: testIdArr, count: testIdArr.length };
		navigate("/recorder");
		goFullScreen();
		performReplayTestUrlAction(window["testsToRun"].list[0], true);
	}, [projectId]);

	return (
		<>
			<div css={footerLeftStyle}>
				{/* <div><span css={infoTextStyle}>5 spec tests</span></div> */}
				<div>
					<span css={infoTextStyle}>{userTests.length} low code </span>
				</div>
			</div>
			<div css={footerRightStyle}>
				<div>
					<CreateTestLink onClick={handleCreateTest} />
				</div>
				<div
					css={css`
						margin-left: 20px;
					`}
				>
					<Dropdown
						initialState={showActionMenu}
						component={<DropwdownContent projectId={projectId} setShowActionMenu={setShowActionMenu.bind(this)} />}
						callback={setShowActionMenu.bind(this)}
						dropdownCSS={css`
							left: 0rem;
							width: 150rem;
							top: unset;
							bottom: calc(100% + 4rem);
						`}
					>
						<Button
							id={"verify-save-test"}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleRunAll();
							}}
							bgColor="tertiary-outline"
							css={saveButtonStyle}
						>
							Run test
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
		</>
	);
};



const saveButtonStyle = css`
	width: 92rem;
	height: 30rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	
	
	font-weight: 600;
	font-size: 14rem;
	line-height: 17rem;
	color: #ffffff;
	:hover {
		filter: brightness(0.8);
	}
`;
const infoTextStyle = css`

	font-size: 13rem;

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
