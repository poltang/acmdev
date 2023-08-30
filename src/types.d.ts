type Env = {
	DB: D1Database;
};

type ACMDomain =
	| 'EMO'
	| 'SELF'
	| 'COG'
	| 'CREA'
	| 'STRAT'
	| 'NORM'
	| 'COM'
	| 'SOC'
	| 'LEAD'
	| 'TASK'
	| 'DEV'
	| 'CUST'
	| 'CHG'
	| 'PRO';

type ElementType =
	| 'generic'
	| 'specific'
	| 'gpq'
	| 'g-mate'
	| 'g-gate';

type ACMElement = {
	id: number,
	domain: string,
	type: string,
	tool: string,
	name: string,
	definition?: string,
	created?: string,
	updated?: string,
}

type ACMEvidence = {
	id: number,
	element_id: number,
	name: string,
	definition: string,
	created?: string,
	updated?: string,
}

type CompetenceBook = {
	id: string;
	title: string;
	type: string;
	levels: number;
	created?: string;
	updated?: string;
}

type Competence = {
	id: string;
	book_id: string;
	name: string;
	definition: string;
	created?: string;
	updated?: string;
}

type Aspect = {
	id: string;
	competence_id: string;
	name: string;
	created?: string;
	updated?: string;
}

type AspectElement = {
	id: number;
	aspect_id: string;
	element_id: string;
	name: string;
}

type CompetenceIndicator = {
	id: number;
	competence_id: string;
	name: string;
	created?: string;
	updated?: string;
}

type CompetenceLevel = {
	id: string;
	competence_id: string;
	level: number;
	name: string;
	definition: string;
	created?: string;
	updated?: string;
}
