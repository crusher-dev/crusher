import JobsService from "../services/JobsService";
import TestService from "../services/TestService";
import TestInstanceService from "../services/TestInstanceService";
import TestInstanceResultSetsService from "../services/TestInstanceResultSetsService";
import TestInstanceResultsService from "../services/TestInstanceResultsService";
import TestInstanceScreenShotsService from "../services/TestInstanceScreenShotsService";
import AlertingService from "../services/AlertingService";
import UserService from "../services/UserService";
import { InstanceStatus } from "../interfaces/InstanceStatus";
import { JobStatus } from "../interfaces/JobStatus";
import { TestInstance } from "../interfaces/db/TestInstance";
import { TestInstanceResultSetStatus } from "../interfaces/TestInstanceResultSetStatus";
import { TestInstanceScreenshot } from "../interfaces/db/TestInstanceScreenshot";
import { visualDiffWithURI } from "../utils/visualDiff";
import { uploadImageToBucket } from "../utils/cloudBucket";
import { TestType } from "../interfaces/TestType";
import { TestInstanceResultStatus } from "../interfaces/TestInstanceResultStatus";
import { updateGithubCheckStatus } from "../../utils/github";
import { GithubCheckStatus } from "../interfaces/GithubCheckStatus";
import { GithubConclusion } from "../interfaces/GithubConclusion";
import AlertingManager from "../manager/AlertingManager";
import { Container } from "typedi";
import { iUser } from "@crusher-shared/types/db/iUser";
import { EmailManager } from "../manager/EmailManager";
import { resolvePathToFrontendURI } from "../utils/uri";
import { Job } from "bullmq";
import { REDDIS } from "../../../config/database";
import "reflect-metadata";

//@ts-ignore
import IORedis from "ioredis";
import JobReportServiceV2 from "../services/v2/JobReportServiceV2";
import { TestInstanceResultSetConclusion } from "../interfaces/TestInstanceResultSetConclusion";
import { JobReportStatus } from "../interfaces/JobReportStatus";

const ReddisLock = require("redlock");
const jobsService = Container.get(JobsService);
const jobsReportService = Container.get(JobReportServiceV2);

const testService = Container.get(TestService);
const testInstanceService = Container.get(TestInstanceService);
const testInstanceResultSetsService = Container.get(TestInstanceResultSetsService);
const testInstanceResultsService = Container.get(TestInstanceResultsService);
const testInstanceScreenshotsService = Container.get(TestInstanceScreenShotsService);
const alertingService = Container.get(AlertingService);
const userService = Container.get(UserService);

interface TestInstanceWithImages extends TestInstance {
	images: {
		[imageKey: string]: TestInstanceScreenshot;
	};
}

async function getOrganisedTestInstancesWithImages(testInstances: Array<TestInstance>) {
	return testInstances.reduce(async (prevPromise, current) => {
		const prev = await prevPromise;
		const images = await testInstanceScreenshotsService.getAllScreenShotsOfInstance(current.id);

		const imagesMap = images.reduce((prevImages, image) => {
			return {
				...prevImages,
				[image.name + "_" + current.platform]: image,
			};
		}, {});

		return {
			...prev,
			[current.test_id]: {
				...prev[current.test_id],
				[current.platform]: {
					...current,
					images: imagesMap,
				},
			},
		};
	}, Promise.resolve({}));
}

async function getOrganisedTestInstanceWithImages(testInstance: TestInstance): Promise<TestInstanceWithImages> {
	const images = await testInstanceScreenshotsService.getAllScreenShotsOfInstance(testInstance.id);

	const imagesMap = images.reduce((prevImages, image) => {
		return {
			...prevImages,
			[image.name + "_" + testInstance.platform]: image,
		};
	}, {});

	return {
		...testInstance,
		images: imagesMap,
	};
}

function reduceInstancesMapToArr(testInstancesMap): Array<TestInstanceWithImages> {
	return Object.values(testInstancesMap).reduce((prev: Array<any>, current: any) => {
		return [...prev, ...Object.values(current)];
	}, []) as any;
}

function hasTestInstanceFinishedExecuting(testInstance: TestInstance) {
	return testInstance.status === InstanceStatus.FINISHED;
}

function getReferenceInstance(referenceJobId, testId, platform) {
	return testInstanceService.getReferenceTestInstance(referenceJobId, testId, platform);
}

function _getReferenceInstance(testInstancesMap, testId, platform) {
	if (testInstancesMap && testInstancesMap[testId] && testInstancesMap[testId][platform]) {
		return testInstancesMap[testId][platform];
	}

	return null;
}

async function calculateDiffBetweenImages(testInstanceImage, referenceInstanceImage) {
	let diffDelta, outputFile;
	let uploadedDiffUrl = "none";
	console.log("Generating visual diff", testInstanceImage.url, referenceInstanceImage.url);
	const diff = await visualDiffWithURI(testInstanceImage.url, referenceInstanceImage.url);

	diffDelta = diff.diffDelta;
	outputFile = diff.outputFile;
	console.log("Uploading visual diff", diffDelta, outputFile);

	uploadedDiffUrl = await uploadImageToBucket(outputFile, `${TestType.SAVED}/${testInstanceImage.instance_id}`);

	return { diffDelta, outputFile, uploadedDiffUrl };
}

function getInstanceResultStatus(hasPassed, hasFailed) {
	if (!hasPassed && !hasFailed) {
		return TestInstanceResultStatus.MANUAL_REVIEW_REQUIRED;
	} else if (hasPassed) {
		return TestInstanceResultStatus.PASSED;
	} else {
		return TestInstanceResultStatus.FAILED;
	}
}

