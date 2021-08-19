import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { tempTestAtom } from "../store/atoms/global/tempTestId";

export const useSaveTemp = () => {
	const router = useRouter();
	const [, setTempTest] = useAtom(tempTestAtom);
	const { asPath } = router;

	const queryString = asPath.split("?")?.[1];
	const urlQuery = new URLSearchParams(queryString);
	useEffect(() => {
		if (!urlQuery) return;
		const tempTestId = urlQuery.get("temp_test_id");
		setTempTest(tempTestId);
	}, []);
};
