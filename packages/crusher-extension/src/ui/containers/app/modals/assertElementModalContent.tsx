import React from "react";
import { useSelector } from "react-redux";
import { getActionsRecordingState } from "../../../../redux/selectors/recorder";
import { iElementInfo } from "../../../../interfaces/recorderReducer";

const AssertElementModalContent = () => {
	const recordingState = useSelector(getActionsRecordingState);
	const elementInfo: iElementInfo = recordingState.elementInfo as iElementInfo;
	const attributes = elementInfo.attributes;

	return <table style={containerStyle}>{JSON.stringify(attributes)}</table>;
};

const containerStyle = {};

export { AssertElementModalContent };
