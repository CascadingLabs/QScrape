export interface DeedRecord {
	fileNum: string;
	index: IndexType;
	recordDate: string;
	sat: boolean;
	lastFirm: string;
	first: string;
	amount: string;
	status: StatusType;
}

export type IndexType =
	| 'AFF'
	| 'ASGN'
	| 'DEED'
	| 'ESMT'
	| 'LIEN'
	| 'MTG'
	| 'NTC'
	| 'REL';
export type StatusType = 'RECORDED' | 'SATISFIED' | 'DELINQUENT';

export const indexLabels: Record<IndexType, string> = {
	AFF: 'Affidavit',
	ASGN: 'Assignment',
	DEED: 'Deed',
	ESMT: 'Easement',
	LIEN: 'Lien',
	MTG: 'Mortgage',
	NTC: 'Notice',
	REL: 'Release',
};

export const indexTypes: IndexType[] = [
	'AFF',
	'ASGN',
	'DEED',
	'ESMT',
	'LIEN',
	'MTG',
	'NTC',
	'REL',
];

export const deeds: DeedRecord[] = [
	{
		fileNum: '26-008492',
		index: 'DEED',
		recordDate: '10/15/2026',
		sat: false,
		lastFirm: 'ARMOK HOLDINGS LLC',
		first: '',
		amount: '15.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-009104',
		index: 'MTG',
		recordDate: '11/02/2026',
		sat: true,
		lastFirm: 'MCMINER',
		first: 'URIST',
		amount: '50.00 CC',
		status: 'SATISFIED',
	},
	{
		fileNum: '26-010033',
		index: 'LIEN',
		recordDate: '12/01/2026',
		sat: false,
		lastFirm: 'BOATMURDERED TRUST',
		first: '',
		amount: '9,999.99 GS',
		status: 'DELINQUENT',
	},
	{
		fileNum: '26-010241',
		index: 'DEED',
		recordDate: '12/10/2026',
		sat: false,
		lastFirm: 'KOGANUSAN ESTATES LLC',
		first: '',
		amount: '250.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-010502',
		index: 'MTG',
		recordDate: '12/22/2026',
		sat: false,
		lastFirm: 'DOREN',
		first: 'MENG',
		amount: '1,200.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-010618',
		index: 'ESMT',
		recordDate: '01/08/2027',
		sat: false,
		lastFirm: 'STEELTHUNDER CLAN',
		first: '',
		amount: '75.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-010744',
		index: 'REL',
		recordDate: '01/15/2027',
		sat: true,
		lastFirm: 'HEADSHOOTS LLC',
		first: '',
		amount: '0.00 GS',
		status: 'SATISFIED',
	},
	{
		fileNum: '26-010831',
		index: 'ASGN',
		recordDate: '01/28/2027',
		sat: false,
		lastFirm: 'IRONHAND',
		first: 'AVAR',
		amount: '500.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-010999',
		index: 'LIEN',
		recordDate: '02/03/2027',
		sat: false,
		lastFirm: 'FUNGIWOOD TRUST',
		first: '',
		amount: '3,400.50 GS',
		status: 'DELINQUENT',
	},
	{
		fileNum: '26-011102',
		index: 'DEED',
		recordDate: '02/14/2027',
		sat: false,
		lastFirm: 'SPEARBREAKER',
		first: 'MOLDATH',
		amount: '800.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-011287',
		index: 'MTG',
		recordDate: '02/20/2027',
		sat: true,
		lastFirm: 'DWARVEN IRON GUILD',
		first: '',
		amount: '2,500.00 GS',
		status: 'SATISFIED',
	},
	{
		fileNum: '26-011344',
		index: 'AFF',
		recordDate: '02/27/2027',
		sat: false,
		lastFirm: 'STONECLEAVE',
		first: 'RIMTAR',
		amount: '10.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-011521',
		index: 'LIEN',
		recordDate: '03/05/2027',
		sat: false,
		lastFirm: 'IDEN METALCRAFTERS LLC',
		first: '',
		amount: '6,750.00 GS',
		status: 'DELINQUENT',
	},
	{
		fileNum: '26-011689',
		index: 'DEED',
		recordDate: '03/09/2027',
		sat: false,
		lastFirm: 'GODEN BOULDERBACK TRUST',
		first: '',
		amount: '1,500.00 GS',
		status: 'RECORDED',
	},
	{
		fileNum: '26-011872',
		index: 'NTC',
		recordDate: '03/11/2027',
		sat: false,
		lastFirm: 'ZULBAN TUNNELWORKS LLC',
		first: '',
		amount: '25.00 GS',
		status: 'RECORDED',
	},
];

export function searchDeeds(params: {
	lastFirm?: string;
	first?: string;
	dateFrom?: string;
	dateTo?: string;
	index?: string;
}): DeedRecord[] {
	return deeds.filter((d) => {
		if (
			params.lastFirm &&
			!d.lastFirm.toLowerCase().includes(params.lastFirm.toLowerCase())
		) {
			return false;
		}
		if (
			params.first &&
			!d.first.toLowerCase().includes(params.first.toLowerCase())
		) {
			return false;
		}
		if (params.index && params.index !== 'ALL' && d.index !== params.index) {
			return false;
		}
		return true;
	});
}

export function getDeedByFileNum(fileNum: string): DeedRecord | undefined {
	return deeds.find((d) => d.fileNum === fileNum);
}
