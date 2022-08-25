import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams, Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { RedisManager } from "@modules/redis";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "@utils/auth";

@Service()
@JsonController("")
class CLIController {
	@Inject()
	private redisManager: RedisManager;

	@Get("/cli/get.key")
	async getUniqueLoginKey() {
		const key = uuidv4() + Date.now();
		await this.redisManager.set(key, JSON.stringify({ userId: null, teamId: null }), { expiry: { type: "s", value: 60 * 60 } });
		return { loginKey: key };
	}

	@Authorized()
	@Post("/cli/actions/login.user")
	async loginUserFromLoginKey(@CurrentUser({ required: true }) user: any, @Body() body: { loginKey: string }) {
		const { loginKey } = body;
		const loginKeyRecord = await this.redisManager.get(loginKey);

		if (!loginKeyRecord) throw new BadRequestError("Invalid login key");
		await this.redisManager.set(loginKey, JSON.stringify({ userId: user.user_id, teamId: user.team_id }), { expiry: { type: "s", value: 5 * 60 } });

		return { status: "Successful" };
	}

	@Get("/cli/status.key")
	async getLoginKeyStatus(@QueryParams() params: {loginKey?: string}) {
		const { loginKey } = params;
		const loginKeyRecord = await this.redisManager.get(loginKey);
		if (!loginKeyRecord) throw new BadRequestError("Invalid login key");

		const loginKeyRecordObj = JSON.parse(loginKeyRecord);
		if (!loginKeyRecordObj.userId) return { status: "Pending" };
		return { status: "Validated", userToken: generateToken(loginKeyRecordObj.userId, loginKeyRecordObj.teamId) };
	}
}

export { CLIController };
