import { Inject, Service } from 'typedi';
import { Authorized, CurrentUser, Get, Put, Post, Patch, JsonController, Param, Res } from 'routing-controllers';

@Service()
@JsonController('/v2/job/report')
export class JobsControllerV2 {
	@Post("/")
	async createJobReport(){

	}

	@Get("/")
	async getJobReport(){

	}
}