async function getResultForTestInstance(
	testInstanceWithImages: TestInstanceWithImages,
	referenceInstanceWithImages: TestInstanceWithImages,
	resultSetId: number,
	shouldPerformDiffChecks,
) {
	const testInstanceImageKeys: Array<string> = Object.keys(testInstanceWithImages.images);

	let didAllImagesPass = true;
	let passedImagesCount = 0;
	let manualReviewImagesCount = 0;
	let failedImagesCount = 0;

	const outPromisesFun = testInstanceImageKeys.map((testInstanceKey) => {
		return async () => {
			const testInstanceImage = testInstanceWithImages.images[testInstanceKey];
			const referenceInstanceImage = referenceInstanceWithImages.images[testInstanceKey];

			if (shouldPerformDiffChecks && referenceInstanceImage) {
				try {
					const diffResult = await calculateDiffBetweenImages(testInstanceImage, referenceInstanceImage);
					const { diffDelta, outputFile, uploadedDiffUrl } = diffResult;
					const hasImagePassed = diffDelta <= 0.05 ? true : false;
					// THe middle area is for marked for review.
					const hasImageFailed = diffDelta > 5 ? true : false;

					const imageComparisonResult = getInstanceResultStatus(hasImagePassed, hasImageFailed);

					if (imageComparisonResult === TestInstanceResultStatus.MANUAL_REVIEW_REQUIRED) {
						didAllImagesPass = false;
						manualReviewImagesCount++;
					} else if (imageComparisonResult === TestInstanceResultStatus.PASSED) {
						passedImagesCount++;
					} else {
						didAllImagesPass = false;
						failedImagesCount++;
					}

					return await testInstanceResultsService.createResult({
						screenshot_id: testInstanceImage.id,
						target_screenshot_id: referenceInstanceImage.id,
						diff_delta: diffDelta,
						diff_image_url: uploadedDiffUrl,
						status: imageComparisonResult,
						instance_result_set_id: resultSetId,
					});
				} catch (ex) {
					didAllImagesPass = false;
					failedImagesCount++;
					return await testInstanceResultsService.createResult({
						screenshot_id: testInstanceImage.id,
						target_screenshot_id: referenceInstanceImage.id,
						diff_delta: 0,
						diff_image_url: null,
						status: TestInstanceResultStatus.ERROR_CREATING_DIFF,
						instance_result_set_id: resultSetId,
					});
				}
			} else {
				passedImagesCount++;

				return await testInstanceResultsService.createResult({
					screenshot_id: testInstanceImage.id,
					target_screenshot_id: testInstanceImage.id,
					diff_delta: 0,
					diff_image_url: null,
					status: TestInstanceResultStatus.PASSED,
					instance_result_set_id: resultSetId,
				});
			}
		};
	});

	try {
		await Promise.all(
			outPromisesFun.map((fun: any) => {
				return fun();
			}),
		);
	} catch (ex) {
		console.error("Something happened");
		console.error(ex);
	}

	return {
		didAllImagesPass,
		passedImagesCount,
		manualReviewImagesCount,
		failedImagesCount,
	};
}

