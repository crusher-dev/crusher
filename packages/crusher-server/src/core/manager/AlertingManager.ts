import { fetch } from '../utils/fetch';
import { User } from '../interfaces/db/User';
import { resolvePathToFrontendURI } from '../utils/uri';
import { JobBuild } from '../interfaces/db/JobBuild';

const JOB_STATUS_ICONS = {
	PASSED: 'https://i.imgur.com/gqTSPBm.png',
	FAILED: 'https://i.imgur.com/gqTSPBm.png',
};

export default class AlertingManager {
	constructor() {}

	public static sendSlackMessage(webhook_url: string, jobRecord: JobBuild, user: User, countRecords: any, failedTestsList: any, status) {
		function renderFailedTestIfThere() {
			const out = failedTestsList.map((test) => {
				return {
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*${test.test_name}*\n ${test.platform} browsers`,
					},
					accessory: {
						type: 'button',
						text: {
							type: 'plain_text',
							emoji: true,
							text: 'View Debug Log',
						},
						url: resolvePathToFrontendURI(`/app/job/review?jobId=${jobRecord.id}`),
						value: 'click_me_123',
					},
				};
			});

			if (out.length === 0) return [];

			return [
				{
					type: 'divider',
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: '*Failed Tests:*',
					},
				},
				...out.slice(0, 3),
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*<|Load more test>*`,
					},
				},
			];
		}

		return fetch(webhook_url, {
			method: 'POST',
			noJSON: true,
			payload: {
				blocks: [
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: ' *E2E Test result by crusher :hammer:*',
						},
						accessory: {
							type: 'button',
							text: {
								type: 'plain_text',
								emoji: true,
								text: 'View Report',
							},
							url: resolvePathToFrontendURI(`/app/job/review?jobId=${jobRecord.id}`),
							value: 'click_me_123',
						},
					},
					{
						type: 'divider',
					},
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: `*<${resolvePathToFrontendURI(`/app/job/review?jobId=${jobRecord.id}`)}| Build ID : ${jobRecord.id}>*\n Branch - ${
								jobRecord.branch_name
							}\n Code run on Travis by ${user.first_name}\n ${new Date(jobRecord.created_at).toTimeString()}`,
						},
						accessory: {
							type: 'image',
							image_url: status === 'PASSED' ? JOB_STATUS_ICONS.PASSED : JOB_STATUS_ICONS.FAILED,
							alt_text: 'calendar thumbnail',
						},
					},
					{
						type: 'divider',
					},
					{
						type: 'context',
						elements: [
							{
								type: 'image',
								image_url: 'https://i.imgur.com/lWCSttN.png',
								alt_text: 'notifications warning icon',
							},
							{
								type: 'mrkdwn',
								text: `*Failed *: ${countRecords.failed} Test`,
							},
							{
								type: 'image',
								image_url: 'https://i.imgur.com/gruzdJ8.png',
								alt_text: 'notifications warning icon',
							},
							{
								type: 'mrkdwn',
								text: `*Review:* ${countRecords.review} Test`,
							},
							{
								type: 'image',
								image_url: 'https://i.imgur.com/gqTSPBm.png',
								alt_text: 'notifications warning icon',
							},
							{
								type: 'mrkdwn',
								text: `*Passed:* ${countRecords.passed} Test`,
							},
						],
					},
					...renderFailedTestIfThere(),
					{
						type: 'divider',
					},
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: '*Take action:*',
						},
					},
					{
						type: 'actions',
						elements: [
							{
								type: 'button',
								text: {
									type: 'plain_text',
									emoji: true,
									text: 'Approve',
								},
								style: 'primary',
								value: 'click_me_123',
							},
							{
								type: 'button',
								text: {
									type: 'plain_text',
									emoji: true,
									text: 'Deny',
								},
								style: 'danger',
								value: 'click_me_123',
							},
						],
					},
					{
						type: 'divider',
					},
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: '*Crusher* saved you 1 hours of manual testing :smile: \n On typical, we catch 95% more issues. ',
						},
					},
				],
			},
		});
	}
}
