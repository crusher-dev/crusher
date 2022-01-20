import { useRouter } from "next/router";
import { useEffect } from "react";

import { Analytics } from "../utils/core/analytics";
export const usePageSegmentAnalytics = () => {
	const router = useRouter();
	const { pathname } = router;
	useEffect(() => {
		Analytics.trackPage();
	}, [pathname]);
};
