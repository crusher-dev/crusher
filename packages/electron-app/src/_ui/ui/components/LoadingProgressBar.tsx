import React from "react";
import { useInView } from "react-intersection-observer";
import { LogoAnimated } from "../../../../dyson/src/components/atoms/logo/LogoAnimated";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";

function LoadingProgressBar({inAppLoading= true}) {
	const { ref, inView } = useInView();
    const progressStyle = React.useMemo(() => loadingProgressPillCss(inView), [inView]);

	return (
		<div css={containerCss}>
				<div ref={ref} css={loadingContainerCss}>
					<Conditional showIf={!inAppLoading}>
						<LogoAnimated/>
					</Conditional>
					<div css={loadingProgressBarCss}>
						<div css={progressStyle}></div>
					</div>
				</div>
		</div>
	);
};

const containerCss = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	border-radius: 16px;
	display: flex;
	flex-direction: column;

	flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;
`;

const loadingContainerCss = css`
	display: flex;
	flex-direction: column;
	padding-bottom: 96px;
`;
const loadingProgressBarCss = css`
	background: rgba(255, 255, 255, 0.15);
	border-radius: 4px;
	padding: 0;
	width: 168px;
	height: 4px;
	margin-top: 20px;
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