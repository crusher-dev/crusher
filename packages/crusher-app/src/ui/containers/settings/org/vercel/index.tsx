import React from "react";
import { css } from "@emotion/react";
import useSWR from "swr";
import { getVercelProjects } from "@constants/api";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { VercelIcon, VercelProjectsList } from "./integration";
import { Button } from "dyson/src/components/atoms";

const VercelIntegrationButton = ({...props}) => {
    return (
		<a href={"https://vercel.com/integrations/crusher-dev"} target={"_blank"} {...props}>
				<Button
					bgColor={"tertiary-white"}
					css={css`
						border-width: 0;
						background: #fff !important;
						:hover {
							border-width: 0;
							background: #fff !important;
						}
					`}>
							<div className={"flex items-center"}>
								<VercelIcon
									css={css`
										path {
											fill: #000 !important;
										}
									`}
									height={"12rem"}
									width={"12rem"}
									className={"mt-1"}
								/>
								<span className={"mt-2 ml-8"}>Integrate</span>
							</div>
				</Button>
		</a>
    )
};
export const VercelIntegration = () => {
	const { data: projectsRes } = useSWR(getVercelProjects());
	return (
		<div>
			<Heading type={1} fontSize={"16"} className={"mb-8 mt-16"}>
			Vercel
			</Heading>

			{projectsRes?.projects?.length ? (
				<VercelProjectsList className={"mt-20"}/>
			) : (
				<VercelIntegrationButton className={"mt-20 flex"}/>
			)}
		</div>
	);
}