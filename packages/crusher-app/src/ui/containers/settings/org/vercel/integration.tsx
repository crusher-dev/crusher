import { getIntegrations, getVercelProjects, linkVercelToProject, unlinkVercelToProject } from "@constants/api";
import { css } from "@emotion/react";
import { useProjectDetails } from "@hooks/common";
import { currentProject } from "@store/atoms/global/project";
import { GithubSVG } from "@svg/social";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { Button, TextBlock } from "dyson/src/components/atoms";
import { Card } from "dyson/src/components/layouts/Card/Card";
import React, {useCallback} from "react";
import useSWR from "swr";

export function ProjectItem({ project, handleLink }) {
	const { currentProject: currentCrusherProject } = useProjectDetails();

	const onSelect = useCallback(async () => {
        handleLink(project);
	}, [project]);

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
				<VercelIcon
									css={css`
										path {
											fill: #fff !important;
										}
									`}
									height={"12rem"}
									width={"12rem"}
									className={"mt-1"}
								/>
				</div>
				{project.name}
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


const unlinkVercelIntegration = async (projectId: number) => {
	return backendRequest(unlinkVercelToProject(projectId), {
		method: RequestMethod.POST,
		payload: {}
	});
}
const linkVercelToRepo = (projectId: number, vercelPayload: any) => {
	const { name, id} = vercelPayload; 
	return backendRequest(linkVercelToProject(projectId), {
		method: RequestMethod.POST,
		payload: {
			vercel_project_id: vercelPayload.id,
			vercel_project_name: name,		
			meta: { ...vercelPayload },
		},
	});
};

function LinkedVercelProject({vercelIntegration}) {
	const { currentProject: currentCrusherProject } = useProjectDetails();
	const { name, vercelProjectId, meta } = vercelIntegration;

	const unlinkVercelProject = useCallback(async () => {
		unlinkVercelIntegration(currentCrusherProject.id).then((res) => {
			window.location.reload();
		});
	}, []);

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
							<VercelIcon
									css={css`
										path {
											fill: #fff !important;
										}
									`}
									height={"12rem"}
									width={"12rem"}
									className={"mt-1"}
								/>
						</div>

						<div>
							<TextBlock weight={600} className="mb-8" fontSize={14}>{name}</TextBlock>
							<a href={""} target={"_blank"}>
								<TextBlock color="#787878" className="mb-8" fontSize={12}>{name}</TextBlock>

							</a>
						</div>
					</div>

					<Button
						size={"small"}
						bgColor={"danger"}
						onClick={unlinkVercelProject.bind(this)}
					>
						<span className={"mt-1"}>Disconnect</span>
					</Button>
				</div>
			</Card>

			<TextBlock className={"mt-16"} fontSize={"12"} color={"#A7A7A8"}>
				Learn more about vercel integration
			</TextBlock>
		</div>
	);
}

export function VercelProjectsList({...props}) {
	const { currentProject } = useProjectDetails();
	const { data: integrations } = useSWR(getIntegrations(currentProject?.id));

    const { data: projectsRes } = useSWR(getVercelProjects());
    if(!projectsRes) return null;

    const { projects, pagination } = projectsRes;

	const handleLink = useCallback((vercelProject) => {
		console.log("Vercel Project", vercelProject);
		linkVercelToRepo(currentProject!.id, vercelProject).then((res) => {
			window.location.reload();
		});
	}, [currentProject]);

	const connected = integrations.vercelIntegration;

	console.log("Inte", integrations);
    return (
		<div {...props}>
				{!connected ? projects.map((project) => {
					return <ProjectItem handleLink={handleLink} project={project} />
				}): (
					<LinkedVercelProject vercelIntegration={integrations.vercelIntegration}/>
				)}
		</div>
	);
}



export const VercelIcon = (props: any) => (
    <svg
      viewBox={"0 0 1155 1000"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m577.344 0 577.346 1000H0L577.344 0Z" fill="#fff" />
    </svg>
);