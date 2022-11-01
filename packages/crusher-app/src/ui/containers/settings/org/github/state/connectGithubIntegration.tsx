import { css } from "@emotion/react";
import { GithubSVG } from "@svg/social";
import { Button, TextBlock } from "dyson/src/components/atoms";
import { Card } from "dyson/src/components/layouts/Card/Card";
import { useGithubAuthorize } from "../hooks";

export const ConnectGithubIntegration = () => {
	const { onGithubClick } = useGithubAuthorize();

	return (
		<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-40"}
				css={css`
					padding: 20rem 28rem 24rem !important;
				`}
			>
				<div
					className={"font-cera font-700 mb-8 leading-none"}
					css={css`
						font-size: 15rem;
						color: white;
					`}
				>
					Connect a git repository
				</div>
				<TextBlock fontSize={12} color={"#787878"}>
					Seamless test builds for commits pushed to your repository.
				</TextBlock>

				<div className={"mt-24"}>
					<Button
						bgColor={"tertiary-white"}
						onClick={onGithubClick.bind(this, false)}
						css={css`
							border-width: 0;
							background: #fff !important;
							:hover {
								border-width: 0;
								background: #fff !important;
							}
						`}
					>
						<div className={"flex items-center"}>
							<GithubSVG
								css={css`
									path {
										fill: #000 !important;
									}
								`}
								height={"12rem"}
								width={"12rem"}
								className={"mt-1"}
							/>
							<span className={"mt-2 ml-8"}>Github</span>
						</div>
					</Button>
				</div>
			</Card>

			<TextBlock className={"mt-12 ml-28"} fontSize={"12"} color={"#787878"}>
				Docs for gihub integration
			</TextBlock>
		</div>
	);
}

