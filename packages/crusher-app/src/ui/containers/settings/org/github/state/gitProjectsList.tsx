import { getGitIntegrations } from "@constants/api";
import { css } from "@emotion/react";
import { useProjectDetails } from "@hooks/common";
import { AddSVG } from "@svg/dashboard";
import { GithubSVG } from "@svg/social";
import { Button, TextBlock } from "dyson/src/components/atoms";
import { Card } from "dyson/src/components/layouts/Card/Card";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";
import { useAtom } from "jotai";
import React, { useCallback } from "react";
import { mutate } from "swr";
import { addGithubProject } from "../api";
import { connectedToGitAtom, useGithubAuthorize, useGithubData } from "../hooks";

export const  GithubProjectsList = () => {
	const [gitInfo] = useAtom(connectedToGitAtom);
	const { selectedOrganisation, organisations, repositories, setSelectedOrganisation } = useGithubData(gitInfo);

	const { onGithubClick } = useGithubAuthorize();
	const handleOrgSelection = useCallback(([selected]) => {
		if (selected === "add_new") {
			onGithubClick(true);
			return;
		}

		setSelectedOrganisation(selected);
	}, []);

	return (
		<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-28"}
				css={css`
					padding: 18rem 20rem 18rem;
					background: #101215;
				`}
			>
				<div
					className={"font-cera font-700 mb-8 leading-none"}
					css={css`
						font-size: 13.5rem;
						color: white;
					`}
				>
					Connected to a git repository
				</div>
				<TextBlock fontSize={12} color={"#E4E4E4"}>
					Seamlessly create Deployments for any commits pushed to your Git repository.
				</TextBlock>

				<div className={"mt-24 mb-28"}>
					<div
						css={css`
							max-width: 300rem;
						`}
					>
						<SelectBox selected={[selectedOrganisation]} values={getOrganisatioNSelectBox(organisations)} callback={handleOrgSelection.bind(this)}></SelectBox>
					</div>
				</div>

				{repositories.map((repo) => (
					<GitProjectItem repo={repo} />
				))}
			</Card>

			<TextBlock className={"mt-08"} fontSize={"12"} color={"#787878"}>
				Learn more about login for connection
			</TextBlock>
		</div>
	);
}


export const getOrganisatioNSelectBox = (organisations: any) => {
	const organisation = organisations.map(({ id, name }) => ({
		value: id,
		label: name,
	}));

	const getAddNew = {
		value: "add_new",
		component: (
			<div className={"flex items-center"}>
				<AddSVG className={"mr-12"} /> Add new account/organisation
			</div>
		),
	};
	return [...organisation, getAddNew];
};

function GitProjectItem({ repo }: any) {
	const { currentProject: project } = useProjectDetails();

	const onSelect = useCallback(async () => {
		await addGithubProject(project.id, repo);

		mutate(getGitIntegrations(project.id));
	}, [repo]);
	return (
		<div className={"flex text-13 justify-between mb-16"}>
			<div className={"flex items-center"}>
				<div
					className="flex items-center justify-center mr-16"
					css={css`
						min-width: 28px;
						min-height: 28px;
						border-radius: 4rem;
						background: #323942;
					`}
				>
					<GithubSVG />
				</div>
				{repo.repoName}
			</div>

			<Button
				size={"x-small"}
				onClick={onSelect.bind(this)}
				css={css`
					min-width: 100rem;
				`}
			>
				<span
					className={"mt-1"}
					css={css`
						font-size: 12.5rem;
					`}
				>
					Connect
				</span>
			</Button>
		</div>
	);
}