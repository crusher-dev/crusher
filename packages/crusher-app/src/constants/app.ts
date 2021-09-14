export type TOSDownloadInfo = {
	downloadLink: string;
	icon: string | null;
	label?: string;
};

export const OS_INFO: Record<string, TOSDownloadInfo> = {
	Windows: { downloadLink: "", icon: null, label: "Download exe" },
	MAC: { downloadLink: "https://github.com/crusherdev/crusher-downloads/blob/master/v1/crusher-recorder.dmg?raw=true", icon: null, label: "Download dmg" },
	OTHER: { downloadLink: "", icon: null },
};

export const LINUX_INFO: Record<string, TOSDownloadInfo> = {
	Linux_DEB: {
		downloadLink: "https://github.com/crusherdev/crusher-downloads/blob/master/v1/crusher-recorder.deb?raw=true",
		icon: null,
		label: "Download deb",
	},
};

export enum OS {
	Windows = "Windows",
	MAC = "MAC",
	Linux = "Linux",
	OTHER = "OTHER",
}