async function notifyResultWithEmail(jobRecord: any, result: JobReportStatus, userWhoStartedTheJob: iUser) {
	const usersInTeam = await testService.findMembersOfProject(jobRecord.project_id);

	if (result === JobReportStatus.FAILED) {
		EmailManager.sendEmailToUsers(
			usersInTeam,
			`Job ${jobRecord.id} Failed`,
			unescape(
				`%3Chtml%20xmlns%3D%22http%3A//www.w3.org/1999/xhtml%22%3E%3Chead%3E%0A%20%20%20%20%3Clink%20href%3D%22https%3A//fonts.googleapis.com/css2%3Ffamily%3DDM+Sans%3Awght@400%3B500%3B700%26amp%3Bdisplay%3Dswap%22%20rel%3D%22stylesheet%22%3E%0A%20%20%20%20%3Cmeta%20http-equiv%3D%22content-type%22%20content%3D%22text/html%3B%20charset%3Dutf-8%22%3E%0A%20%20%20%20%3Cmeta%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%2C%20initial-scale%3D1.0%3B%22%3E%0A%20%20%20%20%3Cmeta%20name%3D%22format-detection%22%20content%3D%22telephone%3Dno%22%3E%0A%20%20%20%20%3C%21--%20Responsive%20Mobile-First%20Email%20Template%20by%20Konstantin%20Savchenko%2C%202015.%0A%20%20%20%20%20%20https%3A//github.com/konsav/email-templates/%20%20--%3E%0A%20%20%20%20%3Cstyle%3E%0A%20%20%20%20%20%20/*%20Reset%20styles%20*/%20%0A%20%20%20%20%20%20body%20%7B%20margin%3A%200%3B%20padding%3A%200%3B%20min-width%3A%20100%25%3B%20width%3A%20100%25%20%21important%3B%20height%3A%20100%25%20%21important%3B%7D%0A%20%20%20%20%20%20body%2C%20table%2C%20td%2C%20div%2C%20p%2C%20a%20%7B%20-webkit-font-smoothing%3A%20antialiased%3B%20text-size-adjust%3A%20100%25%3B%20-ms-text-size-adjust%3A%20100%25%3B%20-webkit-text-size-adjust%3A%20100%25%3B%20line-height%3A%20100%25%3B%20%7D%0A%20%20%20%20%20%20table%2C%20td%20%7B%20mso-table-lspace%3A%200pt%3B%20mso-table-rspace%3A%200pt%3B%20border-collapse%3A%20collapse%20%21important%3B%20border-spacing%3A%200%3B%20%7D%0A%20%20%20%20%20%20img%20%7B%20border%3A%200%3B%20line-height%3A%20100%25%3B%20outline%3A%20none%3B%20text-decoration%3A%20none%3B%20-ms-interpolation-mode%3A%20bicubic%3B%20%7D%0A%20%20%20%20%20%20%23outlook%20a%20%7B%20padding%3A%200%3B%20%7D%0A%20%20%20%20%20%20.ReadMsgBody%20%7B%20width%3A%20100%25%3B%20%7D%20.ExternalClass%20%7B%20width%3A%20100%25%3B%20%7D%0A%20%20%20%20%20%20.ExternalClass%2C%20.ExternalClass%20p%2C%20.ExternalClass%20span%2C%20.ExternalClass%20font%2C%20.ExternalClass%20td%2C%20.ExternalClass%20div%20%7B%20line-height%3A%20100%25%3B%20%7D%0A%20%20%20%20%20%20/*%20Rounded%20corners%20for%20advanced%20mail%20clients%20only%20*/%20%0A%20%20%20%20%20%20@media%20all%20and%20%28min-width%3A%20560px%29%20%7B%0A%20%20%20%20%20%20.container%20%7B%20border-radius%3A%208px%3B%20-webkit-border-radius%3A%208px%3B%20-moz-border-radius%3A%208px%3B%20-khtml-border-radius%3A%208px%3B%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20/*%20Set%20color%20for%20auto%20links%20%28addresses%2C%20dates%2C%20etc.%29%20*/%20%0A%20%20%20%20%20%20a%2C%20a%3Ahover%20%7B%0A%20%20%20%20%20%20color%3A%20%23FFFFFF%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20.footer%20a%2C%20.footer%20a%3Ahover%20%7B%0A%20%20%20%20%20%20color%3A%20%23828999%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20.heading%7B%0A%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20font-size%3A%2026px%3B%0A%20%20%20%20%20%20font-weight%3A%20bold%3B%0A%20%20%20%20%20%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20padding-top%3A%205px%3B%0A%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20letter-spacing%3A%20-.5px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%3C/style%3E%0A%20%20%20%20%3C%21--%20MESSAGE%20SUBJECT%20--%3E%0A%20%20%20%20%3Ctitle%3EResponsive%20HTML%20email%20templates%3C/title%3E%0A%20%20%3C/head%3E%0A%20%20%3C%21--%20BODY%20--%3E%0A%20%20%3C%21--%20Set%20message%20background%20color%20%28twice%29%20and%20text%20color%20%28twice%29%20--%3E%0A%20%20%3Cbody%20topmargin%3D%220%22%20rightmargin%3D%220%22%20bottommargin%3D%220%22%20leftmargin%3D%220%22%20marginwidth%3D%220%22%20marginheight%3D%220%22%20width%3D%22100%25%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bbackground%3A%20%23f1f5f9%3Bwidth%3A%20100%25%3Bheight%3A%20100%25%3B-webkit-font-smoothing%3A%20antialiased%3Btext-size-adjust%3A%20100%25%3B-ms-text-size-adjust%3A%20100%25%3B-webkit-text-size-adjust%3A%20100%25%3Bline-height%3A%20100%25%3Bfont-family%3A%20serif%3B%22%3E%0A%20%20%20%20%3C%21--%20SECTION%20/%20BACKGROUND%20--%3E%0A%20%20%20%20%3C%21--%20Set%20message%20background%20color%20one%20again%20--%3E%0A%20%20%20%20%3Ctable%20width%3D%22100%25%22%20align%3D%22center%22%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bwidth%3A%20100%25%3Bpadding%3A%2080px%3B%22%20class%3D%22%22%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bbackground%3A%20%23f1f5f9%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20WRAPPER%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20Set%20wrapper%20width%20%28twice%29%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20PREHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20LOGO%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20Image%20text%20color%20should%20be%20opposite%20to%20background%20color.%20Set%20your%20url%2C%20image%20src%2C%20alt%20and%20title.%20Alt%20text%20should%20fit%20the%20image%20size.%20Real%20image%20size%20should%20be%20x2.%20URL%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3Dlogo%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%20href%3D%22https%3A//github.com/konsav/email-templates/%22%3E%3Cimg%20border%3D%220%22%20vspace%3D%220%22%20hspace%3D%220%22%20src%3D%22https%3A//i.imgur.com/i7dbaQI.png%22%20height%3D%2228%22%20alt%3D%22Logo%22%20title%3D%22Logo%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2010px%3B%20margin%3A%200%3B%20padding%3A%200%3B%20outline%3A%20none%3B%20text-decoration%3A%20none%3B%20-ms-interpolation-mode%3A%20bicubic%3B%20border%3A%20none%3B%20display%3A%20block%3B%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20width%3D%22500%22%20style%3D%22%0A%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20width%3A%20inherit%3B%0A%20%20%20%20%20%20max-width%3A%20560px%3B%0A%20%20%20%20%20%20background%3A%20%23fff%3B%0A%20%20%20%20%20%20border-radius%3A%208px%3B%0A%20%20%20%20%20%20padding%3A%2020px%200px%3B%0A%20%20%20%20%20%20%22%20class%3D%22wrapper%22%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20SUPHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HERO%20IMAGE%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Image%20text%20color%20should%20be%20opposite%20to%20background%20color.%20Set%20your%20url%2C%20image%20src%2C%20alt%20and%20title.%20Alt%20text%20should%20fit%20the%20image%20size.%20Real%20image%20size%20should%20be%20x2%20%28wrapper%20x2%29.%20Do%20not%20set%20height%20for%20flexible%20images%20%28including%20%22auto%22%29.%20URL%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3D%7B%7B%CCmage-Name%7D%7D%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20margin-top%3A%2012px%3B%0A%20%20%20%20%20%20%20%20%20%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22hero%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%20href%3D%22https%3A//github.com/konsav/email-templates/%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20SUPHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2024px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20bold%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20Your%20recent%20build%20has%20failed%20%uD83D%uDEAB%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2020px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20bold%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2016px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%232d3958%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22header%22%3E%23%20${escape(
					jobRecord.id,
				)}%20-%20${escape(
					jobRecord.branch_name,
				)}%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2017px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23242424%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22paragraph%22%3ETo%20get%20view%20logs%2C%20go%20to%20builds%20page%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20BUTTON%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20button%20background%20color%20at%20TD%2C%20link/text%20color%20at%20A%20and%20TD%2C%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20at%20TD.%20For%20verification%20codes%20add%20%22letter-spacing%3A%205px%3B%22.%20Link%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3D%7B%7BButton-Name%7D%7D%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22button%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22${resolvePathToFrontendURI(
					`/app/job/review?jobId=${jobRecord.id}`,
				)}%22%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20style%3D%22max-width%3A%20240px%3B%20min-width%3A%20120px%3B%20border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20padding%3A%200%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22middle%22%20style%3D%22padding%3A%2012px%2024px%3B%20margin%3A%200%3B%20text-decoration%3A%20none%3B%20font-weight%3A%20500%3B%20border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20border-radius%3A%204px%3B%20-webkit-border-radius%3A%204px%3B%20-moz-border-radius%3A%204px%3B%20-khtml-border-radius%3A%204px%3B%22%20bgcolor%3D%22%235f7aff%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20600%20%21important%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20text-decoration%3A%20none%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23FFFFFF%3B%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20font-size%3A%2017px%3B%20font-weight%3A%20400%3B%20line-height%3A%20120%25%3B%22%20href%3D%22https%3A//github.com/konsav/email-templates/%22%3EGo%20to%20Builds%20page%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%3C/tr%3E%3C/tbody%3E%3C/table%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20End%20of%20WRAPPER%20--%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%20%20%3C%21--%20End%20of%20SECTION%20/%20BACKGROUND%20--%3E%0A%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20width%3D%22500%22%20style%3D%22%0A%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20width%3A%20inherit%3B%0A%20%20%20%20%20%20max-width%3A%20560px%3B%0A%20%20%20%20%20%20background%3A%20%23fff%3B%0A%20%20%20%20%20%20border-radius%3A%208px%3B%0A%20%20%20%20%20%20padding%3A%2020px%200px%3B%0A%20%20%20%20%20%20margin-top%3A%2040px%3B%0A%20%20%20%20%20%20%22%20class%3D%22wrapper%22%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20SUPHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HERO%20IMAGE%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Image%20text%20color%20should%20be%20opposite%20to%20background%20color.%20Set%20your%20url%2C%20image%20src%2C%20alt%20and%20title.%20Alt%20text%20should%20fit%20the%20image%20size.%20Real%20image%20size%20should%20be%20x2%20%28wrapper%20x2%29.%20Do%20not%20set%20height%20for%20flexible%20images%20%28including%20%22auto%22%29.%20URL%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3D%7B%7B%CCmage-Name%7D%7D%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2020px%3B%20font-weight%3A%20bold%3B%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20For%20support%2C%20feedback%20or%20help%20%u260E%uFE0F%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2015px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20I%27ll%20be%20happy%20to%20schedule%20one%20on%20one%20call%20with%20you.%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%20padding-bottom%3A%200px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2017px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20Himanshu%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%20padding-bottom%3A%2040px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2014px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20+91-7296823551%20%3Cbr%3E%20himanshu@crusher.dev%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20End%20of%20WRAPPER%20--%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%20%20%3Ctable%20width%3D%22550%22%20align%3D%22center%22%3E%0A%20%20%20%20%20%20%3C%21--%20LINE%20--%3E%0A%20%20%20%20%20%20%3C%21--%20Set%20line%20color%20--%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2030px%3B%22%20class%3D%22line%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Chr%20color%3D%22%23b6bbc6%22%20align%3D%22center%22%20width%3D%22100%25%22%20size%3D%221%22%20noshade%3D%22%22%20style%3D%22margin%3A%200%3B%20padding%3A%200%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20FOOTER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2013px%3B%20font-weight%3A%20400%3B%20line-height%3A%20150%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2010px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2020px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23828999%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22footer%22%3EYou%27re%20receiving%20this%20becuase%20you%27ve%20registered%20at%20crusher.%3Cbr%3E%20Check%20%3Ca%20href%3D%22https%3A//github.com/konsav/email-templates/%22%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20underline%3B%20color%3A%20%23828999%3B%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20font-size%3A%2013px%3B%20font-weight%3A%20400%3B%20line-height%3A%20150%25%3B%22%3Esubscription%20settings%3C/a%3E.%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%0A%3C/body%3E%3C/html%3E`,
			),
		);
	} else if (result === JobReportStatus.PASSED) {
		EmailManager.sendEmailToUsers(
			usersInTeam,
			`Job ${jobRecord.id} Failed`,
			unescape(
				`%3Chtml%20xmlns%3D%22http%3A//www.w3.org/1999/xhtml%22%3E%3Chead%3E%0A%20%20%20%20%3Clink%20href%3D%22https%3A//fonts.googleapis.com/css2%3Ffamily%3DDM+Sans%3Awght@400%3B500%3B700%26amp%3Bdisplay%3Dswap%22%20rel%3D%22stylesheet%22%3E%0A%20%20%20%20%3Cmeta%20http-equiv%3D%22content-type%22%20content%3D%22text/html%3B%20charset%3Dutf-8%22%3E%0A%20%20%20%20%3Cmeta%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%2C%20initial-scale%3D1.0%3B%22%3E%0A%20%20%20%20%3Cmeta%20name%3D%22format-detection%22%20content%3D%22telephone%3Dno%22%3E%0A%20%20%20%20%3C%21--%20Responsive%20Mobile-First%20Email%20Template%20by%20Konstantin%20Savchenko%2C%202015.%0A%20%20%20%20%20%20https%3A//github.com/konsav/email-templates/%20%20--%3E%0A%20%20%20%20%3Cstyle%3E%0A%20%20%20%20%20%20/*%20Reset%20styles%20*/%20%0A%20%20%20%20%20%20body%20%7B%20margin%3A%200%3B%20padding%3A%200%3B%20min-width%3A%20100%25%3B%20width%3A%20100%25%20%21important%3B%20height%3A%20100%25%20%21important%3B%7D%0A%20%20%20%20%20%20body%2C%20table%2C%20td%2C%20div%2C%20p%2C%20a%20%7B%20-webkit-font-smoothing%3A%20antialiased%3B%20text-size-adjust%3A%20100%25%3B%20-ms-text-size-adjust%3A%20100%25%3B%20-webkit-text-size-adjust%3A%20100%25%3B%20line-height%3A%20100%25%3B%20%7D%0A%20%20%20%20%20%20table%2C%20td%20%7B%20mso-table-lspace%3A%200pt%3B%20mso-table-rspace%3A%200pt%3B%20border-collapse%3A%20collapse%20%21important%3B%20border-spacing%3A%200%3B%20%7D%0A%20%20%20%20%20%20img%20%7B%20border%3A%200%3B%20line-height%3A%20100%25%3B%20outline%3A%20none%3B%20text-decoration%3A%20none%3B%20-ms-interpolation-mode%3A%20bicubic%3B%20%7D%0A%20%20%20%20%20%20%23outlook%20a%20%7B%20padding%3A%200%3B%20%7D%0A%20%20%20%20%20%20.ReadMsgBody%20%7B%20width%3A%20100%25%3B%20%7D%20.ExternalClass%20%7B%20width%3A%20100%25%3B%20%7D%0A%20%20%20%20%20%20.ExternalClass%2C%20.ExternalClass%20p%2C%20.ExternalClass%20span%2C%20.ExternalClass%20font%2C%20.ExternalClass%20td%2C%20.ExternalClass%20div%20%7B%20line-height%3A%20100%25%3B%20%7D%0A%20%20%20%20%20%20/*%20Rounded%20corners%20for%20advanced%20mail%20clients%20only%20*/%20%0A%20%20%20%20%20%20@media%20all%20and%20%28min-width%3A%20560px%29%20%7B%0A%20%20%20%20%20%20.container%20%7B%20border-radius%3A%208px%3B%20-webkit-border-radius%3A%208px%3B%20-moz-border-radius%3A%208px%3B%20-khtml-border-radius%3A%208px%3B%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20/*%20Set%20color%20for%20auto%20links%20%28addresses%2C%20dates%2C%20etc.%29%20*/%20%0A%20%20%20%20%20%20a%2C%20a%3Ahover%20%7B%0A%20%20%20%20%20%20color%3A%20%23FFFFFF%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20.footer%20a%2C%20.footer%20a%3Ahover%20%7B%0A%20%20%20%20%20%20color%3A%20%23828999%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20.heading%7B%0A%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20font-size%3A%2026px%3B%0A%20%20%20%20%20%20font-weight%3A%20bold%3B%0A%20%20%20%20%20%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20padding-top%3A%205px%3B%0A%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20letter-spacing%3A%20-.5px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%3C/style%3E%0A%20%20%20%20%3C%21--%20MESSAGE%20SUBJECT%20--%3E%0A%20%20%20%20%3Ctitle%3EResponsive%20HTML%20email%20templates%3C/title%3E%0A%20%20%3C/head%3E%0A%20%20%3C%21--%20BODY%20--%3E%0A%20%20%3C%21--%20Set%20message%20background%20color%20%28twice%29%20and%20text%20color%20%28twice%29%20--%3E%0A%20%20%3Cbody%20topmargin%3D%220%22%20rightmargin%3D%220%22%20bottommargin%3D%220%22%20leftmargin%3D%220%22%20marginwidth%3D%220%22%20marginheight%3D%220%22%20width%3D%22100%25%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bbackground%3A%20%23f1f5f9%3Bwidth%3A%20100%25%3Bheight%3A%20100%25%3B-webkit-font-smoothing%3A%20antialiased%3Btext-size-adjust%3A%20100%25%3B-ms-text-size-adjust%3A%20100%25%3B-webkit-text-size-adjust%3A%20100%25%3Bline-height%3A%20100%25%3Bfont-family%3A%20serif%3B%22%3E%0A%20%20%20%20%3C%21--%20SECTION%20/%20BACKGROUND%20--%3E%0A%20%20%20%20%3C%21--%20Set%20message%20background%20color%20one%20again%20--%3E%0A%20%20%20%20%3Ctable%20width%3D%22100%25%22%20align%3D%22center%22%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bwidth%3A%20100%25%3Bpadding%3A%2080px%3B%22%20class%3D%22%22%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bbackground%3A%20%23f1f5f9%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20WRAPPER%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20Set%20wrapper%20width%20%28twice%29%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20PREHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20LOGO%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%21--%20Image%20text%20color%20should%20be%20opposite%20to%20background%20color.%20Set%20your%20url%2C%20image%20src%2C%20alt%20and%20title.%20Alt%20text%20should%20fit%20the%20image%20size.%20Real%20image%20size%20should%20be%20x2.%20URL%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3Dlogo%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%20href%3D%22https%3A//github.com/konsav/email-templates/%22%3E%3Cimg%20border%3D%220%22%20vspace%3D%220%22%20hspace%3D%220%22%20src%3D%22https%3A//i.imgur.com/i7dbaQI.png%22%20height%3D%2228%22%20alt%3D%22Logo%22%20title%3D%22Logo%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2010px%3B%20margin%3A%200%3B%20padding%3A%200%3B%20outline%3A%20none%3B%20text-decoration%3A%20none%3B%20-ms-interpolation-mode%3A%20bicubic%3B%20border%3A%20none%3B%20display%3A%20block%3B%22%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20width%3D%22500%22%20style%3D%22%0A%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20width%3A%20inherit%3B%0A%20%20%20%20%20%20max-width%3A%20560px%3B%0A%20%20%20%20%20%20background%3A%20%23fff%3B%0A%20%20%20%20%20%20border-radius%3A%208px%3B%0A%20%20%20%20%20%20padding%3A%2020px%200px%3B%0A%20%20%20%20%20%20%22%20class%3D%22wrapper%22%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20SUPHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HERO%20IMAGE%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Image%20text%20color%20should%20be%20opposite%20to%20background%20color.%20Set%20your%20url%2C%20image%20src%2C%20alt%20and%20title.%20Alt%20text%20should%20fit%20the%20image%20size.%20Real%20image%20size%20should%20be%20x2%20%28wrapper%20x2%29.%20Do%20not%20set%20height%20for%20flexible%20images%20%28including%20%22auto%22%29.%20URL%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3D%7B%7B%CCmage-Name%7D%7D%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20margin-top%3A%2012px%3B%0A%20%20%20%20%20%20%20%20%20%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22hero%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%20href%3D%22https%3A//github.com/konsav/email-templates/%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20SUPHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2024px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20bold%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20Your%20recent%20build%20has%20failed%20%uD83D%uDEAB%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2020px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20bold%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2016px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%232d3958%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22header%22%3E%23%20${escape(
					jobRecord.id,
				)}%20-%20${escape(
					jobRecord.branch_name,
				)}%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2017px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23242424%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22paragraph%22%3ETo%20get%20view%20logs%2C%20go%20to%20builds%20page%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20BUTTON%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20button%20background%20color%20at%20TD%2C%20link/text%20color%20at%20A%20and%20TD%2C%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20at%20TD.%20For%20verification%20codes%20add%20%22letter-spacing%3A%205px%3B%22.%20Link%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3D%7B%7BButton-Name%7D%7D%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22button%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22${resolvePathToFrontendURI(
					`/app/job/review?jobId=${jobRecord.id}`,
				)}%22%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20style%3D%22max-width%3A%20240px%3B%20min-width%3A%20120px%3B%20border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20padding%3A%200%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22middle%22%20style%3D%22padding%3A%2012px%2024px%3B%20margin%3A%200%3B%20text-decoration%3A%20none%3B%20font-weight%3A%20500%3B%20border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20border-radius%3A%204px%3B%20-webkit-border-radius%3A%204px%3B%20-moz-border-radius%3A%204px%3B%20-khtml-border-radius%3A%204px%3B%22%20bgcolor%3D%22%235f7aff%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20600%20%21important%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20text-decoration%3A%20none%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23FFFFFF%3B%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20font-size%3A%2017px%3B%20font-weight%3A%20400%3B%20line-height%3A%20120%25%3B%22%20href%3D%22https%3A//github.com/konsav/email-templates/%22%3EGo%20to%20Builds%20page%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%3C/tr%3E%3C/tbody%3E%3C/table%3E%3C/a%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20End%20of%20WRAPPER%20--%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%20%20%3C%21--%20End%20of%20SECTION%20/%20BACKGROUND%20--%3E%0A%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20width%3D%22500%22%20style%3D%22%0A%20%20%20%20%20%20border-collapse%3A%20collapse%3B%0A%20%20%20%20%20%20border-spacing%3A%200%3B%0A%20%20%20%20%20%20padding%3A%200%3B%0A%20%20%20%20%20%20width%3A%20inherit%3B%0A%20%20%20%20%20%20max-width%3A%20560px%3B%0A%20%20%20%20%20%20background%3A%20%23fff%3B%0A%20%20%20%20%20%20border-radius%3A%208px%3B%0A%20%20%20%20%20%20padding%3A%2020px%200px%3B%0A%20%20%20%20%20%20margin-top%3A%2040px%3B%0A%20%20%20%20%20%20%22%20class%3D%22wrapper%22%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20SUPHEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HERO%20IMAGE%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Image%20text%20color%20should%20be%20opposite%20to%20background%20color.%20Set%20your%20url%2C%20image%20src%2C%20alt%20and%20title.%20Alt%20text%20should%20fit%20the%20image%20size.%20Real%20image%20size%20should%20be%20x2%20%28wrapper%20x2%29.%20Do%20not%20set%20height%20for%20flexible%20images%20%28including%20%22auto%22%29.%20URL%20format%3A%20http%3A//domain.com/%3Futm_source%3D%7B%7BCampaign-Source%7D%7D%26utm_medium%3Demail%26utm_content%3D%7B%7B%CCmage-Name%7D%7D%26utm_campaign%3D%7B%7BCampaign-Name%7D%7D%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20HEADER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2020px%3B%20font-weight%3A%20bold%3B%20line-height%3A%20130%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22header%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20For%20support%2C%20feedback%20or%20help%20%u260E%uFE0F%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2015px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20I%27ll%20be%20happy%20to%20schedule%20one%20on%20one%20call%20with%20you.%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%20padding-bottom%3A%200px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2017px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20Himanshu%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20PARAGRAPH%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%20padding-bottom%3A%2040px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2014px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20+91-7296823551%20%3Cbr%3E%20himanshu@crusher.dev%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20End%20of%20WRAPPER%20--%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%20%20%3Ctable%20width%3D%22550%22%20align%3D%22center%22%3E%0A%20%20%20%20%20%20%3C%21--%20LINE%20--%3E%0A%20%20%20%20%20%20%3C%21--%20Set%20line%20color%20--%3E%0A%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2030px%3B%22%20class%3D%22line%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Chr%20color%3D%22%23b6bbc6%22%20align%3D%22center%22%20width%3D%22100%25%22%20size%3D%221%22%20noshade%3D%22%22%20style%3D%22margin%3A%200%3B%20padding%3A%200%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20FOOTER%20--%3E%0A%20%20%20%20%20%20%20%20%3C%21--%20Set%20text%20color%20and%20font%20family%20%28%22%27DM%20Sans%27%2Csans-serif%22%20or%20%22Georgia%2C%20serif%22%29.%20Duplicate%20all%20text%20styles%20in%20links%2C%20including%20line-height%20--%3E%0A%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2013px%3B%20font-weight%3A%20400%3B%20line-height%3A%20150%25%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2010px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2020px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23828999%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22footer%22%3EYou%27re%20receiving%20this%20becuase%20you%27ve%20registered%20at%20crusher.%3Cbr%3E%20Check%20%3Ca%20href%3D%22https%3A//github.com/konsav/email-templates/%22%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20underline%3B%20color%3A%20%23828999%3B%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20font-size%3A%2013px%3B%20font-weight%3A%20400%3B%20line-height%3A%20150%25%3B%22%3Esubscription%20settings%3C/a%3E.%0A%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%3C/table%3E%0A%20%20%0A%3C/body%3E%3C/html%3E`,
			),
		);
	} else if (result === JobReportStatus.MANUAL_REVIEW_REQUIRED) {
		EmailManager.sendEmailToUsers(
			usersInTeam,
			`Job ${jobRecord.id}, Manual Review Required!!`,
			unescape(
				`
                %3Chtml%20xmlns%3D%22http%3A//www.w3.org/1999/xhtml%22%3E%0A%20%20%20%3Chead%3E%0A%20%20%20%20%20%20%3Clink%20href%3D%22https%3A//fonts.googleapis.com/css2%3Ffamily%3DDM+Sans%3Awght@400%3B500%3B700%26amp%3Bdisplay%3Dswap%22%20rel%3D%22stylesheet%22%3E%0A%20%20%20%20%20%20%3Cmeta%20http-equiv%3D%22content-type%22%20content%3D%22text/html%3B%20charset%3Dutf-8%22%3E%0A%20%20%20%20%20%20%3Cmeta%20name%3D%22viewport%22%20content%3D%22width%3Ddevice-width%2C%20initial-scale%3D1.0%3B%22%3E%0A%20%20%20%20%20%20%3Cmeta%20name%3D%22format-detection%22%20content%3D%22telephone%3Dno%22%3E%0A%0A%20%20%20%20%20%20%3Cstyle%3E%20%20%20%20%20%20body%20%7B%20margin%3A%200%3B%20padding%3A%200%3B%20min-width%3A%20100%25%3B%20width%3A%20100%25%20%21important%3B%20height%3A%20100%25%20%21important%3B%7D%20%20%20%20%20%20%20body%2C%20table%2C%20td%2C%20div%2C%20p%2C%20a%20%7B%20-webkit-font-smoothing%3A%20antialiased%3B%20text-size-adjust%3A%20100%25%3B%20-ms-text-size-adjust%3A%20100%25%3B%20-webkit-text-size-adjust%3A%20100%25%3B%20line-height%3A%20100%25%3B%20%7D%20%20%20%20%20%20%20table%2C%20td%20%7B%20mso-table-lspace%3A%200pt%3B%20mso-table-rspace%3A%200pt%3B%20border-collapse%3A%20collapse%20%21important%3B%20border-spacing%3A%200%3B%20%7D%20%20%20%20%20%20%20img%20%7B%20border%3A%200%3B%20line-height%3A%20100%25%3B%20outline%3A%20none%3B%20text-decoration%3A%20none%3B%20-ms-interpolation-mode%3A%20bicubic%3B%20%7D%20%20%20%20%20%20%20%23outlook%20a%20%7B%20padding%3A%200%3B%20%7D%20%20%20%20%20%20%20.ReadMsgBody%20%7B%20width%3A%20100%25%3B%20%7D%20.ExternalClass%20%7B%20width%3A%20100%25%3B%20%7D%20%20%20%20%20%20%20.ExternalClass%2C%20.ExternalClass%20p%2C%20.ExternalClass%20span%2C%20.ExternalClass%20font%2C%20.ExternalClass%20td%2C%20.ExternalClass%20div%20%7B%20line-height%3A%20100%25%3B%20%7D%20%20%20%20%20%20%20%20%20@media%20all%20and%20%28min-width%3A%20560px%29%20%7B%20%20%20%20%20%20%20.container%20%7B%20border-radius%3A%208px%3B%20-webkit-border-radius%3A%208px%3B%20-moz-border-radius%3A%208px%3B%20-khtml-border-radius%3A%208px%3B%20%7D%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%20%20%20%20a%2C%20a%3Ahover%20%7B%20%20%20%20%20%20%20color%3A%20%23FFFFFF%3B%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20.footer%20a%2C%20.footer%20a%3Ahover%20%7B%20%20%20%20%20%20%20color%3A%20%23828999%3B%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20.heading%7B%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20margin%3A%200%3B%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%20%20%20%20%20%20%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20font-size%3A%2026px%3B%20%20%20%20%20%20%20font-weight%3A%20bold%3B%20%20%20%20%20%20%20line-height%3A%20130%25%3B%20%20%20%20%20%20%20padding-top%3A%205px%3B%20%20%20%20%20%20%20color%3A%20%23000000%3B%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20%20%20%20%20%20%20letter-spacing%3A%20-.5px%3B%20%20%20%20%20%20%20%7D%20%20%20%20%20%3C/style%3E%0A%20%20%20%20%20%20%3Ctitle%3EResponsive%20HTML%20email%20templates%3C/title%3E%0A%20%20%20%3C/head%3E%0A%20%20%20%3Cbody%20topmargin%3D%220%22%20rightmargin%3D%220%22%20bottommargin%3D%220%22%20leftmargin%3D%220%22%20marginwidth%3D%220%22%20marginheight%3D%220%22%20width%3D%22100%25%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bbackground%3A%20%23f1f5f9%3Bwidth%3A%20100%25%3Bheight%3A%20100%25%3B-webkit-font-smoothing%3A%20antialiased%3Btext-size-adjust%3A%20100%25%3B-ms-text-size-adjust%3A%20100%25%3B-webkit-text-size-adjust%3A%20100%25%3Bline-height%3A%20100%25%3Bfont-family%3A%20serif%3B%22%3E%0A%20%20%20%20%20%20%3Ctable%20width%3D%22100%25%22%20align%3D%22center%22%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bwidth%3A%20100%25%3Bpadding%3A%2080px%3B%22%20class%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3Bborder-spacing%3A%200%3Bmargin%3A%200%3Bpadding%3A%200%3Bbackground%3A%20%23f1f5f9%3B%22%3E%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%20href%3D%22${resolvePathToFrontendURI(
					`/app/job/review?jobId=${jobRecord.id}`,
				)}%22%3E%3Cimg%20border%3D%220%22%20vspace%3D%220%22%20hspace%3D%220%22%20src%3D%22https%3A//i.imgur.com/i7dbaQI.png%22%20height%3D%2228%22%20alt%3D%22Logo%22%20title%3D%22Logo%22%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2010px%3B%20margin%3A%200%3B%20padding%3A%200%3B%20outline%3A%20none%3B%20text-decoration%3A%20none%3B%20-ms-interpolation-mode%3A%20bicubic%3B%20border%3A%20none%3B%20display%3A%20block%3B%22%3E%3C/a%3E%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%20%20%3C/table%3E%0A%20%20%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20width%3D%22500%22%20style%3D%22%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20width%3A%20inherit%3B%20%20%20%20%20%20%20max-width%3A%20560px%3B%20%20%20%20%20%20%20background%3A%20%23fff%3B%20%20%20%20%20%20%20border-radius%3A%208px%3B%20%20%20%20%20%20%20padding%3A%2020px%200px%3B%20%20%20%20%20%20%20%22%20class%3D%22wrapper%22%3E%0A%20%20%20%20%20%20%20%20%20%3Ctbody%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20margin-top%3A%2012px%3B%20%20%20%20%20%20%20%20%20%20%20%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22hero%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%20href%3D%22https%3A//github.com/konsav/email-templates/%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/a%3E%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2024px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20bold%3B%20%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20130%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22header%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20Manual%20review%20required%20%uD83D%uDFE1%uD83D%uDFE1%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2020px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20bold%3B%20%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20130%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2016px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%232d3958%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22header%22%3E%23%20${
					jobRecord.id
				}%20-%20${escape(
					jobRecord.repo_name,
				)}%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2017px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%20%20%20%20%20%20%20%20%20%20%20%20%20line-height%3A%20160%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23242424%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22paragraph%22%3ETo%20take%20action%2C%20go%20to%20builds%20page%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20margin%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-left%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-right%3A%206.25%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%22%20class%3D%22button%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22https%3A//github.com/konsav/email-templates/%22%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20none%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20style%3D%22max-width%3A%20240px%3B%20min-width%3A%20120px%3B%20border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20padding%3A%200%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22middle%22%20style%3D%22padding%3A%2012px%2024px%3B%20margin%3A%200%3B%20text-decoration%3A%20none%3B%20font-weight%3A%20500%3B%20border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20border-radius%3A%204px%3B%20-webkit-border-radius%3A%204px%3B%20-moz-border-radius%3A%204px%3B%20-khtml-border-radius%3A%204px%3B%22%20bgcolor%3D%22%235f7aff%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20target%3D%22_blank%22%20style%3D%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20600%20%21important%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20text-decoration%3A%20none%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23FFFFFF%3B%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20font-size%3A%2017px%3B%20font-weight%3A%20400%3B%20line-height%3A%20120%25%3B%22%20href%3D%22${resolvePathToFrontendURI(
					`/app/job/review?jobId=${jobRecord.id}`,
				)}%22%3EReview%20build%3C/a%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%3C/tr%3E%3C/tbody%3E%3C/table%3E%3C/a%3E%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%20%20%3C/table%3E%0A%20%20%20%20%20%20%3Ctable%20border%3D%220%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20align%3D%22center%22%20width%3D%22500%22%20style%3D%22%20%20%20%20%20%20%20border-collapse%3A%20collapse%3B%20%20%20%20%20%20%20border-spacing%3A%200%3B%20%20%20%20%20%20%20padding%3A%200%3B%20%20%20%20%20%20%20width%3A%20inherit%3B%20%20%20%20%20%20%20max-width%3A%20560px%3B%20%20%20%20%20%20%20background%3A%20%23fff%3B%20%20%20%20%20%20%20border-radius%3A%208px%3B%20%20%20%20%20%20%20padding%3A%2020px%200px%3B%20%20%20%20%20%20%20margin-top%3A%2040px%3B%20%20%20%20%20%20%20%22%20class%3D%22wrapper%22%3E%0A%20%20%20%20%20%20%20%20%20%3Ctbody%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2020px%3B%20font-weight%3A%20bold%3B%20line-height%3A%20130%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2040px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22header%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20For%20support%2C%20feedback%20or%20help%20%u260E%uFE0F%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2015px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20I%27ll%20be%20happy%20to%20schedule%20one%20on%20one%20call%20with%20you.%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%20padding-bottom%3A%200px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2017px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2015px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20Himanshu%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%20style%3D%22%20padding-bottom%3A%2040px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22left%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2014px%3B%20font-weight%3A%20400%3B%20line-height%3A%20160%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23000000%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2040px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22paragraph%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20+91-7296823551%20%3Cbr%3E%20himanshu@crusher.dev%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%20%20%20%0A%20%20%20%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%20%20%3C/table%3E%0A%20%20%20%20%20%20%3Ctable%20width%3D%22550%22%20align%3D%22center%22%3E%0A%20%20%20%20%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2030px%3B%22%20class%3D%22line%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Chr%20color%3D%22%23b6bbc6%22%20align%3D%22center%22%20width%3D%22100%25%22%20size%3D%221%22%20noshade%3D%22%22%20style%3D%22margin%3A%200%3B%20padding%3A%200%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%20align%3D%22center%22%20valign%3D%22top%22%20style%3D%22border-collapse%3A%20collapse%3B%20border-spacing%3A%200%3B%20margin%3A%200%3B%20padding%3A%200%3B%20padding-left%3A%206.25%25%3B%20padding-right%3A%206.25%25%3B%20width%3A%2087.5%25%3B%20font-size%3A%2013px%3B%20font-weight%3A%20400%3B%20line-height%3A%20150%25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-top%3A%2010px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20padding-bottom%3A%2020px%3B%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23828999%3B%20%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%22%20class%3D%22footer%22%3EYou%27re%20receiving%20this%20becuase%20you%27ve%20registered%20at%20crusher.%3Cbr%3E%20Check%20%3Ca%20href%3D%22https%3A//github.com/konsav/email-templates/%22%20target%3D%22_blank%22%20style%3D%22text-decoration%3A%20underline%3B%20color%3A%20%23828999%3B%20font-family%3A%20%27DM%20Sans%27%2Csans-serif%3B%20font-size%3A%2013px%3B%20font-weight%3A%20400%3B%20line-height%3A%20150%25%3B%22%3Esubscription%20settings%3C/a%3E.%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%0A%20%20%20%20%20%20%20%20%20%3C/tbody%3E%0A%20%20%20%20%20%20%3C/table%3E%0A%20%20%20%3C/body%3E%0A%3C/html%3E
                `,
			),
		);
	}
}

