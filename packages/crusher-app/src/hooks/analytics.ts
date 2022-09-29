import { useRouter } from "next/router";
import { useEffect } from "react";

import { Analytics } from "../utils/core/analytics";
export const usePageSegmentAnalytics = () => {
    const { pathname } = useRouter();
    useEffect(() => {
		Analytics.trackPage();
	}, [pathname]);
};
