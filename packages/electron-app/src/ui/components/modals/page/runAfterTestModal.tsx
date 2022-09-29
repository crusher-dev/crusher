import React from "react";
import { ModalTopBar } from "../topBar";
import { Modal } from "@dyson/components/molecules/Modal";
import { css } from "@emotion/react";
import { Button } from "@dyson/components/atoms/button/Button";
import { useDispatch } from "react-redux";
import { getUserTests, performRunAfterTest } from "electron-app/src/ui/commands/perform";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { iAction } from "@shared/types/action";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { sendSnackBarEvent } from "../../toast";

interface iStartupModalProps {
	isOpen: boolean;
	handleClose: () => void;

	stepIndex?: number;
	stepAction?: iAction;
}
const DropdownOption = ({ label }) => {
	return <div css={{ padding: "7rem 8rem", width: "100%", cursor: "default" }}>{label}</div>;
};
const RunAfterTestModal = (props: iStartupModalProps) => {
    const { isOpen } = props;
    const [testId, setTestId] = React.useState("");
    const [userTests, setUserTests] = React.useState([]);

    const dispatch = useDispatch();

    React.useEffect(() => {
		if (props.stepAction && isOpen) {
			setTestId(props.stepAction.payload.meta.value);
		}
	}, [isOpen, props.stepAction]);

    const saveAction = () => {
		if (testId && testId !== "") {
			performRunAfterTest(testId);
			props.handleClose();
		}
	};

    const updateAction = () => {
		if (testId && testId !== "") {
			props.stepAction.payload.meta.value = testId;
			dispatch(updateRecordedStep(props.stepAction, props.stepIndex));
			sendSnackBarEvent({ type: "success", message: "Action updated" });
			props.handleClose();
		}
	};

    React.useEffect(() => {
		if (isOpen) {
			getUserTests().then((tests) => {
				setUserTests(tests.list);
			});
		}
	}, [isOpen]);

    if (!isOpen) return null;

    const handleRunAfterTestInput = (selected) => {
		setTestId(selected[0]);
	};

    const transformListToSelectBoxValues = (list: any[]) => {
		return list.map((test) => ({
			value: test.id,
			label: test.testName,
			component: <DropdownOption label={test.testName} />,
		}));
	};

    const getSelectedOption = (list: any[], testId: string) => {
		return transformListToSelectBoxValues(list).filter((test) => test.value === testId);
	};

    return (
		<Modal id="current-modal" modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar title={"Run after test"} desc={"Runs test in the same browser context as specified"} closeModal={props.handleClose} />
			<div
				css={formContainerStyle}
				css={css`
					display: flex;
					padding: 26rem 34rem;
				`}
			>
				<div style={inputContainerStyle}>
					<SelectBox
						isSearchable={true}
						dropDownHeight={"auto"}
						css={css`
							font-family: Gilroy;
							input {
								outline: none;
								width: 80%;
							}
							.selectBox {
								height: 34rem;
							}
							.select-dropDownContainer {
								max-height: 200rem;
								overflow-y: scroll;
								::-webkit-scrollbar {
									background: transparent;
									width: 8rem;
								}
								::-webkit-scrollbar-thumb {
									background: white;
									border-radius: 14rem;
								}
							}
							.selectBox__value {
								margin-right: 10rem;
								font-size: 13rem;
							}
							width: 250rem;
							.dropdown-box .dropdown-label {
								padding-top: 4rem !important;
								padding-bottom: 4rem !important;
							}
						`}
						placeholder={"Select a base test"}
						size={"large"}
						selected={getSelectedOption(userTests, testId)}
						values={transformListToSelectBoxValues(userTests)}
						callback={handleRunAfterTestInput}
					/>
				</div>
				<div css={submitFormContainerStyle}>
					<Button onClick={props.stepAction ? updateAction : saveAction} css={buttonStyle}>
						{props.stepAction ? "Update" : "Run"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

const formContainerStyle = css`
	margin-top: 3.375rem;
`;
const submitFormContainerStyle = css`
	display: flex;
	width: 100%;
	margin-top: 2.25rem;
`;
const modalStyle = css`
	width: 700rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem !important;
	min-height: 214rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
`;

const buttonStyle = css`
	font-size: 13rem;
	border: 1px solid rgba(255, 255, 255, 0.23);
	box-sizing: border-box;
	border-radius: 4rem;
	width: 93rem;
	height: 34rem;
	margin-left: 20rem;
`;
const inputContainerStyle = {
	display: "flex",
	fontFamily: "DM Sans",
	alignItems: "center",
	color: "#fff",
};

export { RunAfterTestModal };
