import React from "react";
import { css } from "@emotion/react";
import { LogoV2 } from "../../../constants/old_icons";
import { shell } from "electron";
import { DropdownIconSVG } from "@dyson/assets/icons";
import { useNavigate } from "react-router-dom";
import { performExit } from "../../../commands/perform";

import { useStore } from "react-redux";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { MenuItem } from "../../components/dropdown/menuItems";
import { getCurrentProjectConfig } from "electron-app/src/_ui/utils/project";

const createEvent = (props) => {
	let _isCanceled = false;
	return {
		preventDefault: () => {
			_isCanceled = true;
		},
		isCanceled: () => _isCanceled,
		...props
	}
}
function DashboardTopDropdownContent({ setShowActionMenu, isRecorder }) {
	const navigate = useNavigate();
	const store = useStore();
	const [projectConfigFile, setProjectConfigFile] = React.useState(null);

	React.useEffect(() => {
		const projectConfigFile = getCurrentProjectConfig();
		setProjectConfigFile(projectConfigFile);
	}, []);

	const handleOpenConfigFile = React.useCallback(() => {
		const evt = createEvent({ id: "open-config-file", action: "Open config file", isNavigating: false });

		setShowActionMenu(false, evt);
		if(!evt.isCanceled()) {
			shell.openPath(projectConfigFile);
		}
	}, [projectConfigFile]);

	const handleSettings = () => {
		const evt = createEvent({ id: "settings", action: "Open settings", isNavigating: true });
		setShowActionMenu(false, evt);
		if(!evt.isCanceled()) {
			navigate("/settings");
		}
	};

	const handleExit = () => {
		const evt = createEvent({ id: "exit", action: "Exit", isNavigating: false });
		setShowActionMenu(false, evt);

		if(!evt.isCanceled()) {
			performExit();
		}
	};

	const handleSelectProject = () => {
		const evt = createEvent({ id: "back-to-projects", action: "Go back", isNavigating: true });
		setShowActionMenu(false, evt);

		if(!evt.isCanceled()) {
			return navigate("/select-project");
		}
	};

	const handleGoBackToDashboard = () => {
		const evt = createEvent({ id: "back-to-dashboard", action: "Go back", isNavigating: true });
		setShowActionMenu(false, evt);

		if(!evt.isCanceled()) {
			return navigate("/");
		}
	};

	const handleHelpAccount = () => {
		shell.openExternal("https://docs.crusher.dev");
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
				{isRecorder ? (
					<MenuItem onClick={handleGoBackToDashboard} label={<span>Go Back</span>} className={"close-on-click"} />
				) : (
					<MenuItem onClick={handleSelectProject} label={<span>Back to projects</span>} className={"close-on-click"} />
				)}
				{projectConfigFile ? <MenuItem onClick={handleOpenConfigFile} label={<span>Edit Project config</span>} className={"close-on-click"} /> : ""}
				<MenuItem onClick={handleSettings} label={<span>Settings</span>} className={"close-on-click"} />
				<MenuItem onClick={handleHelpAccount} label={<span>Help & account</span>} className={"close-on-click"} />
				<MenuItem onClick={handleExit} label={<span>Exit</span>} className={"close-on-click"} />
			</div>
		</div>
	);
}

export const MenuDropdown = ({ className, isRecorder, hideDropdown, callback }) => {
	const [showAppMenu, setShowAppMenu] = React.useState(false);

	const handleCallback = React.useCallback(
		(value, event) => {
			if (callback) {
				callback(value, event);
			}
			if(event && !event?.isCanceled()) {
				setShowAppMenu(value);
			}
		},
		[callback],
	);

	return (
		<Dropdown
			className={className}
			initialState={showAppMenu}
			component={<DashboardTopDropdownContent isRecorder={isRecorder} setShowActionMenu={handleCallback.bind(this)} />}
			callback={handleCallback.bind(this)}
			dropdownCSS={css`
				left: 38rem;
				width: 162rem;
				background: #0d0e0e;
				border: 1px solid #1c1c1c;
				box-shadow: 0px 0px 2px #000000;
				border-radius: 10px;
			`}
		>
			<div css={crusherDropdownContainerStyle}>
				<LogoV2 className={"crusher-hammer-icon"} css={[logoStyle]} />
				{hideDropdown ? null : <DropdownIconSVG />}
			</div>
		</Dropdown>
	);
};

const crusherDropdownContainerStyle = css`
	display: flex;
	gap: 4rem;
	align-items: center;
	:hover {
		opacity: 0.8;
	}
`;

const logoStyle = css`
	width: 23px;
	height: 24px;

	rect {
		fill: #292929 !important;
	}
`;
