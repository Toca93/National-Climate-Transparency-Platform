import { useEffect, useState } from 'react';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import './reportList.scss';
import { useTranslation } from 'react-i18next';
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
} from '../../Definitions/reportIndividualDefinitions';
import {
  getReportFiveColumns,
  getReportSixColumns,
  getReportSevenColumns,
  getReportTenColumns,
  getReportElevenColumns,
  getReportTwelveColumns,
  getReportThirteenColumns,
  getReportEightColumns,
  getReportNineColumns,
  getAnnexIIReportSevenColumns,
  getAnnexIIReportEightColumns,
  getAnnexIIReportNineColumns,
} from '../../Definitions/columns/reportColumns';
import { displayErrorMessage } from '../../Utils/errorMessageHandler';
import ReportCard from '../../Components/reportCard/reportCard';
import {
  AggregateReportData,
  AggregateReportTotal,
  AggregateReportCurrentPage,
  AggregateReportPageSize,
  initialAggData,
  initialAggTotal,
  initialAggPageSize,
  initialAggCurrentPage,
  AggregateAnnexIIReportData,
  initialAggAnnexIIData,
} from '../../Definitions/reportBulkDefinitions';
import { AnnexType, ReportType } from '../../Enums/report.enum';
import { Col, Empty, Row, Select, SelectProps, Table, Tag } from 'antd';
import { ImplMeans } from '../../Enums/activity.enum';
import { ReportSector } from '../../Enums/report.sector.enum';
import { ConfigurationSettingsType } from '../../Enums/configuration.enum';
import { SectorYearConfigurationType } from '../../Definitions/configurationDefinitions';
import { formatNumberWithThousandSeparators } from '../../Utils/utilServices';

const { Option } = Select;
type TagRender = SelectProps['tagRender'];

export interface TransparencyReport {
  annex: AnnexType;
  report: ReportType;
}

const transparencyReports: TransparencyReport[] = [
  { annex: AnnexType.TWO, report: ReportType.FIVE },
  { annex: AnnexType.TWO, report: ReportType.SEVEN },
  { annex: AnnexType.TWO, report: ReportType.EIGHT },
  { annex: AnnexType.TWO, report: ReportType.NINE },
  { annex: AnnexType.THREE, report: ReportType.SIX },
  { annex: AnnexType.THREE, report: ReportType.SEVEN },
  { annex: AnnexType.THREE, report: ReportType.EIGHT },
  { annex: AnnexType.THREE, report: ReportType.NINE },
  { annex: AnnexType.THREE, report: ReportType.TEN },
  { annex: AnnexType.THREE, report: ReportType.ELEVEN },
  { annex: AnnexType.THREE, report: ReportType.TWELVE },
  { annex: AnnexType.THREE, report: ReportType.THIRTEEN },
];

