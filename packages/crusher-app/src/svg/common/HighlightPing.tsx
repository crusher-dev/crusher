import { css } from "@emotion/react";
import { ReactPropTypes } from "react";

function svg(props: ReactPropTypes) {
	return (
		<svg width={"16rem"} height={"16rem"} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} css={loadingZipCSS}>
			<g filter="url(#prefix__filter0_d)">
				<rect x={4.5} y={4.5} width={"14rem"} height={"14rem"} rx={7} fill="#ff81f3" stroke="#ff85f3" />
				<rect x={8} y={8} width={7} height={7} rx={3.5} fill="#313843" />
			</g>
			<defs>
				<filter id="prefix__filter0_d" x={0} y={0} width={"22rem"} height={"22rem"} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
				</filter>
			</defs>
		</svg>
	);
}

export default svg;

const loadingZipCSS = css`
	animation: zoom-in-zoom-out 1.2s ease infinite;
	@keyframes zoom-in-zoom-out {
		0% {
			transform: scale(1, 1);
		}
		50% {
			transform: scale(1.3, 1.3);
		}
		100% {
			transform: scale(1, 1);
		}
	}
`;
