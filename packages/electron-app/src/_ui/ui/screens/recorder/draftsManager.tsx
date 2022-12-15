import axios from "axios";
import { getAllSteps, getRecorderContext } from "electron-app/src/store/selectors/recorder";
import { useStore } from "react-redux";
import { updateDraftTest } from "electron-app/src/api/tests/draft.tests";
import { useEffect } from "react";

export const DraftsManager = () => {
    const store = useStore();

    const handleDraftInterval = async () => {
		// Auto save
		const allSteps = getAllSteps(store.getState() as any);
		const recorderContext = getRecorderContext(store.getState() as any);

		if (allSteps.length && recorderContext.draftId) {
			console.log("Auto saving now...");
			await axios(updateDraftTest({ events: allSteps as any }, recorderContext.draftId!));
			console.log("Auto saved");
		}
	};

    useEffect(() => {
        const draftInterval = setInterval(handleDraftInterval, 10000);

        return () => {
            clearInterval(draftInterval);
        }
    }, []);

    return null;
}