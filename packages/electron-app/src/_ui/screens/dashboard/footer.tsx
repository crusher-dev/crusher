import React from "react";
import { css } from "@emotion/react";
import { goFullScreen, performReplayTestUrlAction, performRunTests } from "electron-app/src/ui/commands/perform";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { Button } from "@dyson/components/atoms";
import { DownIcon } from "electron-app/src/ui/icons";
import { ButtonDropdown } from "../../components/buttonDropdown";

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
	font-family: "Gilroy";
	font-style: normal;
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

const actionDropdownOptions = [
    {
        id: "run-local-tests",
        content: "Run tests",
    },
    {
        id: "run-cloud-tests",
        content: "Run tests (cloud)",
    },
]

const DashboardFooter = ({ tests }) => {
    const [showActionDropdown, setShowActionDropdown] = React.useState(false);
	const navigate = useNavigate();

	const handleCreateTest = React.useCallback(() => {
		navigate("/recorder");
		goFullScreen();
	}, []);

    const handleDropdownCallback = React.useCallback((optionId) => {
        if(optionId === "run-local-tests") {
            const testIdArr = tests.map((a) => a.id);
            window["testsToRun"] = { list: testIdArr, count: testIdArr.length };
            navigate("/recorder");
            goFullScreen();
            performReplayTestUrlAction(window["testsToRun"].list[0], true);
        } else if (optionId === "run-cloud-tests") {
			window["messageBarCallback"](-1);

			performRunTests(null).then((buildRes) => {
				window["messageBarCallback"](buildRes.buildId);
				// sendSnackBarEvent({ type: "success", message: "Test started successfully!" });
			});
			setShowActionDropdown(true);
		}
    }, [tests]);

	return (
		<div css={containerCss}>
			<div css={footerLeftCss}>
				<div>
					<span css={infoTextCss}>{tests.length} low code </span>
				</div>
			</div>
			<div css={footerRightCss}>
				<div>
					<CreateTestLink onClick={handleCreateTest} />
				</div>
				<div css={dropdownContainerCss}>
                    <ButtonDropdown options={actionDropdownOptions} primaryOption={"run-local-tests"} callback={handleDropdownCallback}/>
				</div>
			</div>
		</div>
	);
}
const containerCss = css`display: flex; width: 100%;`;

const saveButtonStyle = css`
	width: 92rem;
	height: 30rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
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
const infoTextCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;

	color: rgba(255, 255, 255, 0.67);
`;

const footerLeftCss = css`
	display: flex;
	align-items: center;
	gap: 24px;
`;
const footerRightCss = css`
	display: flex;
	margin-left: auto;
	align-items: center;
`;
const dropdownContainerCss = css`
    margin-left: 20px;				
`;

export { DashboardFooter }