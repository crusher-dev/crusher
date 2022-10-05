import { useBuildReport } from "@store/serverState/buildReports";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { selectedTestAtom } from "./atoms";

export const useBasicTestData = () => {
    const { query } = useRouter();
    const { data } = useBuildReport(query.id);
    const [selectedTest,] = useAtom(selectedTestAtom);

    const testData = data.tests[selectedTest]

    return { testData }
}