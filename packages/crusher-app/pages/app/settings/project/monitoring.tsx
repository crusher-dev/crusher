import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";

export default function monitoring() {
	return (
		<div css={monitoringCSS}>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader
					title={"Monitoring"}
					desc={"List of all team members in current project"}
					button={<Monitor onClick={helloWorld} />}
				/>
			</SettingsContent>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
				}}
			>
				<div>{returnModals(trialObject)}</div>
				<div>{returnModals(trialObject)}</div>
				<div>{returnModals(trialObject)}</div>
			</div>
		</div>
	);
}

const monitoringCSS = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Monitor = (props: iButtonProps) => {
	const { onClick } = props;
	return (
		<div css={buttonCSS} onClick={onClick}>
			Add Monitoring
		</div>
	);
};

const helloWorld = () => {
	console.log("Hello World");
};

interface contentsOfModal {
	title: string;
	host: string;
	tags: string;
	countries: string;
	duration: string;
	escalation: string;
}

const buttonCSS = css`
	background: #5286ff;
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	padding: ${8 / PIXEL_REM_RATIO}rem ${8 / PIXEL_REM_RATIO}rem;
	min-width: ${180 / PIXEL_REM_RATIO}rem;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	font-weight: 600;
	font-family: Gilroy;
	color: #fff;
	text-align: center;
`;

const trialObject: contentsOfModal = {
	title: "Prod Monitoring",
	host: "Production",
	tags: "Production",
	countries: "Screen/2020",
	duration: "Every 10 sec",
	escalation: "Production",
};

const modalCSS = css`
	font-family: Gilroy;
	background: #ffffff;
	border: 2px solid #e6e6e6;
	box-sizing: border-box;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	padding: 1.5rem;
	margin: 1rem;
	width: 45rem;
`;

const titleCSS = css`
	font-family: Gilroy;
	font-size: 1.2rem;
	line-height: 1.25rem;
	color: #323232;
	padding: 0.5rem;
	margin-top: 0rem;
`;

const keysCSS = css`
	font-size: 0.9rem;
	line-height: 1.125rem;
	color: #9b9b9b;
	padding: 0.5rem;
`;

const valuesCSS = css`
	font-size: 0.9rem;
	line-height: 1.125rem;
	color: #323232;
`;

interface iButtonProps {
	onClick: () => void;
}

const settingContentCSS = css`
	width: ${720 / PIXEL_REM_RATIO}rem;
`;

function returnModals(contents: contentsOfModal) {
	const { title, host, tags, countries, duration, escalation } = contents;
	return (
		<div css={modalCSS}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<strong css={titleCSS}>{title}</strong>
				<div>
					<span style={{ margin: "1rem" }}>Copy Template</span>
					<span style={{ margin: "1rem" }}>Edit</span>
				</div>
			</div>
			<div css={innerCSS}>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div>
						<span css={keysCSS}>Host:</span>
						<span css={valuesCSS}>{host}</span>
					</div>

					<div>
						<span css={keysCSS}>Tags:</span>
						<span css={valuesCSS}>{tags}</span>
					</div>
					<div>
						<span css={keysCSS}>Countries:</span>
						<span css={valuesCSS}>{countries}</span>
					</div>
				</div>
				<div>
					<div>
						<span css={keysCSS}>Duration:</span>
						<span css={valuesCSS}>{duration}</span>
					</div>
					<div>
						<span css={keysCSS}>Escalation:</span>
						<span css={valuesCSS}>{escalation}</span>
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div>Run Now</div>
					<button css={viewBuildCSS}>View Builds</button>
				</div>
			</div>
		</div>
	);
}

const viewBuildCSS = css`
	background: #ffffff;
	border: 1px solid #c4c4c4;
	box-sizing: border-box;
	border-radius: 6px;
    font-family: Gilroy;
    font-weight: 600;
	font-size: 14px;
	line-height: 16px;
	color: #323232;
`;

const innerCSS = css`
	display: flex;
	justify-content: space-between;
`;
