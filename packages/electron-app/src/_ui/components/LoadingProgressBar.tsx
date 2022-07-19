import React from "react";
import { useInView } from "react-intersection-observer";
import { css } from "@emotion/react";

function LoadingProgressBar() {
	const { ref, inView } = useInView();
    const progressStyle = React.useMemo(() => loadingProgressPillCss(inView), [inView]);

	return (
		<div css={containerCss}>
			<div css={contentCss}>
				<div ref={ref} css={loadingContainerCss}>
					<div css={loadingProgressBarCss}>
						<div css={progressStyle}></div>
					</div>
					<div css={loadingTextCss}>loading crusher..</div>
				</div>
			</div>
		</div>
	);
};
const contentCss = css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;
`;
const containerCss = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	background: #161617;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;

const loadingTextCss = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 700;
	font-size: 16px;
	margin-top: 16rem;

	text-align: center;

	color: #ffffff;
`;
const loadingContainerCss = css`
	display: flex;
	flex-direction: column;
`;
const loadingProgressBarCss = css`
	background: rgba(255, 255, 255, 0.15);
	border-radius: 4px;
	padding: 0;
	width: 168px;
	height: 6px;
`;
const loadingProgressPillCss = (isInView: boolean) => {
    return css`
        background: linear-gradient(180deg, rgba(230, 199, 255, 0) 0%, rgba(43, 37, 48, 0.03) 75.52%, rgba(0, 0, 0, 0.34) 100%), #c96af5;
        border-radius: 4px;
        transition-timing-function: ease;
        height: 100%;
        transition: width 0.85s;
        width: ${isInView ? "100%": "1%"};
    `;
}

export { LoadingProgressBar };