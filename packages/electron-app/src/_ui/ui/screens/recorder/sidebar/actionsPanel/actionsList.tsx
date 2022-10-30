import React from "react";
import { css } from "@emotion/react";
import { PlayIconV3 } from "electron-app/src/_ui/constants/old_icons";
import { getRecorderState } from "electron-app/src/store/selectors/recorder";
import { useStore } from "react-redux";
import { sendSnackBarEvent } from "electron-app/src/_ui/ui/containers/components/toast";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { Heading } from "@dyson/components/atoms/heading/Heading";
import { TextBlock } from "@dyson/components/atoms";
import { atom, useAtom } from "jotai";

interface IProps {
	title: string;
	description?: string;
	items?: { id: string; content: any }[];
	icon?: any;
	className?: string;
	callback?: any;

	defaultExpanded?: boolean;
}

const expandedAtom = atom("page")

const ActionsList = ({ className, defaultExpanded, ...props }: IProps) => {
	const { title, description, callback, icon, items } = props;

	const [expandedLabel, setExpandedLabel] = useAtom(expandedAtom)

	const isExpanded = title === expandedLabel || defaultExpanded;
	const store = useStore();

	const handleClick = React.useCallback(
		(id: any) => {
			const recorderState = getRecorderState(store.getState());
			if (recorderState.type !== TRecorderState.RECORDING_ACTIONS) {
				sendSnackBarEvent({ type: "error", message: "A action is in progress. Wait and retry again" });
				return;
			}

			callback(id);
		},
		[callback],
	);

	const itemsContent = React.useMemo(() => {
		if (!items) {
			return null;
		}
		return items.map((item) => (
			<div onClick={handleClick.bind(this, item.id)} css={actionItemCss}>
				{item.content}
			</div>
		));
	}, [items]);

	return (
		<div css={[containerCss, bottomSeperatorCss]} className={String(className)} {...props}>
			<div className={"action-item-header"} onClick={setExpandedLabel.bind(this, title)} css={[headingCss, isExpanded ? activeSectionCss : null]}>
				{icon ? <div css={headingIconCss}>{icon}</div> : ""}
				<div css={headingContentCss}>
					<TextBlock fontSize={14} weight={500}>{title}</TextBlock>

					{description ? <div css={headingDescriptionCss}>{description}</div> : ""}
				</div>
				{itemsContent ? <PlayIconV3 css={[playIconCss, isExpanded ? pointerDownCss : undefined]} /> : ""};
			</div>
			{isExpanded && itemsContent ? <div css={contentCss}>{itemsContent}</div> : ""}
		</div>
	);
};

const pointerDownCss = css`
	transform: rotate(90deg);
`;
const bottomSeperatorCss = css`
	border-bottom-width: 0.5px;
	border-bottom-style: solid;
	border-bottom-color: #1b1b1b;
`;
const containerCss = css``;

const headingCss = css`
	padding: 10rem 16rem;
	padding-right: 12rem;
	display: flex;
	:hover {
		background: rgba(85, 85, 85, 0.15);
	}
`;
const activeSectionCss = css`
	background: rgba(85, 85, 85, 0.15);
`;
const headingIconCss = css`
	margin-top: 1rem;
	margin-left: -0.5rem;
`;
const headingContentCss = css`
	margin-left: 9.5rem;
	display: flex;
	flex: 1;
	flex-direction: column;
`;
const headingTitleCss = css`
	font-weight: 500;
	font-size: 14rem;
	color: #ffffff;
`;
const headingDescriptionCss = css`
	font-weight: 400;
	font-size: 10.5rem;

	color: #a6a6a6;
	margin-top: 5rem;
	letter-spacing: .4px;
`;
const playIconCss = css`
	width: 6rem;
	height: 8rem;
	margin-left: auto;
	margin-right: 5rem;
	margin-top: 3rem;
	path {
		fill: #797979;
	}
	:hover {
		opacity: 0.8;
	}
`;
const contentCss = css`
	margin: 8rem 0rem;
	display: grid;
	grid-template-columns: auto 125rem;
	padding: 7rem 35rem;
	row-gap: 13rem;
`;

const actionItemCss = css`
	font-weight: 400;
	font-size: 12rem;
	letter-spacing: .3px;
	color: #7c7c7c;
	cursor: default;

	:hover {
		text-decoration-line: underline;

		color: #b55bff;
	}
`;

export { ActionsList };
