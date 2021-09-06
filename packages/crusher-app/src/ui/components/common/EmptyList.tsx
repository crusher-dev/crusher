import { css } from "@emotion/react";
import React from "react";

function LayerSVG(props) {
	return (
		<svg width={"48rem"} height={"48rem"} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<g opacity={0.4} fill="#787D85">
				<path d="M48 14.941L24.001 1.896 0 14.941l24.001 13.047L48 14.941z" />
				<path d="M24.001 32.194L4.461 21.578 0 24.003l24.001 13.04L48 24.003l-4.462-2.425-19.537 10.616z" />
				<path d="M24.001 41.253L4.461 30.635 0 33.055l24.001 13.047L48 33.055l-4.462-2.42-19.537 10.618z" />
			</g>
		</svg>
	);
}

export const EmptyList = ({ title, subTitle }) => (
	<div
		className={"text-15 flex flex-col items-center justify-center"}
		css={css`
			height: calc(100vh - 66rem);
			padding-bottom: 200rem;
		`}
	>
		<LayerSVG height={"36rem"} />
		<div className={"mt-8 flex flex-col items-center mt-40"}>
			<div
				className={"font-cera text-15 leading-none mb-12 font-600"}
				css={css`
					color: #d0d0d0;
				`}
			>
				{title}
			</div>

			<div
				className={"text-13 leading-none"}
				css={css`
					color: #d0d0d0;
				`}
			>
				{subTitle}
			</div>
		</div>
	</div>
);

export default EmptyList;
