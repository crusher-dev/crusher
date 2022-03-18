import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState, useMemo, useEffect, useCallback } from "react";

import { useAtom } from "jotai";
import useSWR, { mutate } from "swr";

import { Conditional } from "dyson/src/components/layouts";

import { createFolderAPI, getTestListAPI, unlinkGithubRepo } from "@constants/api";
import { IProjectTestsListResponse, IProjectTestItem } from "@crusher-shared/types/response/iProjectTestsListResponse";
import { TestStatusSVG } from "@svg/testReport";
import { backendRequest } from "@utils/common/backendRequest";
import { getBoolean } from "@utils/common";
import { timeSince } from "@utils/common/dateTimeUtils";
import { sendSnackBarEvent } from "@utils/common/notify";

import { appStateAtom } from "../../../store/atoms/global/appState";
import { currentProject } from "../../../store/atoms/global/project";
import { tempTestAtom } from "../../../store/atoms/global/temp/tempTestId";
import { tempTestNameAtom } from "../../../store/atoms/global/temp/tempTestName";

import { RequestMethod } from "../../../types/RequestOptions";
import { useRouter } from "next/router";
import { testFiltersAtom } from "@store/atoms/pages/testPage";
import { tempTestTypeAtom } from "@store/atoms/global/temp/tempTestType";
import { tempTestUpdateIdAtom } from "@store/atoms/global/temp/tempTestUpdateId";
import { EditIcon, Folder, TestIcon } from '@svg/tests';
import { PlaySVG } from "@svg/dashboard";

import { ClickableText } from "dyson/src/components/atoms/clickacbleLink/Text";
import { updateMeta } from "@store/mutators/metaData";
import { handleTestRun } from "@utils/core/testUtils";
import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { buildFiltersAtom } from "@store/atoms/pages/buildPage";
import { BuildTriggerEnum } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { Tooltip } from "dyson/src/components/atoms/tooltip/Tooltip";

interface IBuildItemCardProps {
	id: number;
	testName: string;
	isPassing: boolean;
	imageURL: string | null;
	videoURL: null | string;
	draftBuildId: number;
	firstRunCompleted: boolean;
	// In seconds
	createdAt: number;
}

const EmptyList = dynamic(() => import("@ui/components/common/EmptyList"));
const FirstTestRunStatus = dynamic(() => import("@ui/containers/tests/firstTestStatus"));
const EditTest = dynamic(() => import("@ui/containers/tests/editTest"));
const EditFolderModal = dynamic(() => import("@ui/containers/tests/editFolder"));

const saveTest = (projectId: number, tempTestId: string, customTestName: string | null = null) => {
	const testName = customTestName ? customTestName : new Date().toDateString().substr(4, 6) + " " + new Date().toLocaleTimeString().substr(0, 10);
	return backendRequest(`/projects/${projectId}/tests/actions/create`, {
		method: RequestMethod.POST,
		payload: { tempTestId, name: testName },
	});
};

const updateTest = (tempTestId: string, mainTestId: string) => {
	return backendRequest(`/tests/${mainTestId}/actions/update.steps`, {
		method: RequestMethod.POST,
		payload: { tempTestId },
	});
};

