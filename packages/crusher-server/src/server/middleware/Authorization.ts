import "reflect-metadata";

import { Action } from "routing-controllers";
import { clearAuthCookies, decodeToken } from "@utils/auth";
import * as cookie from "cookie";
import Container from "typedi";
import { UsersService } from "@modules/resources/users/service";
import { UserProjectRolesService } from "@modules/resources/users/roles/project/service";
import { Request } from "express";
import { TeamsService } from "@modules/resources/teams/service";

export const API_ROLES = [
	"project"
];

const teamsService = Container.get(TeamsService);

export function authorization(expressApp) {
	return async (action: Action, roles: string[]) => {
		if (action.request.headers.method === "OPTIONS") {
			action.response.status(200);
			action.response.end();
		}
		try {
			const cookies = action.request.headers.cookie ? cookie.parse(action.request.headers.cookie) : {};
			const userToken = action.request.headers['authorization'] || cookies.token;
			const user = decodeToken(userToken);
			if (!user) {
				clearAuthCookies(action.response);
				return false;
			}

			if(action.request.params["project_id"]) {
				const userCanAccessProject = await teamsService.hasProject(action.request.params["project_id"], user.team_id);
				if(!userCanAccessProject) return false;
				return user;
			}
			return user;
		} catch (error) {
			clearAuthCookies(action.response);
			return false;
		}
	};
}

export function getCurrentUserChecker(expressApp) {
	return async (action: Action) => {
		if (action.request.headers.method === "OPTIONS") {
			action.response.status(200);
			action.response.end();
		}

		try {
			const cookies = action.request.headers.cookie ? cookie.parse(action.request.headers.cookie) : {};
			const userToken = action.request.headers['authorization'] || cookies.token;
			if(userToken) {
				const decoded = decodeToken(userToken);
				if(!decoded["user_id"]) return false;
				return decodeToken(userToken);
			}
		} catch (error) {}
		return false;
	};
}
