export type TSentryTracking = {
	trackPage: () => void,
	trackEvent: () => void,
	trackCustomEvent: () => void,
	addUserToGroup: () => void,
	addUserInfo: () => void,
	addGroupInfo: () => void
}