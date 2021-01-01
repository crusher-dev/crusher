import { css } from "@emotion/core";

function MonitoringCard(props) {
    const { title, host, tags, countries, duration, escalation } = props;
    
    
	return (
		<div>
			<div css={modalCSS}>
				<div css={componentCSS}>
					<strong css={titleCSS}>{title}</strong>
					<div>
						<span css={margin1remCSS}>Copy Template</span>
						<span css={margin1remCSS}>Edit</span>
					</div>
				</div>
				<div css={innerCSS}>
					<div css={flexColumnCSS}>
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
					<div css={column3CSS}>
						<div>Run Now</div>
						<button css={viewBuildCSS}>View Builds</button>
					</div>
				</div>
			</div>
		</div>
	);
}

const flexColumnCSS = css`
	display: flex;
	flex-direction: column;
`;

const componentCSS = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const margin1remCSS = css`
	margin: 1rem;
`;

const column3CSS = css`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

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

const viewBuildCSS = css`
	background: #ffffff;
	border: 1px solid #c4c4c4;
	box-sizing: border-box;
	border-radius: 6px;
	font-family: Gilroy;
	font-weight: 600;
	font-size: 14px;
	line-height: 16px;
	height: 1.75rem;
	width: 7.5rem;
	color: #323232;
`;

const innerCSS = css`
	display: flex;
	justify-content: space-between;
`;

export default MonitoringCard;
