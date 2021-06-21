import React from "react";
import { css } from "@emotion/core";
import { iUserConnection } from "@crusher-shared/types/mongo/userConnection";
import { PIXEL_REM_RATIO } from "@constants/other";
import { USER_CONNECTION_TYPE } from "@crusher-shared/types/userConnectionType";
import { iGithubUserConnection } from "@crusher-shared/types/mongo/githubUserConnection";
import * as url from "url";
import GithubIcon from "../../../svg/github.svg";
import DeleteIcon from "../../../../public/svg/settings/delete.svg";
import { getDiffInDays } from "@utils/helpers";
import { _removeUserLoginConnection } from "@services/user";
import { store } from "@redux/store";
import { deleteUserConnection } from "@redux/actions/user";

interface iUserConnectionItemProps {
	item: iUserConnection;
	onDelete: (id: string) => void;
}

const getUserConnectionDesc = (userConnection: iUserConnection): any => {
	if (userConnection.service === USER_CONNECTION_TYPE.GITHUB) {
        const {
            userName,
            loginName
        } = (userConnection as iGithubUserConnection).meta;

        return (
			<span css={userConnectionDescCSS}>
				{userName} (<a href={url.resolve("https://github.com/", loginName)}>@{loginName}</a>)
			</span>
		);
    }
	return null;
};

const userConnectionDescCSS = css`
	color: rgb(102, 102, 102);
	a {
		color: rgb(0, 112, 243);
	}
`;
const getGithubIcon = (userConnection: iUserConnection): any => {
	if (userConnection.service === USER_CONNECTION_TYPE.GITHUB) {
		return <GithubIcon />;
	}
	return null;
};

const getUserConnectionServiceName = (userConnection: iUserConnection) => {
	if (userConnection.service === USER_CONNECTION_TYPE.GITHUB) {
		return "GitHub";
	}

	return null;
};
const UserConnectionItem = (props: iUserConnectionItemProps) => {
	const { item, onDelete } = props;

	const handleOnDelete = () => {
		onDelete(item.id);
	};

	return (
		<li css={connectionItemCSS}>
			<div css={connectionIconCSS}>{getGithubIcon(item)}</div>
			<div css={connectionInfoCSS}>
				<div css={connectionInfoServiceNameCSS}>{getUserConnectionServiceName(item)}</div>
				<div>{getUserConnectionDesc(item)}</div>
			</div>
			<div css={userConnectedTimeCSS}>Connected {getDiffInDays(new Date(item.createdAt), new Date())}d ago</div>
			<div css={userConnectionDeleteCSS} onClick={handleOnDelete}>
				<DeleteIcon />
			</div>
		</li>
	);
};

const userConnectionDeleteCSS = css`
	display: flex;
	align-items: center;
	margin-left: ${20 / PIXEL_REM_RATIO}rem;
	cursor: pointer;
`;
const userConnectedTimeCSS = css`
	color: rgb(102, 102, 102);
	display: flex;
	align-items: center;
	font-weight: 400;
	margin-left: ${16 / PIXEL_REM_RATIO}rem;
`;

const connectionInfoServiceNameCSS = css`
	font-weight: 600;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
`;
const connectionInfoCSS = css`
	flex: 1;
	margin-left: ${16 / PIXEL_REM_RATIO}rem;
`;
const connectionIconCSS = css`
	display: flex;
	align-items: center;
`;
const connectionItemCSS = css`
	display: flex;
	border: 1px solid #eaeaea;
	border-radius: ${6 / PIXEL_REM_RATIO}rem;
	padding: ${16 / PIXEL_REM_RATIO}rem;
`;

interface iUserConnectionsListProps {
	items: iUserConnection[];
}

const UserConnectionsList = (props: iUserConnectionsListProps) => {
	const { items } = props;

	const handleDeleteUserConnection = (connectionId: string) => {
		_removeUserLoginConnection(connectionId).then(() => {
			store.dispatch(deleteUserConnection(connectionId));
		});
	};

	const out = items.map((item) => {
		return <UserConnectionItem key={item.id} onDelete={handleDeleteUserConnection} item={item} />;
	});
	return <ul css={containerCSS}>{out}</ul>;
};

const containerCSS = css`
	font-family: Gilroy;
	font-weight: 400;
`;
export { UserConnectionsList };