function TestCard(props: IBuildItemCardProps) {
	const { testData } = props;
	const { isRoot } = props;
	const { testName, isPassing, createdAt, imageURL, clipVideoURL, id, firstRunCompleted, draftBuildId, tags } = testData;
	const statusIcon = getBoolean(isPassing) ? (
		<TestStatusSVG type={"PASSED"} height={"16rem"} />
	) : (
		<TestStatusSVG
			css={css`
				margin-right: -3rem;
			`}
			type={firstRunCompleted ? "FAILED" : "RUNNING"}
			height={"14rem"}
		/>
	);

	const shouldPlayVideo = !imageURL && !!clipVideoURL;

	const [showEditBox, setShowEditBox] = useState(false);

	const testRunInThisHour = (Date.now() - testData.createdAt) / 1000 < 3600;

	return (
		<a href={`crusher://replay-test?testId=${id}`}>
		<div
			css={css`
				margin-top: -1rem;border-top: 1px solid #171b20;
			`}
		>
			<Conditional showIf={showEditBox}>
				<EditTest
					id={id}
					name={testName}
					folderId={testData.folderId}
					tags={tags}
					onClose={() => {
						setShowEditBox(false);
					}}
				/>
			</Conditional>
			<div css={[folderStyle, testItem]} className={`flex ${!isRoot && "pl-32"}`}>
				<div css={[containerWidth, testItemWidth(isRoot)]} className={"flex"}>
					<div className={"flex w-full justify-between"}>
						<div className={"flex"}>
							<TestIcon height={18} className={`mr-16 ${isRoot && "invisible"}`} />
							<div>
								<div className={"font-cera text-14 font-500 mb-8 leading-none"}>{testName}</div>
								<div
									className={"font-cera text-13 leading-none font-500"}
									css={css`
										color: #4a494b;
									`}
								>
									e2e test
								</div>
							</div>
						</div>

						<div>
							<div
								className={"edit flex justify-end"}
								onClick={(e) => {
									e.preventDefault();e.stopPropagation()
									!showEditBox && setShowEditBox(true);
								}}
							>
										<span className={"flex items-center"} css={editBlockCSS}>
								<EditIcon className={"mr-6"}/> <span className={"mt-4"}>Edit</span>
							</span>
							</div>
							<div className={"flex justify-end mt-8 items-center"}>
								<Conditional showIf={firstRunCompleted}>
									<Link href={`/app/build/${draftBuildId}?view_draft=true`}>
										<span className={"view-build leading-none mt-1"}>View build </span>
									</Link>
								</Conditional>
								<span className={"ml-16"}>{statusIcon}</span>
							</div>


						</div>
					</div>
				</div>
			</div>
		</div>
		</a>
	);
	return (
		<div css={itemContainerStyle}>
			<a css={itemImageStyle} href={`crusher://replay-test?testId=${id}`}>
				<Conditional showIf={!firstRunCompleted}>
					<FirstTestRunStatus isRunning={true} />
				</Conditional>

				<Conditional showIf={!!imageURL}>
					<img src={imageURL} />
				</Conditional>

				<Conditional showIf={shouldPlayVideo}>
					<video
						height={"100%"}
						css={css`
							object-fit: cover;
							width: 100%;
							height: 100%;
						`}
						onMouseOver={(event) => event.target.play()}
						onMouseOut={(event) => {
							event.target.pause();
							event.target.currentTime = 0;
						}}
						muted={true}
					>
						<source src={clipVideoURL} type="video/mp4" />
					</video>
				</Conditional>
			</a>
			<div css={itemMainContainerStyle}>
				<div className={"flex flex-row items-center"}>
					<div css={testNameStyle} className={"font-cera"}>
						{testName}
					</div>
					<div className={"ml-auto"}>{statusIcon}</div>
				</div>
				<div css={createdAtStyle} className={"flex justify-between mt-24 text-13"}>
					<span>{timeSince(new Date(createdAt))}</span>
					<div className={"flex "}>
						<span
							className={"edit"}
							onClick={() => {
								!showEditBox && setShowEditBox(true);
							}}
						>
								<span className={"flex items-center"} css={editBlockCSS}>
								<EditIcon className={"mr-6"}/> <span className={"mt-4"}>Edit</span>
							</span>
						</span>
						<Conditional showIf={testRunInThisHour}>
							<Link href={`/app/build/${draftBuildId}?view_draft=true`}>
								<span className={"view-build"}>View test build </span>
							</Link>
						</Conditional>
					</div>
				</div>
			</div>
		</div>
	);
}

const createdAtStyle = css`
	color: rgba(255, 255, 255, 0.6);
`;

const testNameStyle = css`
	color: rgba(255, 255, 255, 0.8);
	font-size: 15.5rem;
	font-weight: bold;
`;

const itemMainContainerStyle = css`
	//background: rgba(16, 18, 21, 0.5);
	padding: 20rem 0rem;
`;
const itemContainerStyle = css`
	//background: rgba(16, 18, 21, 0.5);
	//border: 1px solid #171c24;
	border-radius: 4rem;
	color: rgba(255, 255, 255, 0.6);
	width: 252rem;
	margin-bottom: 40px;
	overflow: hidden;
	margin-right: 32px;

	.showOnHover {
		visibility: hidden;
	}

	:hover {
		.showOnHover {
      visibility: visible !important;
			:hover {
				text-decoration: underline;
			}
		}
	}

	.view-build {
		color: #96a7ff;

		margin-left: 12rem;
		:hover {
			text-decoration: underline;
		}
	}
`;
const itemImageStyle = css`
	height: 183rem;
	width: 100%;
	border-radius: 4rem;

	border-width: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.1);
	overflow: hidden;
`;

