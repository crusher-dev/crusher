import React from "react";
import { css } from "@emotion/react";
import { goFullScreen, performRunTests } from "electron-app/src/ui/commands/perform";
import { useNavigate } from "react-router-dom";

import { triggerLocalBuild } from "../../utils/recorder";
import { StatusMessageBar } from "electron-app/src/_ui/ui/layout/modalContainer";
import { ButtonDropdown } from "../../ui/components/buttonDropdown";

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
];

const DashboardFooter = ({ tests }) => {
	const [, setShowActionDropdown] = React.useState(false);
	const navigate = useNavigate();

	const handleCreateTest = React.useCallback(() => {
		navigate("/recorder");
		goFullScreen();
	}, []);

	const handleDropdownCallback = React.useCallback(
		(optionId) => {
			if (!tests.length) {
				alert("No tests present in the project.");
				return;
			}
			if (optionId === "run-local-tests") {
				const testIdArr = tests.map((a) => a.id);
				triggerLocalBuild(testIdArr);
			} else if (optionId === "run-cloud-tests") {
				window["messageBarCallback"](-1);

				performRunTests(null).then((buildRes) => {
					window["messageBarCallback"](buildRes.buildId);
					// sendSnackBarEvent({ type: "success", message: "Test started successfully!" });
				});
				setShowActionDropdown(true);
			}
		},
		[tests],
	);

	return (
		<div css={containerCss}>
			<div css={contentCss}>
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
						<ButtonDropdown options={actionDropdownOptions} primaryOption={"run-local-tests"} callback={handleDropdownCallback} />
					</div>
				</div>
			</div>
			<StatusMessageBar isLoadingScreen={false} />
		</div>
	);
};

const containerCss = css`
	display: flex;
	flex-direction: column;
`;
const contentCss = css`
	display: flex;
	width: 100%;
	padding: 12rem 24rem;
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

export { DashboardFooter };