async function notifyResultWithSlackIntegrations(jobRecord: any, result: JobReportStatus, userWhoStartedTheJob: iUser, state) {
	const slackIntegrationsArr = await alertingService.getSlackIntegrationsInProject(jobRecord.project_id);

	for (let i = 0; i < slackIntegrationsArr.length; i++) {
		await AlertingManager.sendSlackMessage(
			slackIntegrationsArr[i].webhook_url,
			jobRecord,
			userWhoStartedTheJob,
			{
				passed: state.passedTestsArray.length,
				failed: state.failedTestsArray.length,
				review: state.markedForReviewTestsArray.length,
			},
			state.failedTestsArray,
			result,
		);
	}
}

async function notifyResultToGithubChecks(jobRecord: any, result: JobReportStatus, userWhoStartedTheJob: iUser) {
	await updateGithubCheckStatus(
		GithubCheckStatus.COMPLETED,
		{
			fullRepoName: jobRecord.repo_name,
			githubCheckRunId: jobRecord.check_run_id,
			githubInstallationId: jobRecord.installation_id,
		},
		result === JobReportStatus.PASSED ? GithubConclusion.SUCCESS : GithubConclusion.FAILURE,
	);
}

async function handlePostChecksOperations(reportId: number, totalTestCount, jobId: number) {
	const jobRecord = await jobsService.getJob(jobId);
	const userWhoStartedThisJob = await userService.getUserInfo(jobRecord.user_id);
	let jobConclusion = JobReportStatus.FAILED;

	const allResultSets = await testInstanceResultSetsService.getResultSets(reportId);
	const state = {
		passedTestsArray: [],
		failedTestsArray: [],
		markedForReviewTestsArray: [],
	};
	allResultSets.map((resultSet) => {
		const { conclusion } = resultSet;
		if (conclusion === TestInstanceResultSetConclusion.PASSED) {
			state.passedTestsArray.push(resultSet);
		} else if (conclusion === TestInstanceResultSetConclusion.FAILED) {
			state.failedTestsArray.push(resultSet);
		} else {
			state.markedForReviewTestsArray.push(resultSet);
		}
	});

	let explanation = "";
	if (state.passedTestsArray.length === totalTestCount) {
		jobConclusion = JobReportStatus.PASSED;
		explanation = "All tests passed with visual checks";
	} else if (state.failedTestsArray.length) {
		jobConclusion = JobReportStatus.FAILED;
		explanation = "There are some failed tests in this build";
	} else if (!state.failedTestsArray.length && state.markedForReviewTestsArray.length) {
		jobConclusion = JobReportStatus.MANUAL_REVIEW_REQUIRED;
		explanation = "No tests failed, but some of them requires manual review";
	}

	await jobsReportService.updateJobReportStatus(jobConclusion, reportId, explanation);

	await notifyResultToGithubChecks(jobRecord, jobConclusion, userWhoStartedThisJob);
	await notifyResultWithEmail(jobRecord, jobConclusion, userWhoStartedThisJob);
	await notifyResultWithSlackIntegrations(jobRecord, jobConclusion, userWhoStartedThisJob, state);
}

