import exp from 'constants';
import { ReportType } from '../Enums/report.enum';
import {
  AnnexIIReportEightRecord,
  AnnexIIReportNineRecord,
  AnnexIIReportSevenRecord,
  ReportEightRecord,
  ReportElevenRecord,
  ReportFiveRecord,
  ReportNineRecord,
  ReportSevenRecord,
  ReportSixRecord,
  ReportTenRecord,
  ReportThirteenRecord,
  ReportTwelveRecord,
} from './reportIndividualDefinitions';

export type AggregateReportData = {
  [ReportType.FIVE]: ReportFiveRecord[];
  [ReportType.SIX]: ReportSixRecord[];
  [ReportType.SEVEN]: ReportSevenRecord[];
  [ReportType.EIGHT]: ReportEightRecord[];
  [ReportType.NINE]: ReportNineRecord[];
  [ReportType.TEN]: ReportTenRecord[];
  [ReportType.ELEVEN]: ReportElevenRecord[];
  [ReportType.TWELVE]: ReportTwelveRecord[];
  [ReportType.THIRTEEN]: ReportThirteenRecord[];
};

export type AggregateAnnexIIReportData = {
  [ReportType.FIVE]: ReportFiveRecord[];
  [ReportType.SIX]: null[]; // Report Six is not applicable for Annex II
  [ReportType.SEVEN]: AnnexIIReportSevenRecord[];
  [ReportType.EIGHT]: AnnexIIReportEightRecord[];
  [ReportType.NINE]: AnnexIIReportNineRecord[];
  [ReportType.TEN]: null[]; // Report Ten is not applicable for Annex II
  [ReportType.ELEVEN]: null[]; // Report Eleven is not applicable for Annex II
  [ReportType.TWELVE]: null[]; // Report Twelve is not applicable for Annex II
  [ReportType.THIRTEEN]: null[]; // Report Thirteen is not applicable for Annex II
};

export type AggregateReportTotal = {
  [key in ReportType]: number;
};

export type AggregateReportPageSize = {
  [key in ReportType]: number;
};

export type AggregateReportCurrentPage = {
  [key in ReportType]: number;
};

export const initialAggData: AggregateReportData = {} as AggregateReportData;
export const initialAggTotal: AggregateReportTotal = {} as AggregateReportTotal;
export const initialAggPageSize: AggregateReportPageSize = {} as AggregateReportPageSize;
export const initialAggCurrentPage: AggregateReportCurrentPage = {} as AggregateReportCurrentPage;

export const initialAggAnnexIIData: AggregateAnnexIIReportData = {} as AggregateAnnexIIReportData;

Object.values(ReportType).forEach((report) => {
  initialAggData[report] = [];
  initialAggTotal[report] = 0;
  initialAggPageSize[report] = 10;
  initialAggCurrentPage[report] = 1;
});
