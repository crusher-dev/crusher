import React, { useCallback } from "react";
import { css } from "@emotion/react";
import useSWR, { mutate } from "swr";
import { useProjectDetails } from "@hooks/common";
import { getGitIntegrations } from "@constants/api";
import { unlinkRepo } from "../api";
import { Card } from "dyson/src/components/layouts/Card/Card";
import { Button, TextBlock } from "dyson/src/components/atoms";
import { GithubSVG } from "@svg/social";

export const LinkedRepo = () => {
	const { currentProject: project } = useProjectDetails();
	const { data: linkedRepos } = useSWR(getGitIntegrations(project.id));

	const { repoName, projectId, repoLink, id: id } = linkedRepos.linkedRepo;

	const unlinkRepoCallback = useCallback(async () => {
		await unlinkRepo(projectId, id);
		mutate(getGitIntegrations(project?.id));
	}, [linkedRepos]);

	return (
		<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-28 mb-32"}
				css={css`
					padding: 22rem 28rem 26rem;
					background: #101215;
				`}
			>

				<TextBlock weight={500} className="mb-8" fontSize={14}>Connected to</TextBlock>

				<div className={"flex text-13 justify-between mt-20"}>
					<div className={"flex items-start"}>
						<div
							className="flex items-center justify-center mr-16"
							css={css`
								min-width: 28px;
								min-height: 28px;
								border-radius: 10rem;
								background: #ffffff29;
							`}
						>
							<GithubSVG />
						</div>

						<div>
							<TextBlock weight={600} className="mb-8" fontSize={14}>{repoName}</TextBlock>
							<a href={repoLink} target={"_blank"}>
								<TextBlock color="#787878" className="mb-8" fontSize={12}>{repoLink}</TextBlock>

							</a>
						</div>
					</div>

					<Button
						size={"small"}
						bgColor={"danger"}
						onClick={unlinkRepoCallback.bind(this)}
					>
						<span className={"mt-1"}>Disconnect</span>
					</Button>
				</div>
			</Card>

			<TextBlock className={"mt-16"} fontSize={"12"} color={"#A7A7A8"}>
				Learn more about login for connection
			</TextBlock>
		</div>
	);
}
