import React from "react";
import { css } from "@emotion/react";
import { LogoV2 } from "../../constants/old_icons";
import { shell } from "electron";
import { DropdownIconSVG } from "@dyson/assets/icons";
import { useNavigate } from "react-router-dom";
import { performExit } from "../../commands/perform";

import { useStore } from "react-redux";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { MenuItem } from "./dropdown/menuItems";

export function Link({ children, ...props }) {
    return (
        <span css={[linkStyle]} {...props}>
            {children}
        </span>
    );
}

const linkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	color: #ffffff;
	:hover {
		opacity: 0.8;
	}

	font-weight: 500;
	font-size: 13px;
`;

export { Link };




function DropwdownContent({
    setShowActionMenu,
    isRecorder
}) {
    const navigate = useNavigate();
    const store = useStore();
    const [projectConfigFile, setProjectConfigFile] = React.useState(null);

    React.useEffect(() => {
        try {
            const projectId = getCurrentSelectedProjct(store.getState() as any);
            const projectConfigFile = window.localStorage.getItem("projectConfigFile");
            const projectConfigFileJson = JSON.parse(projectConfigFile);
            if (projectConfigFileJson[projectId]) {
                setProjectConfigFile(projectConfigFileJson[projectId]);
            }
        } catch { }
    }, []);

    const handleOpenConfigFile = React.useCallback(() => {
        setShowActionMenu(false);
        shell.openPath(projectConfigFile);
    }, [projectConfigFile]);

    const handleSettings = () => {
        setShowActionMenu(false);
        navigate("/settings");
    };


    const handleExit = () => {
        setShowActionMenu(false);
        performExit();
    };

    const handleSelectProject = () => {
        setShowActionMenu(false, true);
        return navigate("/select-project");
    };

    const handleGoBackToDashboard = () => {
        setShowActionMenu(false, true);
        return navigate("/");
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
        (value, isNavigating = false) => {
            setShowAppMenu(value);
            if (callback) {
                callback(value, isNavigating);
            }
        },
        [callback],
    );

    return (
        <Dropdown
            className={className}
            initialState={showAppMenu}
            component={<DropwdownContent isRecorder={isRecorder} setShowActionMenu={handleCallback.bind(this)} />}
            callback={handleCallback.bind(this)}
            dropdownCSS={css`
				left: 38rem;
				width: 162rem;
                background: #0D0E0E;
                border: 1px solid #1C1C1C;
                box-shadow: 0px -1px 9px #000000;
                border-radius: 10px;
			`}
        >
            <div css={crusherDropdownContainerStyle}>
                <LogoV2 className={"crusher-hammer-icon"} css={[logoStyle]} />
                {hideDropdown ? null : (<DropdownIconSVG />)}
            </div>
        </Dropdown>
    );
};

const crusherDropdownContainerStyle = css`
	display: flex;
	gap: 8rem;
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
