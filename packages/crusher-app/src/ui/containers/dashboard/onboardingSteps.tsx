import { useState } from "react";
import { ExpandableList, ExpandableListItem } from "./expandableList";
import { FullScreenSVG } from "@svg/dashboard";
import { css } from "@emotion/core";
import { Button } from "dyson/src/components/atoms/button/Button";
import { PlaySVG, AppleSVG } from "@svg/dashboard";

interface TTestIntegrationListProps {
	className?: string;
}

function OnboardingSteps(props: TTestIntegrationListProps) {
	const [selected, setSelected] = useState(0);

	const handleChangeItem = (index: number) => {
		setSelected(index);
	};

	return (
		<div {...props}>
			<ExpandableList css={listStyle} currentSelected={selected} changeSelected={handleChangeItem}>
				<ExpandableListItem title="Download recorded & create test" completed={false}>
					<div className="mt-40 pl-32 pb-16">
						<table css={downloadGridContainerStyle}>
							<tr>
								<td>
									<span className={"label font-14"}>Download</span>
								</td>
								<td>
									<div className={"ml-40"}>
										<Button onClick={() => {}} size="medium">
											<div className={"flex items-center justify-center"}>
												<AppleSVG variant={"white"} className={"mr-12"} />
												<span className={"mt-2"}>Download dmg</span>
											</div>
										</Button>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<span className={"label font-14"}>& Then</span>
								</td>
								<td>
									<div className={"ml-40"}>
										<Button bgColor={"tertiary-dark"} onClick={() => {}} size="medium">
											<div className={"flex items-center justify-center"}>
												<PlaySVG className={"mr-12"} />
												<span className={"mt-2"}>Create a test</span>
											</div>
										</Button>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</ExpandableListItem>
				<ExpandableListItem title="Integrate in your worflow" completed={false}></ExpandableListItem>
				<ExpandableListItem title="Run tests" completed={false}></ExpandableListItem>
				<ExpandableListItem title="View reports" completed={false}></ExpandableListItem>
			</ExpandableList>
			<div className={"flex flex-row mt-30"}>
				<div css={haveTestStyle} className="text-13">
					Have tests? Import them over
				</div>
				<div className={"ml-auto flex items-center"}>
					<span css={checkoutProjectStyle} className={"text-13 mr-12"}>
						Or checkout <u className={"text-13 mr-0"}>Demo Project</u>
					</span>
					<FullScreenSVG css={fullScreenIconStyle} />
				</div>
			</div>
		</div>
	);
}

const listStyle = css`
	border: 1px solid #171c24;
	border-radius: 12rem;
`;
const haveTestStyle = css`
	color: #fff !important;
`;
const checkoutProjectStyle = css`
	color: rgb(208, 208, 208) !important;
`;
const fullScreenIconStyle = css`
	height: 12.5rem;
	width: 12.5rem;
`;
const downloadGridContainerStyle = css`
	border-collapse: collapse;
	tr {
		&:not(:first-child) {
			td {
				padding-top: 38rem;
			}
		}
	}
	.label {
		color: rgba(255, 255, 255, 0.7) !important;
	}
`;
export { OnboardingSteps };