async function runChecks(details, clearJobTempValues) {
	const { githubInstallationId, githubCheckRunId, platform, reportId, totalTestCount, screenshots, testId, jobId, instanceId, fullRepoName } = details;

	const currentJobReport = await jobsReportService.getJobReport(reportId);

	const testInstance = await testInstanceService.getTestInstance(instanceId);
	const referenceInstance = await getReferenceInstance(currentJobReport.reference_job_id, testId, platform);
	const shouldPerformDiffChecks = jobId !== currentJobReport.reference_job_id;

	// Create result set for this config
	const { insertId: resultSetId } = await testInstanceResultSetsService.createResultSet({
		instance_id: instanceId,
		target_instance_id: referenceInstance ? referenceInstance.id : instanceId,
		report_id: reportId,
		status: TestInstanceResultSetStatus.RUNNING_CHECKS,
	});

	const testInstanceWithImages = await getOrganisedTestInstanceWithImages(testInstance);
	const referenceInstanceWithImages = await getOrganisedTestInstanceWithImages(referenceInstance);

	const { didAllImagesPass, passedImagesCount, manualReviewImagesCount, failedImagesCount } = await getResultForTestInstance(
		testInstanceWithImages,
		referenceInstanceWithImages,
		resultSetId,
		shouldPerformDiffChecks,
	);

	await testInstanceResultSetsService.updateResultSetStatus(resultSetId);
}