const reportList = () => {
  const { get, post } = useConnection();
  const { t } = useTranslation(['report']);

  // General Page State
  const [loading, setLoading] = useState<boolean>(false);

  // Reports to Display
  const [reportsToDisplay, setReportsToDisplay] =
    useState<TransparencyReport[]>(transparencyReports);

  // Bulk Report Definitions
  const [aggregateReportData, setAggregateReportData] =
    useState<AggregateReportData>(initialAggData);
  const [aggregateReportTotal, setAggregateReportTotal] =
    useState<AggregateReportTotal>(initialAggTotal);
  const [aggregatePageSize, setAggregatePageSize] =
    useState<AggregateReportPageSize>(initialAggPageSize);
  const [aggregateCurrentPage, setAggregateCurrentPage] =
    useState<AggregateReportCurrentPage>(initialAggCurrentPage);

  // Aggregate Annex II Report Data
  const [aggregateAnnexIIReportData, setAggregateAnnexIIReportData] =
    useState<AggregateAnnexIIReportData>(initialAggAnnexIIData);
  const [aggregateAnnexIIPageSize, setAggregateAnnexIIPageSize] =
    useState<AggregateReportPageSize>(initialAggPageSize);
  const [aggregateAnnexIICurrentPage, setAggregateAnnexIICurrentPage] =
    useState<AggregateReportCurrentPage>(initialAggCurrentPage);
  const [aggregateAnnexIITotal, setAggregateAnnexIITotal] =
    useState<AggregateReportTotal>(initialAggTotal);

  // Projection Year Configuration
  const thisYear = new Date().getFullYear();
  const [projectionYearConfig, setProjectionYearConfig] = useState<SectorYearConfigurationType>({
    mostRecentYear: thisYear,
    projectionYear1: 2021,
    projectionYear2: 2022,
    projectionYear3: 2023,
  });

  const getProjectionYearConfig = async () => {
    try {
      const response: any = await get(
        `national/settings/${ConfigurationSettingsType.SECTOR_YEAR_CONFIGURATION}`,
        {}
      );
      if (response) {
        const data = response.data;
        setProjectionYearConfig({
          mostRecentYear: data.mostRecentYear,
          projectionYear1: data.projectionYear1,
          projectionYear2: data.projectionYear2,
          projectionYear3: data.projectionYear3,
        });
        console.log('Setting projection years', data);
      }
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  // Functions to Retrieve Table Data

  const getAnnexTwoTableFiveData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateAnnexIICurrentPage[5],
        size: aggregateAnnexIIPageSize[5],
      };

      const response: any = await post('national/reports/2/5/query', payload);
      if (response) {
        const tempReportFiveData: ReportFiveRecord[] = [];

        response.data.forEach((entry: any, index: number) => {
          tempReportFiveData.push({
            key: index,
            source: entry.source,
            titleOfAction: entry.titleOfAction,
            description: entry.description,
            objective: entry.objective,
            instrumentType: entry.instrumentType ?? [],
            status: entry.status,
            sector: entry.sector,
            ghgsAffected: entry.ghgsAffected ?? [],
            startYear: entry.startYear,
            implementingEntities: entry.implementingEntities ?? [],
            achievedGHGReduction: entry.achievedGHGReduction,
            expectedGHGReduction: entry.expectedGHGReduction,
          });
        });

        setAggregateAnnexIIReportData((prevState) => ({
          ...prevState,
          [ReportType.FIVE]: tempReportFiveData,
        }));

        setAggregateAnnexIITotal((prevState) => ({
          ...prevState,
          [ReportType.FIVE]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getAnnexTwoTableSevenData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateAnnexIICurrentPage[7],
        size: aggregateAnnexIIPageSize[7],
      };

      const response: any = await post('national/reports/2/7/query', payload);
      if (response) {
        const tempReportSevenData: AnnexIIReportSevenRecord[] = [];

        response.data.forEach((entry: any, index: number) => {
          tempReportSevenData.push({
            key: index,
            category: entry.category,
            thisyear: entry.withM[projectionYearConfig.mostRecentYear - 2000] ?? 'N/A',
            projection1: entry.withM[projectionYearConfig.projectionYear1 - 2000] ?? 'N/A',
            projection2: entry.withM[projectionYearConfig.projectionYear2 - 2000] ?? 'N/A',
            projection3: entry.withM[projectionYearConfig.projectionYear3 - 2000] ?? 'N/A',
          });
        });

        setAggregateAnnexIIReportData((prevState) => ({
          ...prevState,
          [ReportType.SEVEN]: tempReportSevenData,
        }));

        setAggregateAnnexIITotal((prevState) => ({
          ...prevState,
          [ReportType.SEVEN]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getAnnexTwoTableEightData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateAnnexIICurrentPage[8],
        size: aggregateAnnexIIPageSize[8],
      };

      const response: any = await post('national/reports/2/8/query', payload);
      if (response) {
        const tempReportEightData: AnnexIIReportEightRecord[] = [];

        response.data.forEach((entry: any, index: number) => {
          tempReportEightData.push({
            key: index,
            category: entry.category,
            thisyear: entry.withAM[projectionYearConfig.mostRecentYear - 2000] ?? 'N/A',
            projection1: entry.withAM[projectionYearConfig.projectionYear1 - 2000] ?? 'N/A',
            projection2: entry.withAM[projectionYearConfig.projectionYear2 - 2000] ?? 'N/A',
            projection3: entry.withAM[projectionYearConfig.projectionYear3 - 2000] ?? 'N/A',
          });
        });

        setAggregateAnnexIIReportData((prevState) => ({
          ...prevState,
          [ReportType.EIGHT]: tempReportEightData,
        }));

        setAggregateAnnexIITotal((prevState) => ({
          ...prevState,
          [ReportType.EIGHT]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getAnnexTwoTableNineData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateAnnexIICurrentPage[9],
        size: aggregateAnnexIIPageSize[9],
      };

      const response: any = await post('national/reports/2/9/query', payload);
      if (response) {
        const tempReportNineData: AnnexIIReportNineRecord[] = [];

        response.data.forEach((entry: any, index: number) => {
          tempReportNineData.push({
            key: index,
            category: entry.category,
            thisyear: entry.withoutM[projectionYearConfig.mostRecentYear - 2000] ?? 'N/A',
            projection1: entry.withoutM[projectionYearConfig.projectionYear1 - 2000] ?? 'N/A',
            projection2: entry.withoutM[projectionYearConfig.projectionYear2 - 2000] ?? 'N/A',
            projection3: entry.withoutM[projectionYearConfig.projectionYear3 - 2000] ?? 'N/A',
          });
        });

        setAggregateAnnexIIReportData((prevState) => ({
          ...prevState,
          [ReportType.NINE]: tempReportNineData,
        }));

        setAggregateAnnexIITotal((prevState) => ({
          ...prevState,
          [ReportType.NINE]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableSixData = async () => {
    // ML - rounded up requiredAmountDomestic and requiredAmount
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[6],
        size: aggregatePageSize[6],
      };

      const response: any = await post('national/reports/3/6/query', payload);
      if (response) {
        const tempReportSixData: ReportSixRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportSixData.push({
            key: index,
            activityId: report.activityId,
            sector: report.sector,
            subSectors: report.subSector ?? [],
            titleOfActivity: report.title,
            description: report.description,
            requiredAmountDomestic: Math.round(report.requiredAmountDomestic),
            requiredAmount: Math.round(report.requiredAmount),
            startYear: report.startYear,
            endYear: report.endYear,
            financialInstrument: report.internationalFinancialInstrument,
            type: report.type,
            techDevelopment: report.meansOfImplementation === ImplMeans.TECH_DEV ? 'Yes' : 'No',
            capacityBuilding:
              report.meansOfImplementation === ImplMeans.CAPACITY_BUILD ? 'Yes' : 'No',
            anchoredInNationalStrategy: report.anchoredInNationalStrategy ? 'Yes' : 'No',
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
            supportChannel: report.internationalSupportChannel,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.SIX]: tempReportSixData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.SIX]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableSevenData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[7],
        size: aggregatePageSize[7],
      };

      const response: any = await post('national/reports/3/7/query', payload);

      if (response) {
        const tempReportSevenData: ReportSevenRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportSevenData.push({
            key: index,
            activityId: report.activityId,
            titleOfActivity: report.title,
            description: report.description,
            supportChannel: report.internationalSupportChannel,
            recipientEntities: report.recipientEntities ?? [],
            nationalImplementingEntities: report.nationalImplementingEntity ?? [],
            internationalImplementingEntities: report.internationalImplementingEntity ?? [],
            receivedAmount: report.receivedAmount,
            receivedAmountDomestic: report.receivedAmountDomestic,
            startYear: report.startYear,
            endYear: report.endYear,
            financialInstrument: report.internationalFinancialInstrument,
            financingStatus: report.financingStatus,
            type: report.type,
            sector: report.sector,
            subSectors: report.subSector ?? [],
            techDevelopment: report.meansOfImplementation === ImplMeans.TECH_DEV ? 'Yes' : 'No',
            capacityBuilding:
              report.meansOfImplementation === ImplMeans.CAPACITY_BUILD ? 'Yes' : 'No',
            activityStatus: report.status,
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.SEVEN]: tempReportSevenData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.SEVEN]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableEightData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[8],
        size: aggregatePageSize[8],
      };

      const response: any = await post('national/reports/3/8/query', payload);

      if (response) {
        const tempReportEightData: ReportEightRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportEightData.push({
            key: index,
            activityId: report.activityId,
            sector: report.sector,
            subSectors: report.subSector ?? [],
            titleOfActivity: report.title,
            description: report.description,
            type: report.type,
            technologyType: report.technologyType,
            startYear: report.startYear,
            endYear: report.endYear,
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.EIGHT]: tempReportEightData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.EIGHT]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableNineData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[9],
        size: aggregatePageSize[9],
      };

      const response: any = await post('national/reports/3/9/query', payload);

      if (response) {
        const tempReportNineData: ReportNineRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportNineData.push({
            key: index,
            activityId: report.activityId,
            titleOfActivity: report.title,
            description: report.description,
            technologyType: report.technologyType,
            startYear: report.startYear,
            endYear: report.endYear,
            recipientEntities: report.recipientEntities ?? [],
            nationalImplementingEntities: report.nationalImplementingEntity ?? [],
            internationalImplementingEntities: report.internationalImplementingEntity ?? [],
            type: report.type,
            sector: report.sector,
            subSectors: report.subSector ?? [],
            activityStatus: report.status,
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.NINE]: tempReportNineData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.NINE]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableTenData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[10],
        size: aggregatePageSize[10],
      };

      const response: any = await post('national/reports/3/10/query', payload);

      if (response) {
        const tempReportTenData: ReportTenRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportTenData.push({
            key: index,
            activityId: report.activityId,
            sector: report.sector,
            subSectors: report.subSector ?? [],
            titleOfActivity: report.title,
            description: report.description,
            type: report.type,
            startYear: report.startYear,
            endYear: report.endYear,
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.TEN]: tempReportTenData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.TEN]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableElevenData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[11],
        size: aggregatePageSize[11],
      };

      const response: any = await post('national/reports/3/11/query', payload);

      if (response) {
        const tempReportElevenData: ReportElevenRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportElevenData.push({
            key: index,
            activityId: report.activityId,
            titleOfActivity: report.title,
            description: report.description,
            startYear: report.startYear,
            endYear: report.endYear,
            recipientEntities: report.recipientEntities ?? [],
            nationalImplementingEntities: report.nationalImplementingEntity ?? [],
            internationalImplementingEntities: report.internationalImplementingEntity ?? [],
            type: report.type,
            sector: report.sector,
            subSectors: report.subSector ?? [],
            activityStatus: report.status,
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.ELEVEN]: tempReportElevenData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.ELEVEN]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableTwelveData = async () => {
    // ML - rounded up requiredAmountDomestic and requiredAmount
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[12],
        size: aggregatePageSize[12],
      };

      const response: any = await post('national/reports/3/12/query', payload);

      if (response) {
        const tempReportTwelveData: ReportTwelveRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportTwelveData.push({
            key: index,
            activityId: report.activityId,
            titleOfActivity: report.title,
            description: report.description,
            startYear: report.startYear,
            endYear: report.endYear,
            recipientEntities: report.recipientEntities ?? [],
            supportChannel: report.internationalSupportChannel ?? [],
            requiredAmountDomestic: Math.round(report.requiredAmountDomestic) ?? [],
            requiredAmount: Math.round(report.requiredAmount),
            activityStatus: report.status,
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.TWELVE]: tempReportTwelveData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.TWELVE]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  const getTableThirteenData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: aggregateCurrentPage[13],
        size: aggregatePageSize[13],
      };

      const response: any = await post('national/reports/3/13/query', payload);

      if (response) {
        const tempReportThirteenData: ReportThirteenRecord[] = [];

        response.data.forEach((report: any, index: number) => {
          tempReportThirteenData.push({
            key: index,
            activityId: report.activityId,
            titleOfActivity: report.title,
            description: report.description,
            startYear: report.startYear,
            endYear: report.endYear,
            recipientEntities: report.recipientEntities ?? [],
            supportChannel: report.internationalSupportChannel,
            receivedAmountDomestic: report.receivedAmountDomestic,
            receivedAmount: report.receivedAmount,
            activityStatus: report.status,
            achievedGHGReduction: report.achievedGHGReductionAlternate
              ? report.achievedGHGReductionAlternate
              : report.achievedGHGReduction ?? 'N/A',
            additionalInfo: report.etfDescription,
          });
        });

        setAggregateReportData((prevState) => ({
          ...prevState,
          [ReportType.THIRTEEN]: tempReportThirteenData,
        }));

        setAggregateReportTotal((prevState) => ({
          ...prevState,
          [ReportType.THIRTEEN]: response.response.data.total,
        }));

        setLoading(false);
      }
    } catch (error: any) {
      displayErrorMessage(error);
      setLoading(false);
    }
  };

  // Function to Export Report Data

  const downloadReportData = async (
    exportFileType: string,
    annexType: AnnexType,
    whichTable: ReportType
  ) => {
    try {
      const payload: any = { fileType: exportFileType };
      const response: any = await post(
        `national/reports/${annexType}/${whichTable}/export`,
        payload
      );
      if (response && response.data) {
        const url = response.data.url;
        const a = document.createElement('a');
        a.href = url;
        a.download = response.data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  // Function to Retrieve Column Definitions

  const getReportColumns = (annexType: AnnexType, reportType: ReportType) => {
    if (annexType === AnnexType.TWO) {
      switch (reportType) {
        case ReportType.FIVE:
          return getReportFiveColumns(t);
        case ReportType.SEVEN:
          return getAnnexIIReportSevenColumns(t, projectionYearConfig);
        case ReportType.EIGHT:
          return getAnnexIIReportEightColumns(t, projectionYearConfig);
        case ReportType.NINE:
          return getAnnexIIReportNineColumns(t, projectionYearConfig);
      }
    } else {
      switch (reportType) {
        case ReportType.SIX:
          return getReportSixColumns(t);
        case ReportType.SEVEN:
          return getReportSevenColumns(t);
        case ReportType.EIGHT:
          return getReportEightColumns(t);
        case ReportType.NINE:
          return getReportNineColumns(t);
        case ReportType.TEN:
          return getReportTenColumns(t);
        case ReportType.ELEVEN:
          return getReportElevenColumns(t);
        case ReportType.TWELVE:
          return getReportTwelveColumns(t);
        case ReportType.THIRTEEN:
          return getReportThirteenColumns(t);
      }
    }
  };

  // Function to Handle Table wise Pagination

  const handleTablePagination = (
    pagination: any,
    whichAnnex: AnnexType,
    whichReport: ReportType
  ) => {
    if (whichAnnex === AnnexType.TWO) {
      setAggregateAnnexIICurrentPage((prevState) => ({
        ...prevState,
        [whichReport]: pagination.current,
      }));
      setAggregateAnnexIIPageSize((prevState) => ({
        ...prevState,
        [whichReport]: pagination.pageSize,
      }));
      return;
    }
    setAggregateCurrentPage((prevState) => ({
      ...prevState,
      [whichReport]: pagination.current,
    }));

    setAggregatePageSize((prevState) => ({
      ...prevState,
      [whichReport]: pagination.pageSize,
    }));
  };

  // Function to Get Summary for the Report
  const getSummaryFunction = (
    annexType: AnnexType,
    reportType: ReportType
  ): ((data: any) => React.ReactNode) | undefined => {
    if (annexType === AnnexType.TWO) {
      if (reportType !== ReportType.FIVE) {
        return (data: AnnexIIReportSevenRecord[]) => {
          const filteredData = data.filter((record) => record.category !== ReportSector.LULUCF);

          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total with LULUCF</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {formatNumberWithThousandSeparators(
                    data.reduce((acc, record) => acc + (parseFloat(record.thisyear) || 0), 0)
                  )}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {formatNumberWithThousandSeparators(
                    data.reduce((acc, record) => acc + (parseFloat(record.projection1) || 0), 0)
                  )}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {formatNumberWithThousandSeparators(
                    data.reduce((acc, record) => acc + (parseFloat(record.projection2) || 0), 0)
                  )}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {formatNumberWithThousandSeparators(
                    data.reduce((acc, record) => acc + (parseFloat(record.projection3) || 0), 0)
                  )}
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total without LULUCF</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {formatNumberWithThousandSeparators(
                    filteredData.reduce(
                      (acc, record) => acc + (parseFloat(record.thisyear) || 0),
                      0
                    )
                  )}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {formatNumberWithThousandSeparators(
                    filteredData.reduce(
                      (acc, record) => acc + (parseFloat(record.projection1) || 0),
                      0
                    )
                  )}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {formatNumberWithThousandSeparators(
                    filteredData.reduce(
                      (acc, record) => acc + (parseFloat(record.projection2) || 0),
                      0
                    )
                  )}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {formatNumberWithThousandSeparators(
                    filteredData.reduce(
                      (acc, record) => acc + (parseFloat(record.projection3) || 0),
                      0
                    )
                  )}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        };
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  // Updating the Table Data when the Pagination changes
  // get config to fetch most recent year and prjection years for Annex II tables 7, 8, 9
  useEffect(() => {
    getProjectionYearConfig();
  }, []);

  useEffect(() => {
    getAnnexTwoTableFiveData();
  }, [aggregateAnnexIICurrentPage?.[5], aggregateAnnexIIPageSize?.[5]]);

  useEffect(() => {
    getAnnexTwoTableSevenData();
  }, [aggregateAnnexIICurrentPage?.[7], aggregateAnnexIIPageSize?.[7], projectionYearConfig]);

  useEffect(() => {
    getAnnexTwoTableEightData();
  }, [aggregateAnnexIICurrentPage?.[8], aggregateAnnexIIPageSize?.[8], projectionYearConfig]);

  useEffect(() => {
    getAnnexTwoTableNineData();
  }, [aggregateAnnexIICurrentPage?.[9], aggregateAnnexIIPageSize?.[9], projectionYearConfig]);

  useEffect(() => {
    getTableSixData();
  }, [aggregateCurrentPage?.[6], aggregatePageSize?.[6]]);

  useEffect(() => {
    getTableSevenData();
  }, [aggregateCurrentPage?.[7], aggregatePageSize?.[7]]);

  useEffect(() => {
    getTableEightData();
  }, [aggregateCurrentPage?.[8], aggregatePageSize?.[9]]);

  useEffect(() => {
    getTableNineData();
  }, [aggregateCurrentPage?.[9], aggregatePageSize?.[9]]);

  useEffect(() => {
    getTableTenData();
  }, [aggregateCurrentPage?.[10], aggregatePageSize?.[10]]);

  useEffect(() => {
    getTableElevenData();
  }, [aggregateCurrentPage?.[11], aggregatePageSize?.[11]]);

  useEffect(() => {
    getTableTwelveData();
  }, [aggregateCurrentPage?.[12], aggregatePageSize?.[12]]);

  useEffect(() => {
    getTableThirteenData();
  }, [aggregateCurrentPage?.[13], aggregatePageSize?.[13]]);

  // Selected Reports Custom Rendering Function

  const tagRender: TagRender = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        className="report-chip"
      >
        <label className="report-label">{label}</label>
      </Tag>
    );
  };

  const handleReportSelection = (values: string[]) => {
    const selectedTransparencyReports: TransparencyReport[] = values.map((value) => {
      const [annex, report] = value.split('_');
      return { annex: annex as AnnexType, report: report as ReportType };
    });

    setReportsToDisplay(selectedTransparencyReports);
  };

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">{t('viewTitle')}</div>
      </div>
      <div className="select-report-bar">
        <Row gutter={20}>
          <Col span={24}>
            <Select
              className="report-selector"
              mode="multiple"
              value={reportsToDisplay.map((report) => `${report.annex}_${report.report}`)}
              tagRender={tagRender}
              size="large"
              showSearch={false}
              placeholder={
                <label className="placeholder-label">
                  {'Click to select the Reports to display'}
                </label>
              }
              onChange={handleReportSelection}
            >
              {transparencyReports.map((report: TransparencyReport) => (
                <Option
                  key={`annex_${report.annex}_report_${report.report}`}
                  value={`${report.annex}_${report.report}`}
                >
                  {t(`annex_${report.annex}_report_${report.report}_Title`)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
      {reportsToDisplay.length > 0 ? (
        <div>
          {reportsToDisplay.map((TransparencyReport) => (
            <ReportCard
              key={`Annex_${TransparencyReport.annex}_Report_card_${TransparencyReport.report}`}
              loading={loading}
              annex={TransparencyReport.annex}
              whichReport={TransparencyReport.report}
              reportTitle={t(
                `annex_${TransparencyReport.annex}_report_${TransparencyReport.report}_Title`
              )}
              reportSubtitle={t(
                `annex_${TransparencyReport.annex}_report_${TransparencyReport.report}_SubTitle`
              )}
              reportData={
                TransparencyReport.annex === AnnexType.THREE
                  ? aggregateReportData[TransparencyReport.report]
                  : aggregateAnnexIIReportData[TransparencyReport.report]
              }
              columns={getReportColumns(TransparencyReport.annex, TransparencyReport.report)}
              totalEntries={
                TransparencyReport.annex === AnnexType.THREE
                  ? aggregateReportTotal[TransparencyReport.report]
                  : aggregateAnnexIITotal[TransparencyReport.report]
              }
              currentPage={aggregateCurrentPage[TransparencyReport.report]}
              pageSize={aggregatePageSize[TransparencyReport.report]}
              exportButtonNames={[t('exportAsExcel'), t('exportAsCsv')]}
              downloadReportData={downloadReportData}
              handleTablePagination={handleTablePagination}
              summary={getSummaryFunction(TransparencyReport.annex, TransparencyReport.report)}
            ></ReportCard>
          ))}
        </div>
      ) : (
        <div className="no-reports-selected">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No Reports Selected'} />
        </div>
      )}
    </div>
  );
};

export default reportList;
