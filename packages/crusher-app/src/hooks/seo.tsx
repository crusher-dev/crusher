import { useEffect } from "react";

export const usePageTitle = (title: string) => {
	useEffect(() => {
		requestAnimationFrame(() => {
			document.title = `${title} | Crusher`;
		});
	}, [title]);
};

export const useBasicSEO = ({ favicon }: { favicon: string }) => {
	useEffect(() => {
		let link = document.querySelector("link[rel~='icon']");
		if (!link) {
			link = document.createElement("link");
			// @ts-ignore
			link["rel"] = "icon";
			document.getElementsByTagName("head")[0].appendChild(link);
		}
		// @ts-ignore
		link.href = favicon;
	}, [favicon]);
};