function FolderItem(props: { folder: any; id: number }) {
	const [isOpen, setIsOpen] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);
	const [project] = useAtom(currentProject);
	const router = useRouter();
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [, updateMetaData] = useAtom(updateMeta);

	const [filters] = useAtom(testFiltersAtom);
	const [newTestCreated] = useState(false);
	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id, filters), {
		suspense: true,
		refreshInterval: newTestCreated ? 4000 : 200000,
	});

	const testList = useMemo(() => {
		return data.list.filter(({ folderId }) => props.id === folderId);
	}, [data.list]);


	const runTestsForThisFolder = useCallback(() => {
		(async () => {
			await handleTestRun(selectedProjectId, BuildTriggerEnum.MANUAL, { folder: props.folder.name}, router, updateMetaData);

			updateMetaData({
				type: "user",
				key: USER_META_KEYS.RAN_TEST,
				value: true,
			});

			updateMetaData({
				type: "project",
				key: PROJECT_META_KEYS.RAN_TEST,
				value: true,
			});
		})();
	}, [props.folder]);

	return (
		<div>
			<div
				onClick={() => {
					setIsOpen(!isOpen);
				}}
				css={[folderStyle]}
				className={"flex"}
			>
				<Conditional showIf={showEditBox}>
					<EditFolderModal id={props.id} name={props.folder.name} onClose={setShowEditBox.bind(this, false)} />
				</Conditional>
				<div css={containerWidth} className={"flex"}>
					<div css={folderBlock} className={"flex justify-between w-full"}>
						<div className={"flex"}>
							<Folder height={18} className={"mr-16"} />
							<div>
								<div className={"font-cera text-14 font-500 mb-12 leading-none"}>{props.folder.name}</div>
								<div className={"flex items-center"}>
									<span>{testList.length} tests</span>
									<Conditional showIf={testList.length>0}>
										<span className={"ml-16 text-12 open-folder hidden"}>Click to {isOpen? "close":"open"}</span>
									</Conditional>
								</div>
							</div>
						</div>

						<div className={"showOnHover"} css={css`display: flex;`}>
							<div
									onClick={(e) => {
										e.stopPropagation();
										runTestsForThisFolder(props.id);
									}}
							>
								<span css={[editBlockCSS, css`display: flex; align-items: center; margin-top: -3rem;`]}>
							<PlaySVG className={"mr-6"} height={10} width={10} />
								<span className={"flex items-center"}>
									Run tests
									</span>
									</span>
							</div>
						<div
								onClick={(e) => {
									e.stopPropagation();
									setShowEditBox(true);
								}}
								className={" edit"}
								css={ css`margin-left: 24rem`}
						>
							<span className={"flex items-center"} css={editBlockCSS}>
								<EditIcon className={"mr-6"}/> <span className={"mt-4"}>Edit</span>
							</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Conditional showIf={isOpen}>
				{testList.map((test: IProjectTestItem) => {
					const { id } = test;

					return <TestCard testData={test} key={id} id={id} />;
				})}
			</Conditional>
		</div>
	);
}

const editBlockCSS = css`
  margin-top: -6rem;

  :hover {
    path {
      fill: #6953be;
    }

    color: #6953be;
  }
`

const folderBlock = css`
  .showOnHover {
    visibility: hidden;
  }


	:hover {
		.showOnHover {
      visibility: visible;
		}
		.open-folder{
			display: block;
		}
	}
`;
function FolderList() {
	const [project] = useAtom(currentProject);
	const [filters] = useAtom(testFiltersAtom);
	const [newTestCreated] = useState(false);
	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id, filters), {
		suspense: true,
		refreshInterval: newTestCreated ? 4000 : 200000,
	});

	const { folders } = data;

	return (
		<div className={"mt-24"} css={css`border-top: 1px solid #171b20;`}>
			{folders.map((folder) => {
				return <FolderItem id={folder.id} key={folder.id} folder={folder} />;
			})}
		</div>
	);
}

const createFolder = (projectId: number) => {
	return backendRequest(createFolderAPI(projectId), {
		method: RequestMethod.POST,
		payload: {},
	});
};

