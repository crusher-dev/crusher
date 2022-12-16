import axios from "axios";
import { getAllSteps, getRecorderContext } from "electron-app/src/store/selectors/recorder";
import { useStore } from "react-redux";
import { updateDraftTest } from "electron-app/src/api/tests/draft.tests";
import { useEffect } from "react";
import { showToast } from "../../components/toasts";

export const DraftsManager = () => {
    const store = useStore();

    const updateDraft = async (isAutoSave = true) => {
		// Auto save
		const allSteps = getAllSteps(store.getState() as any);
		const recorderContext = getRecorderContext(store.getState() as any);
		if (allSteps.length && recorderContext.draftId) {
            if(!isAutoSave) {
                showToast({
                    type: "loading",
                    message: "Saving draft...",
                    duration: 1000
                })
            }
			await axios(updateDraftTest({ events: allSteps as any }, recorderContext.draftId!));
			console.log("Auto saved");
		}
	};

    useEffect(() => {
        const draftInterval = setInterval(updateDraft, 10000);

        const handleKeyDownListener = (e) => {
            if (e.key === "s" && e.ctrlKey) {
                e.preventDefault();
                updateDraft(false);
            }
        }
         
        window.addEventListener("keypress", handleKeyDownListener, false);
        

        return () => {
            clearInterval(draftInterval);
            window.removeEventListener("keypress", handleKeyDownListener, false);
        }
    }, []);

    return null;
}