import { css } from "@emotion/core";
import { CenterLayout, BlankBase } from "dyson/src/components/layouts/";
import { Logo } from "dyson/src/components/atoms";

const backgroundForBase = css`
	background: url("/assets/img/background/dark_pattern.png"), linear-gradient(179deg, #12161b 10.44%, #0c0d0e 100%);
	color: #cfd0d0;
	font-weight: 600;
	background-position: center top;
	background-repeat: repeat;
`;
const logoStyle = css`
	box-shadow: 0px 0px 38px 12px rgb(153 136 255 / 12%);
	animation: logo-animation 0.8s alternate infinite cubic-bezier(0, 0, 1, 0.32);
`;

export const LoadingScreen = () => {
	return (
		<BlankBase css={backgroundForBase}>
			<CenterLayout className={"pb-100"}>
				<div className="flex flex-col justify-center items-center">
					<Logo showOnlyIcon={true} height={40} css={logoStyle} />
					<span className={"mt-30 text-14 font-content font-500"}>Firing up all the boosters</span>
				</div>
			</CenterLayout>
		</BlankBase>
	);
};
