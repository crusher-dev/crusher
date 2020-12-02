import { Service, Container } from 'typedi';
import DBManager from '../../manager/DBManager';

@Service()
export default class JobReportServiceV2 {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createJobReport(jobId: number, referenceJobId: number, projectId: number){
			return this.dbManager.insertData(`INSERT INTO job_reports SET ?`, { job_id: jobId, reference_job_id: referenceJobId, project_id: projectId });
	}

	async getAllJobReportsInProject(projectId: number){
			return this.dbManager.fetchData(`SELECT * FROM job_reports WHERE project_id = ? ORDER BY created_at DESC`, [projectId]);
	}

	async getJobReport(reportId: number){
			return this.dbManager.fetchSingleRow(`SELECT * FROM id = ?`, [reportId]);
	}
}
