export interface RunTestRequestBody {
	id: number;
	testType: 'DRAFT' | 'SAVED';
	name: string;
	code: string;
	events?: string;
	framework: 'PLAYWRIGHT' | 'PUPPETEER' | 'SELENIUM';
}