module.exports = async (bullJob: Job) => {
	const reddisClient = new IORedis({
		port: REDDIS.port,
		host: REDDIS.host,
		password: REDDIS.password,
	});

	const reddisLock = new ReddisLock([reddisClient], {
		driftFactor: 0.01,
		retryCount: -1,
		retryDelay: 150,
		retryJitter: 200,
	});

	const {
		githubInstallationId,
		githubCheckRunId,
		testCount: totalTestCount,
		images: screenshots,
		testId,
		jobId,
		instanceId,
		reportId,
		fullRepoName,
		platform,
	} = bullJob.data;

	async function clearJobTempValues(jobId) {
		await reddisClient.multi().del(`${jobId}:started`).del(`${jobId}:completed`).exec();
	}

	try {
		await testInstanceService.updateTestInstanceStatus(InstanceStatus.FINISHED, instanceId);

		reddisLock.lock(`${jobId}:completed:lock1`, 15000).then(async function (lock) {
			await reddisClient.incr(`${jobId}:completed`);
			const completedTestsCount = parseInt(await reddisClient.get(`${jobId}:completed`));

			await runChecks(
				{
					githubInstallationId,
					githubCheckRunId,
					totalTestCount,
					screenshots,
					testId,
					jobId,
					instanceId,
					reportId,
					fullRepoName,
					platform,
				},
				clearJobTempValues,
			);

			if (completedTestsCount === totalTestCount) {
				const job = await jobsService.getJob(jobId);
				if (job.status !== JobStatus.ABORTED) {
					await jobsService.updateJobStatus(JobStatus.FINISHED, jobId);
				}
				await clearJobTempValues(jobId);
				await handlePostChecksOperations(reportId, totalTestCount, jobId);
			}

			try {
				return lock.unlock();
			} catch (ex) {
				console.error(ex);
				return true;
			}
		});
	} catch (Ex) {
		console.error(Ex);
	}
};
