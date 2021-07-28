export type TOSDownloadInfo = {
	downloadLink: string;
	icon: string | null;
	label?: string;
};

export const OS_INFO: Record<string, TOSDownloadInfo> = {
	Windows: { downloadLink: "https://google.com", icon: null },
	MAC: { downloadLink: "https://google.com", icon: null },

	Linux: { downloadLink: "https://google.com", icon: null, label: "Download dmg" },
	OTHER: { downloadLink: "https://google.com", icon: null },
};

export const LINUX_INFO: Record<string, TOSDownloadInfo> = {
	Linux_ZIP: { downloadLink: "https://google.com", icon: null, label: "Download zip" },
	Linux_DEB: { downloadLink: "https://google.com", icon: null, label: "Download deb" },
};

export enum OS {
	Windows = "Windows",
	MAC = "MAC",
	Linux = "Linux",
	OTHER = "OTHER",
}