function TestTopBar(props: { totalTests: any; onClick: () => Promise<void> }) {
	const router = useRouter();
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [, updateMetaData] = useAtom(updateMeta);

	const runProjectTest = useCallback(() => {
		(async () => {
			await handleTestRun(selectedProjectId, BuildTriggerEnum.MANUAL, {}, router, updateMetaData);

			updateMetaData({
				type: "user",
				key: USER_META_KEYS.RAN_TEST,
				value: true,
			});

			updateMetaData({
				type: "project",
				key: PROJECT_META_KEYS.RAN_TEST,
				value: true,
			});
		})();
	}, []);

	return (
		<div css={containerWidth} className={"flex justify-between items-start"}>
			<div>
				<div className={"text-15 font-600 font-cera mb-8"}>Your tests</div>
				<div className={"text-12"}>{props.totalTests} tests total</div>
			</div>

			<div className={"text-12 flex items-center"}>
				<div onClick={props.onClick}>
					<Tooltip
						autoHide
						content="Create folder"
						placement="bottom"
						type="hover"
						wrapperCSS={wrapperCSS}
						timer={2000}
						css={css`
							padding-top: 8rem;
						`}
					>
						<span>
							<Folder
								css={css`
									:hover {
										path {
											fill: #647cff;
										}
									}
								`}
							/>
						</span>
					</Tooltip>
				</div>
				<ClickableText className={"ml-8"} paddingY={6} paddingX={8} onClick={runProjectTest.bind(this)}>
					<div className={"text-12 flex items-center "}>
						<PlaySVG height={14} width={14} />
						<span className={"ml-8 text-13 mt-4 font-500"}>Run all tests</span>
					</div>
				</ClickableText>
			</div>
		</div>
	);
}

const wrapperCSS=css`

  animation: fadeIn 1300ms;

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    55% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
   55% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

function TestSearchableList() {
	const [project] = useAtom(currentProject);
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const [tempTestId, setTempTest] = useAtom(tempTestAtom);
	const [tempTestName, setTempTestName] = useAtom(tempTestNameAtom);
	const [tempTestType, setTempTestType] = useAtom(tempTestTypeAtom);
	const [tempTestUpdateId, setTempTestUpdateId] = useAtom(tempTestUpdateIdAtom);

	const [filters] = useAtom(testFiltersAtom);

	const [newTestCreated, setNewTestCreated] = useState(false);

	const { data } = useSWR<IProjectTestsListResponse>(getTestListAPI(project.id, filters), {
		suspense: true,
		refreshInterval: newTestCreated ? 4000 : 200000,
	});


	const rootTest = useMemo(() => {
		return data.list
			.filter(({ folderId }) => !folderId)
			.map((test: IProjectTestItem) => {
				const { id } = test;

				return <TestCard testData={test} key={id} id={id} isRoot={true} />;
			});
	}, [data.list]);


	useEffect(() => {
		if (!tempTestId || tempTestId === "null") return;

		(async () => {
			setTempTest(null);
			setTempTestName(null);

			if (tempTestType === "update") {
				await updateTest(tempTestId, tempTestUpdateId);
				sendSnackBarEvent({ message: "Updated the test", type: "success" });
			} else {
				await saveTest(selectedProjectId, tempTestId, !!tempTestName ? tempTestName : null);
				sendSnackBarEvent({ message: "Successfully saved the test", type: "success" });
			}

			setTempTestType(null);
			setTempTestUpdateId(null);

			await mutate(getTestListAPI(project.id));
			setNewTestCreated(true);
		})();
	}, []);

	return (
		<div>
			<Conditional showIf={data && data.list.length > 0}>
				<TestTopBar
					totalTests={data.list.length}
					onClick={async () => {
						await createFolder(project.id);
						await mutate(getTestListAPI(project.id));
					}}
				/>
				<FolderList />
				{rootTest}
			</Conditional>

			<Conditional showIf={data && data.list.length === 0}>
				<EmptyList title={"You don't have any test."} subTitle={"Your software needs some love. Create a test to keep it healthy."} />
			</Conditional>

		</div>
	);
}

const folderStyle = css`
	min-width: 100%;

	padding: 20px 0;

	font-size: 12px;

	border-bottom: 1px solid #171b20;

	:hover {
		background: #0b0d0f;
	}
`;

const testItem = css`
  padding: 20px 0;

  .view-build {


    margin-left: 12rem;
    :hover {    color: #96a7ff;
      text-decoration: underline;
    }
  }

  .showOnHover {
    visibility: hidden;
  }
	:hover {
		.showOnHover {
      visibility: visible;
		}
	}
`;

const containerWidth = css`
	padding: 0 48rem;
	margin: 0 auto;
	width: 100%;
`;

const testItemWidth = (isRoot) => css`
	padding-left: ${isRoot ? "20rem" : "48rem"};
`;

export { TestSearchableList };
