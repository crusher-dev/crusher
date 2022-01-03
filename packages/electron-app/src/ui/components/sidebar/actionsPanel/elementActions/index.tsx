import React from "react";
import {css} from "@emotion/react";
import { ActionsList, ActionsListItem } from "../actionsList";
import { Text } from "@dyson/components/atoms/text/Text";
import { useSelector, useStore } from "react-redux";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";
import { peformTakeElementScreenshot, performClick, performHover } from "electron-app/src/ui/commands/perform";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { AssertElementModal } from "./assertElementModal";

export enum TElementActionsEnum {
    CLICK = "CLICK",
    HOVER = "HOVER",
    SCREENSHOT = "SCREENSHOT",
    SHOW_ASSERT_MODAL = "SHOW_ASSERT_MODAL",
    SHOW_CUSTOM_SCRIPT_MODAL = "SHOW_CUSTOM_SCRIPT_MODAL"
};

const elementActionsList = [
	{
		id: TElementActionsEnum.CLICK,
		title: "Click"
	},
	{
		id: TElementActionsEnum.HOVER,
		title: "Hover"
	},
	{
		id: TElementActionsEnum.SCREENSHOT,
		title: "Screenshot",
	},
	{
		id: TElementActionsEnum.SHOW_ASSERT_MODAL,
		title: "Add Checks",
	},
	// {
	// 	id: TElementActionsEnum.SHOW_CUSTOM_SCRIPT_MODAL,
	// 	title: "Code",
	// },
];

const ElementActions = ({className, ...props}: {className?: any}) => {
	const selectedElement = useSelector(getSelectedElement);
	const store = useStore();

	const [currentModal, setCurrentModal] = React.useState(null);

    const handleActionSelected = (id: TElementActionsEnum) => {
		switch(id) {
			case TElementActionsEnum.CLICK:
				performClick(selectedElement);
				store.dispatch(setSelectedElement(null));
				break;
			case TElementActionsEnum.HOVER:
				performHover(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
			case TElementActionsEnum.SCREENSHOT:
				peformTakeElementScreenshot(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
			case TElementActionsEnum.SHOW_ASSERT_MODAL:
				setCurrentModal(TElementActionsEnum.SHOW_ASSERT_MODAL);
				break;
			case TElementActionsEnum.SHOW_CUSTOM_SCRIPT_MODAL:
				setCurrentModal(TElementActionsEnum.SHOW_ASSERT_MODAL);
				break;
		}
    };

	const items = elementActionsList.filter(e => ![TElementActionsEnum.CLICK, TElementActionsEnum.HOVER].includes(e.id)).map((action) => {
		return <ActionsListItem key={action.id} onClick={handleActionSelected.bind(this, action.id)}>{action.title}</ActionsListItem>;
	});

	const closeModal = (completed?: boolean) => {
		setCurrentModal(null);
	}

    return (
        <ActionsList className={`${className}`} css={containerStyle}>
            <div css={actionTabStyle}>
                <Text css={[clickActionStyle, hoverTextStyle]} onClick={handleActionSelected.bind(this, TElementActionsEnum.CLICK)}>
                    Click
                </Text>
                <Text css={hoverTextStyle} onClick={handleActionSelected.bind(this, TElementActionsEnum.HOVER)}>
                    Hover
                </Text>
			</div>
            <>
                {items}
            </>

			<AssertElementModal isOpen={currentModal === TElementActionsEnum.SHOW_ASSERT_MODAL} handleClose={closeModal}  />

        </ActionsList>
    )
};


const containerStyle = css``;
const actionTabStyle = css`
    display: flex;
    justify-content: stretch;
`;

const clickActionStyle = css`
    border-right-style: solid;
    border-right-color: #323636;
    border-right-width: 1rem;
`;

const hoverTextStyle = css`
	padding: 8rem 4rem;
	font-family: Gilroy;
	font-size: 13rem;
	text-align: center;
	flex: 1;

	:hover {
		background-color: #32363678;
	}
`;

export { ElementActions };