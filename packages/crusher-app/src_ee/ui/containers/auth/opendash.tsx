import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import router from "next/router";

const Github = () => (
	<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M13 0.0695801C5.82183 0.0695801 0 5.89033 0 13.0696C0 18.8134 3.7245 23.6862 8.89092 25.4055C9.53983 25.5257 9.75 25.1227 9.75 24.7804V22.3602C6.13383 23.1467 5.38092 20.8262 5.38092 20.8262C4.78942 19.3237 3.93683 18.9239 3.93683 18.9239C2.75708 18.1168 4.02675 18.1342 4.02675 18.1342C5.33217 18.2252 6.019 19.4742 6.019 19.4742C7.17817 21.4611 9.05992 20.8869 9.802 20.5543C9.91792 19.7147 10.2548 19.1406 10.6275 18.8167C7.74042 18.4862 4.70492 17.3715 4.70492 12.3914C4.70492 10.9712 5.213 9.812 6.04392 8.902C5.90958 8.57375 5.46433 7.251 6.17067 5.46133C6.17067 5.46133 7.26267 5.1125 9.74675 6.79383C10.7835 6.50566 11.895 6.36158 13 6.35616C14.105 6.36158 15.2176 6.50566 16.2565 6.79383C18.7384 5.1125 19.8283 5.46133 19.8283 5.46133C20.5357 7.25208 20.0904 8.57483 19.9561 8.902C20.7903 9.812 21.294 10.9722 21.294 12.3914C21.294 17.3845 18.2531 18.4841 15.3584 18.8058C15.8243 19.2088 16.25 19.9997 16.25 21.213V24.7804C16.25 25.126 16.458 25.5322 17.1178 25.4044C22.2798 23.683 26 18.8112 26 13.0696C26 5.89033 20.1793 0.0695801 13 0.0695801Z"
			fill="#2D2E30"
		/>
	</svg>
);

const Discord = () => (
	<svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_3083_17449)">
			<path
				d="M22.0101 5.77562C20.3529 5.02744 18.5759 4.47622 16.7179 4.1605C16.6841 4.15441 16.6503 4.16964 16.6329 4.2001C16.4043 4.60007 16.1511 5.12185 15.9739 5.53197C13.9754 5.23759 11.9873 5.23759 10.0298 5.53197C9.85254 5.11273 9.59019 4.60007 9.36062 4.2001C9.3432 4.17065 9.30939 4.15543 9.27555 4.1605C7.41857 4.47521 5.64152 5.02643 3.98334 5.77562C3.96899 5.78171 3.95669 5.79187 3.94852 5.80507C0.577841 10.7601 -0.345529 15.5932 0.107445 20.3665C0.109495 20.3899 0.122817 20.4122 0.141264 20.4264C2.36514 22.0334 4.51935 23.009 6.63355 23.6556C6.66739 23.6658 6.70324 23.6537 6.72477 23.6261C7.22489 22.9542 7.67069 22.2457 8.05294 21.5004C8.07549 21.4568 8.05396 21.405 8.00785 21.3878C7.30072 21.1239 6.6274 20.802 5.97971 20.4366C5.92848 20.4071 5.92437 20.3351 5.97151 20.3005C6.1078 20.2 6.24414 20.0955 6.37429 19.9899C6.39783 19.9707 6.43065 19.9665 6.45832 19.9787C10.7134 21.8903 15.32 21.8903 19.5249 19.9787C19.5525 19.9656 19.5854 19.9696 19.61 19.9888C19.7401 20.0945 19.8765 20.2 20.0137 20.3005C20.0608 20.3351 20.0578 20.4071 20.0066 20.4366C19.3588 20.8091 18.6856 21.1239 17.9774 21.3868C17.9313 21.404 17.9108 21.4568 17.9333 21.5004C18.3238 22.2446 18.7696 22.9532 19.2605 23.6252C19.281 23.6537 19.3179 23.6658 19.3517 23.6556C21.4761 23.009 23.6303 22.0334 25.8542 20.4264C25.8737 20.4122 25.886 20.3909 25.8881 20.3676C26.4302 14.8491 24.98 10.0555 22.0439 5.80608C22.0367 5.79187 22.0245 5.78171 22.0101 5.77562ZM8.68835 17.4601C7.40729 17.4601 6.35172 16.3028 6.35172 14.8816C6.35172 13.4604 7.38682 12.3031 8.68835 12.3031C10.0001 12.3031 11.0455 13.4705 11.025 14.8816C11.025 16.3028 9.98986 17.4601 8.68835 17.4601ZM17.3276 17.4601C16.0467 17.4601 14.9911 16.3028 14.9911 14.8816C14.9911 13.4604 16.0261 12.3031 17.3276 12.3031C18.6394 12.3031 19.6847 13.4705 19.6642 14.8816C19.6642 16.3028 18.6394 17.4601 17.3276 17.4601Z"
				fill="#2D2E30"
			/>
		</g>
		<defs>
			<clipPath id="clip0_3083_17449">
				<rect width="26" height="26" fill="white" transform="translate(0 0.90918)" />
			</clipPath>
		</defs>
	</svg>
);

export default function Learn() {
	return (
		<div
			css={css(`
				height: 100vh;
				background: #0D0E11;
				width: 100vw;
			`)}
		>
			<div className={"flex justify-center"}>
				<div className={"mt-84 flex flex-col items-center"}>
					<Heading type={1} fontSize={18}>
						Crusher is open for all
					</Heading>
					<TextBlock fontSize={14.2} color={"#E7E7E7"} className={"mt-12"} leading={false}>
						Join community to learn from devs on how to use crusher.
					</TextBlock>

					<div css={overlayContainer} className={"flex mt-36"}>
						<div className="pl-30 pt-20 pr-30 flex-1 pb-30">
							<div className="flex justify-between items-center">
								<TextBlock fontSize={"16"} weight={500}>
									<span css={css(`color:#C5EC72`)}>Star Crusher</span> on Github
								</TextBlock>
								<Github />
							</div>
							<TextBlock className="mt-60 leading-loose" css={css(`line-height: 1.5;`)} fontSize={14}>
								Break it, change it and see how magic works
								<br />
								Drop a star if you love it.
							</TextBlock>
						</div>
						<div css={css(`border-left:1px solid #21252f`)} className="pl-30 pt-20 pr-30 flex-1">
							Hey
							<div className="flex justify-between items-center">
								<TextBlock color="#71DDFF" fontSize={"16"} weight={500}>
									Join discord
								</TextBlock>
								<Discord />
							</div>
							<TextBlock className="mt-60 leading-8" css={css(`line-height: 1.5;`)} fontSize={14}>
								Are you a developer building or breaking something. Our community of builders help each other
							</TextBlock>
						</div>
					</div>
					<div className="mt-40">
						<Button
							onClick={() => router.push("/app/dashboard")}
							className={"flex items-center justify-center mt-30"}
							css={css(`
									width: 180rem;
									height: 36rem;
									font-weight: 400;
                                    background:#905CFF;
								`)}
						>
							<Text fontSize={14} weight={900}>
								Open dashboard
							</Text>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

const overlayContainer = css(`
	background: #0a0b0c;
	border: 1px solid #21252f;
	border-radius: 10px;
	width: 850rem;
	min-height: 200rem;
`);
