import { Col, Grid, Row, Select, Spin, Tag } from 'antd';
import './dashboard.scss';
import { InfoCircleOutlined } from '@ant-design/icons';
import ChartInformation from '../../Components/Popups/chartInformation';
import { useEffect, useState } from 'react';
import { DashboardActionItem, ChartData } from '../../Definitions/dashboard.definitions';
import LayoutTable from '../../Components/common/Table/layout.table';
import { useTranslation } from 'react-i18next';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { getActionTableColumns } from '../../Definitions/columns/actionColumns';
import PieChart from '../../Components/Charts/PieChart/pieChart';
import { dashboardHalfColumnBps } from '../../Definitions/breakpoints/breakpoints';
import { displayErrorMessage } from '../../Utils/errorMessageHandler';
import BarChart from '../../Components/Charts/BarChart/barChart';

const { Option } = Select;
const { useBreakpoint } = Grid;

// Compact Pie Chart Component for CBT Dashboard
interface CompactPieChartProps {
  chart: ChartData;
  onInfoClick: (content: { title: string; body: string }) => void;
  setOpenChartInfo: (open: boolean) => void;
  t: any;
}

// Compact Chart Loading Placeholder Component
interface CompactChartLoadingPlaceholderProps {
  t: any;
  title: string;
}

const CompactChartLoadingPlaceholder: React.FC<CompactChartLoadingPlaceholderProps> = ({
  t,
  title,
}) => (
  <div style={{ width: '100%' }}>
    <div
      style={{
        fontSize: '13px',
        fontWeight: 500,
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '6px',
        whiteSpace: 'nowrap',
        width: '100%',
        paddingLeft: '40px',
      }}
    >
      <span>{title}</span>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 188,
        width: 330,
      }}
    >
      <Spin size="small" />
    </div>
  </div>
);

const CompactPieChart: React.FC<CompactPieChartProps> = ({
  chart,
  onInfoClick,
  setOpenChartInfo,
  t,
}) => (
  <div style={{ width: '100%' }}>
    <div
      style={{
        fontSize: '13px',
        fontWeight: 500,
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '6px',
        whiteSpace: 'nowrap',
        width: '100%',
        paddingLeft: '40px',
      }}
    >
      <span>{chart.chartTitle}</span>
      <InfoCircleOutlined
        style={{ cursor: 'pointer', color: '#8c8c8c', fontSize: '13px', flexShrink: 0 }}
        onClick={() => {
          onInfoClick({
            title: chart.chartTitle,
            body: chart.chartDescription,
          });
          setOpenChartInfo(true);
        }}
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <PieChart chart={chart} t={t} chartWidth={330} showDate={false} isCompact={true} />
    </div>
  </div>
);

const Dashboard = () => {
  // Context Information

  const { t } = useTranslation(['dashboard', 'actionList', 'columnHeader']);
  const screens = useBreakpoint();
  const { get, post, statServerUrl } = useConnection();

  const [loading, setLoading] = useState<boolean>(true);

  // Table Data State

  const [tableData, setTableData] = useState<DashboardActionItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [totalRowCount, setTotalRowRowCount] = useState<number>();

  // Chart State
  const [openChartInfo, setOpenChartInfo] = useState<boolean>(false);
  const [chartContent, setChartContent] = useState<{ title: string; body: string }>();

  // Year State for the GHG MYG Chart 5

  const [mtgYear, setMtgYear] = useState<number>(new Date().getFullYear());

  // Individual Chart Data

  const [actionChart, setActionChart] = useState<ChartData>();
  const [projectChart, setProjectChart] = useState<ChartData>();
  const [supportChart, setSupportChart] = useState<ChartData>();
  const [financeChart, setFinanceChart] = useState<ChartData>();
  const [mitigationRecentChart, setMitigationRecentChart] = useState<ChartData>();
  const [mitigationIndividualChart, setMitigationIndividualChart] = useState<ChartData>();

  // Type of Support Filter State for New Charts
  const [typeOfSupportFilter, setTypeOfSupportFilter] = useState<string | undefined>(undefined);

  // New Chart Data (Support-related charts with filter)
  const [supportByTypeChart, setSupportByTypeChart] = useState<ChartData>();
  const [supportByActivityStatusChart, setSupportByActivityStatusChart] = useState<ChartData>();
  const [supportByETFSectorChart, setSupportByETFSectorChart] = useState<ChartData>();
  const [supportByFinancialInstrumentChart, setSupportByFinancialInstrumentChart] =
    useState<ChartData>();
  const [supportByFinancingChannelChart, setSupportByFinancingChannelChart] = useState<ChartData>();

  // Chart Dimensions

  const [chartWidth, setChartWidth] = useState<number>(450);
  const [chartHeight, setChartHeight] = useState<number>(225);

  // Year List to be shown in the Year Selector in Chart 5

  const yearsList: number[] = [];

  for (let year = 2013; year <= 2050; year++) {
    yearsList.push(year);
  }

  // Setting the chart Width

  useEffect(() => {
    if (screens.xxl) {
      setChartWidth(560);
      setChartHeight(303);
    } else if (screens.xl) {
      setChartWidth(480);
      setChartHeight(223);
    } else if (screens.lg) {
      setChartWidth(550);
      setChartHeight(300);
    } else {
      setChartWidth(450);
      setChartHeight(200);
    }
  }, [screens]);

  // BE Call to fetch Data

  const getAllData = async () => {
    setLoading(true);
    try {
      const payload: any = { page: currentPage, size: pageSize };

      // Adding Sort By Conditions

      payload.sort = {
        key: 'actionId',
        order: 'DESC',
      };

      const response: any = await post('national/actions/query', payload);
      if (response) {
        const unstructuredData: any[] = response.data;
        const structuredData: DashboardActionItem[] = [];
        for (let i = 0; i < unstructuredData.length; i++) {
          structuredData.push({
            key: i,
            actionId: unstructuredData[i].actionId,
            title: unstructuredData[i].title,
            status: unstructuredData[i].status,
            actionType: unstructuredData[i].type,
            affectedSectors: unstructuredData[i].sector,
            nationalImplementingEntity: unstructuredData[i].migratedData[0]?.natImplementors ?? [],
            financeNeeded: Math.round(unstructuredData[i].migratedData[0]?.financeNeeded ?? 0),
            financeReceived: Math.round(unstructuredData[i].migratedData[0]?.financeReceived ?? 0),
          });
        }
        setTableData(structuredData);
        setTotalRowRowCount(response.response.data.total);
      }
    } catch (error: any) {
      displayErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const getIndividualMitigationChartData = async () => {
    if (mtgYear) {
      try {
        const response: any = await get(
          `stats/analytics/ghgMitigationSummaryForYear/${mtgYear}`,
          undefined,
          statServerUrl
        );
        const mitigationIndividualChartData = response.data;
        setMitigationIndividualChart({
          chartId: 5,
          chartTitle: t('mtgIndividualChartTitle'),
          chartDescription: t('mtgIndividualChartDescription'),
          categories: mitigationIndividualChartData.stats.sectors.map((sector: string) =>
            sector === null ? 'No Sector Attached' : sector
          ),
          values: mitigationIndividualChartData.stats.totals.map((count: string) =>
            parseInt(count, 10)
          ),
          lastUpdatedTime: mitigationIndividualChartData.lastUpdate,
        });
      } catch (error: any) {
        displayErrorMessage(error);
      }
    }
  };

  const getClimateActionChartData = async () => {
    try {
      const response: any = await get('stats/analytics/actionsSummery', undefined, statServerUrl);
      const actionChartData = response.data;
      setActionChart({
        chartId: 1,
        chartTitle: t('actionChartTitle'),
        chartDescription: t('actionChartDescription'),
        categories: actionChartData.stats.sectors,
        values: actionChartData.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: actionChartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getProjectChartData = async () => {
    try {
      const response: any = await get('stats/analytics/projectSummary', undefined, statServerUrl);
      const projectChartData = response.data;
      setProjectChart({
        chartId: 2,
        chartTitle: t('projectChartTitle'),
        chartDescription: t('projectChartDescription'),
        categories: projectChartData.stats.sectors.map((sector: string) =>
          sector === null ? 'No Sector Attached' : sector
        ),
        values: projectChartData.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: projectChartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getSupportChartData = async () => {
    try {
      const response: any = await get('stats/analytics/supportSummary', undefined, statServerUrl);
      const supportChartData = response.data;
      setSupportChart({
        chartId: 3,
        chartTitle: t('supportChartTitle'),
        chartDescription: t('supportChartDescription'),
        categories: ['Support Received', 'Support Needed'],
        values: [
          supportChartData.stats.supportReceivedActivities,
          supportChartData.stats.supportNeededActivities,
        ],
        lastUpdatedTime: supportChartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getFinanceChartData = async () => {
    try {
      const response: any = await get(
        'stats/analytics/supportFinanceSummary',
        undefined,
        statServerUrl
      );
      const financeChartData = response.data;
      setFinanceChart({
        chartId: 4,
        chartTitle: t('financeChartTitle'),
        chartDescription: t('financeChartDescription'),
        categories: ['Support Received', 'Support Needed'],
        values: [financeChartData.stats.supportReceived, financeChartData.stats.supportNeeded],
        lastUpdatedTime: financeChartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getRecentMitigationChartData = async () => {
    try {
      const response: any = await get(
        'stats/analytics/getGhgMitigationSummary',
        undefined,
        statServerUrl
      );
      const mitigationIndividualChartData = response.data;
      setMitigationRecentChart({
        chartId: 6,
        chartTitle: t('mtgRecentChartTitle'),
        chartDescription: t('mtgRecentChartDescription'),
        categories: mitigationIndividualChartData.stats.sectors.map((sector: string) =>
          sector === null ? 'No Sector Attached' : sector
        ),
        values: mitigationIndividualChartData.stats.totals.map((count: string) =>
          parseInt(count, 10)
        ),
        lastUpdatedTime: mitigationIndividualChartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  // New fetch functions for support-related charts

  const getSupportByTypeChartData = async () => {
    try {
      const queryParam = typeOfSupportFilter ? `?typeOfSupport=${typeOfSupportFilter}` : '';
      const response: any = await get(
        `stats/analytics/supportByType${queryParam}`,
        undefined,
        statServerUrl
      );
      const chartData = response.data;
      setSupportByTypeChart({
        chartId: 7,
        chartTitle: t('supportByTypeChartTitle'),
        chartDescription: t('supportByTypeChartDescription'),
        categories: chartData.stats.sectors.map((sector: string) =>
          sector === null ? 'No Type Attached' : sector
        ),
        values: chartData.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: chartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getSupportByActivityStatusChartData = async () => {
    try {
      const queryParam = typeOfSupportFilter ? `?typeOfSupport=${typeOfSupportFilter}` : '';
      const response: any = await get(
        `stats/analytics/supportByActivityStatus${queryParam}`,
        undefined,
        statServerUrl
      );
      const chartData = response.data;
      setSupportByActivityStatusChart({
        chartId: 8,
        chartTitle: t('supportByActivityStatusChartTitle'),
        chartDescription: t('supportByActivityStatusChartDescription'),
        categories: chartData.stats.sectors.map((sector: string) => {
          // Map English status to localized names
          if (sector === 'Planned') return 'Planirano';
          if (sector === 'Ongoing') return 'U toku';
          if (sector === 'Completed') return 'Završeno';
          return sector === null ? 'No Status Attached' : sector;
        }),
        values: chartData.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: chartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getSupportByETFSectorChartData = async () => {
    try {
      const queryParam = typeOfSupportFilter ? `?typeOfSupport=${typeOfSupportFilter}` : '';
      const response: any = await get(
        `stats/analytics/supportByETFSector${queryParam}`,
        undefined,
        statServerUrl
      );
      const chartData = response.data;
      setSupportByETFSectorChart({
        chartId: 9,
        chartTitle: t('supportByETFSectorChartTitle'),
        chartDescription: t('supportByETFSectorChartDescription'),
        categories: chartData.stats.sectors.map((sector: string) => {
          // Map English sector names to localized names
          if (sector === 'Energy') return 'Energija';
          if (sector === 'Transport') return 'Transport';
          if (sector === 'Industry (IPPU)') return 'Industrija';
          if (sector === 'Agriculture') return 'Poljoprivreda';
          return sector === null ? 'No Sector Attached' : sector;
        }),
        values: chartData.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: chartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getSupportByFinancialInstrumentChartData = async () => {
    try {
      const queryParam = typeOfSupportFilter ? `?typeOfSupport=${typeOfSupportFilter}` : '';
      const response: any = await get(
        `stats/analytics/supportByFinancialInstrument${queryParam}`,
        undefined,
        statServerUrl
      );
      const chartData = response.data;
      setSupportByFinancialInstrumentChart({
        chartId: 10,
        chartTitle: t('supportByFinancialInstrumentChartTitle'),
        chartDescription: t('supportByFinancialInstrumentChartDescription'),
        categories: chartData.stats.sectors.map((sector: string) => {
          // Map instrument names (CBT uses kebab-case values)
          if (sector === 'grant') return 'Grant';
          if (sector === 'concessional-loan') return 'Koncesioni zajam';
          if (sector === 'non-concessional-loan') return 'Nekoncesioni zajam';
          if (sector === 'equity') return 'Equity';
          if (sector === 'guarantee') return 'Garancija';
          if (sector === 'insurance') return 'Osiguranje';
          if (sector === 'other') return 'Ostalo';
          return sector === null ? 'No Instrument Attached' : sector;
        }),
        values: chartData.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: chartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  const getSupportByFinancingChannelChartData = async () => {
    try {
      const queryParam = typeOfSupportFilter ? `?typeOfSupport=${typeOfSupportFilter}` : '';
      const response: any = await get(
        `stats/analytics/supportByFinancingChannel${queryParam}`,
        undefined,
        statServerUrl
      );
      const chartData = response.data;
      setSupportByFinancingChannelChart({
        chartId: 11,
        chartTitle: t('supportByFinancingChannelChartTitle'),
        chartDescription: t('supportByFinancingChannelChartDescription'),
        categories: chartData.stats.sectors.map((sector: string) => {
          // Map channel names to localized names
          if (sector === 'Multilateral') return 'Multilateralni';
          if (sector === 'Bilateral') return 'Bilateralni';
          if (sector === 'Regional') return 'Regionalni';
          if (sector === 'Other') return 'Ostalo';
          return sector === null ? 'No Channel Attached' : sector;
        }),
        values: chartData.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: chartData.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  // Batch fetch function - gets all 5 charts in one request
  const getAllSupportChartsData = async () => {
    try {
      const queryParam = typeOfSupportFilter ? `?typeOfSupport=${typeOfSupportFilter}` : '';
      const response: any = await get(
        `stats/analytics/supportChartsBatch${queryParam}`,
        undefined,
        statServerUrl
      );

      const {
        supportByType,
        supportByActivityStatus,
        supportByETFSector,
        supportByFinancialInstrument,
        supportByFinancingChannel,
      } = response.data;

      // Set all chart data at once
      setSupportByTypeChart({
        chartId: 7,
        chartTitle: t('supportByTypeChartTitle'),
        chartDescription: t('supportByTypeChartDescription'),
        categories: supportByType.stats.sectors.map((sector: string) =>
          sector === null ? 'No Type Attached' : sector
        ),
        values: supportByType.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: supportByType.lastUpdate,
      });

      setSupportByActivityStatusChart({
        chartId: 8,
        chartTitle: t('supportByActivityStatusChartTitle'),
        chartDescription: t('supportByActivityStatusChartDescription'),
        categories: supportByActivityStatus.stats.sectors.map((sector: string) => {
          if (sector === 'Planned') return 'Planirano';
          if (sector === 'Ongoing') return 'U toku';
          if (sector === 'Completed') return 'Završeno';
          return sector === null ? 'No Status Attached' : sector;
        }),
        values: supportByActivityStatus.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: supportByActivityStatus.lastUpdate,
      });

      setSupportByETFSectorChart({
        chartId: 9,
        chartTitle: t('supportByETFSectorChartTitle'),
        chartDescription: t('supportByETFSectorChartDescription'),
        categories: supportByETFSector.stats.sectors.map((sector: string) => {
          if (sector === 'Energy') return 'Energija';
          if (sector === 'Transport') return 'Transport';
          if (sector === 'Industry (IPPU)') return 'Industrija';
          if (sector === 'Agriculture') return 'Poljoprivreda';
          return sector === null ? 'No Sector Attached' : sector;
        }),
        values: supportByETFSector.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: supportByETFSector.lastUpdate,
      });

      setSupportByFinancialInstrumentChart({
        chartId: 10,
        chartTitle: t('supportByFinancialInstrumentChartTitle'),
        chartDescription: t('supportByFinancialInstrumentChartDescription'),
        categories: supportByFinancialInstrument.stats.sectors.map((sector: string) => {
          if (sector === 'grant') return 'Grant';
          if (sector === 'concessional-loan') return 'Koncesioni zajam';
          if (sector === 'non-concessional-loan') return 'Nekoncesioni zajam';
          if (sector === 'equity') return 'Equity';
          if (sector === 'guarantee') return 'Garancija';
          if (sector === 'insurance') return 'Osiguranje';
          if (sector === 'other') return 'Ostalo';
          return sector === null ? 'No Instrument Attached' : sector;
        }),
        values: supportByFinancialInstrument.stats.counts.map((count: string) =>
          parseInt(count, 10)
        ),
        lastUpdatedTime: supportByFinancialInstrument.lastUpdate,
      });

      setSupportByFinancingChannelChart({
        chartId: 11,
        chartTitle: t('supportByFinancingChannelChartTitle'),
        chartDescription: t('supportByFinancingChannelChartDescription'),
        categories: supportByFinancingChannel.stats.sectors.map((sector: string) => {
          if (sector === 'Multilateral') return 'Multilateralni';
          if (sector === 'Bilateral') return 'Bilateralni';
          if (sector === 'Regional') return 'Regionalni';
          if (sector === 'Other') return 'Ostalo';
          return sector === null ? 'No Channel Attached' : sector;
        }),
        values: supportByFinancingChannel.stats.counts.map((count: string) => parseInt(count, 10)),
        lastUpdatedTime: supportByFinancingChannel.lastUpdate,
      });
    } catch (error: any) {
      displayErrorMessage(error);
    }
  };

  // Action List Table Columns

  const columns = getActionTableColumns(t);

  // Handling Table Pagination and Sorting Changes

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // Setting Pagination
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Data Fetching for GHG MTG Selected Year

  useEffect(() => {
    getIndividualMitigationChartData();
  }, [mtgYear]);

  useEffect(() => {
    getAllData();
  }, [currentPage, pageSize]);

  // Data Fetching for Support Charts when filter changes

  useEffect(() => {
    // Reset chart data to show loading state
    setSupportByTypeChart(undefined);
    setSupportByActivityStatusChart(undefined);
    setSupportByETFSectorChart(undefined);
    setSupportByFinancialInstrumentChart(undefined);
    setSupportByFinancingChannelChart(undefined);

    // Fetch all charts in one batch request
    getAllSupportChartsData();
  }, [typeOfSupportFilter]);

  // Init Job

  useEffect(() => {
    getClimateActionChartData();
    getProjectChartData();
    getSupportChartData();
    getFinanceChartData();
    getRecentMitigationChartData();
    // Also fetch the new support charts on init (batch request)
    getAllSupportChartsData();
  }, []);

  return (
    <div className="dashboard-page">
      <div>
        <ChartInformation
          open={openChartInfo}
          setOpen={setOpenChartInfo}
          content={chartContent}
        ></ChartInformation>

        <Row gutter={30}>
          {/* CBT Support Charts Container - Full Width with Filter and 5 Pies */}
          <Col span={24} className="gutter-row" style={{ marginBottom: 30 }}>
            <div className="chart-section-card">
              {/* Filter Row */}
              <div style={{ padding: '15px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <Row gutter={30} align="middle">
                  <Col xs={24} sm={8} md={6} lg={4}>
                    <span style={{ fontWeight: 500 }}>{t('typeOfSupportFilter')}:</span>
                  </Col>
                  <Col xs={24} sm={16} md={18} lg={20}>
                    <Select
                      style={{ width: '100%', maxWidth: 300 }}
                      placeholder={t('selectTypeOfSupport')}
                      allowClear
                      onChange={(value) => setTypeOfSupportFilter(value)}
                      value={typeOfSupportFilter}
                    >
                      <Option value="Adaptation">{t('adaptation')}</Option>
                      <Option value="Mitigation">{t('mitigation')}</Option>
                      <Option value="CrossCutting">{t('crossCutting')}</Option>
                    </Select>
                  </Col>
                </Row>
              </div>

              <div style={{ padding: '20px' }}>
                <Row gutter={[32, 32]} justify="center">
                  <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    {!supportByTypeChart ? (
                      <CompactChartLoadingPlaceholder t={t} title={t('supportByTypeChartTitle')} />
                    ) : (
                      <CompactPieChart
                        chart={supportByTypeChart}
                        onInfoClick={setChartContent}
                        setOpenChartInfo={setOpenChartInfo}
                        t={t}
                      />
                    )}
                  </Col>
                  <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    {!supportByActivityStatusChart ? (
                      <CompactChartLoadingPlaceholder
                        t={t}
                        title={t('supportByActivityStatusChartTitle')}
                      />
                    ) : (
                      <CompactPieChart
                        chart={supportByActivityStatusChart}
                        onInfoClick={setChartContent}
                        setOpenChartInfo={setOpenChartInfo}
                        t={t}
                      />
                    )}
                  </Col>
                  <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    {!supportByETFSectorChart ? (
                      <CompactChartLoadingPlaceholder
                        t={t}
                        title={t('supportByETFSectorChartTitle')}
                      />
                    ) : (
                      <CompactPieChart
                        chart={supportByETFSectorChart}
                        onInfoClick={setChartContent}
                        setOpenChartInfo={setOpenChartInfo}
                        t={t}
                      />
                    )}
                  </Col>
                  <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    {!supportByFinancialInstrumentChart ? (
                      <CompactChartLoadingPlaceholder
                        t={t}
                        title={t('supportByFinancialInstrumentChartTitle')}
                      />
                    ) : (
                      <CompactPieChart
                        chart={supportByFinancialInstrumentChart}
                        onInfoClick={setChartContent}
                        setOpenChartInfo={setOpenChartInfo}
                        t={t}
                      />
                    )}
                  </Col>
                  <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    {!supportByFinancingChannelChart ? (
                      <CompactChartLoadingPlaceholder
                        t={t}
                        title={t('supportByFinancingChannelChartTitle')}
                      />
                    ) : (
                      <CompactPieChart
                        chart={supportByFinancingChannelChart}
                        onInfoClick={setChartContent}
                        setOpenChartInfo={setOpenChartInfo}
                        t={t}
                      />
                    )}
                  </Col>
                </Row>
              </div>
            </div>
          </Col>

          <Col key={'chart_1'} className="gutter-row" {...dashboardHalfColumnBps}>
            <div className="chart-section-card">
              {actionChart && (
                <>
                  <div className="chart-title">
                    <Row gutter={30}>
                      <Col span={22}>{actionChart.chartTitle}</Col>
                      <Col span={2}>
                        <InfoCircleOutlined
                          onClick={() => {
                            setChartContent({
                              title: actionChart.chartTitle,
                              body: actionChart.chartDescription,
                            });
                            setOpenChartInfo(true);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <PieChart chart={actionChart} t={t} chartWidth={chartWidth} />
                </>
              )}
            </div>
          </Col>
          <Col key={'chart_2'} className="gutter-row" {...dashboardHalfColumnBps}>
            <div className="chart-section-card">
              {projectChart && (
                <>
                  <div className="chart-title">
                    <Row gutter={30}>
                      <Col span={22}>{projectChart.chartTitle}</Col>
                      <Col span={2}>
                        <InfoCircleOutlined
                          onClick={() => {
                            setChartContent({
                              title: projectChart.chartTitle,
                              body: projectChart.chartDescription,
                            });
                            setOpenChartInfo(true);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <PieChart chart={projectChart} t={t} chartWidth={chartWidth} />
                </>
              )}
            </div>
          </Col>
          <Col key={'chart_3'} className="gutter-row" {...dashboardHalfColumnBps}>
            <div className="chart-section-card">
              {supportChart && (
                <>
                  <div className="chart-title">
                    <Row gutter={30}>
                      <Col span={22}>{supportChart.chartTitle}</Col>
                      <Col span={2}>
                        <InfoCircleOutlined
                          onClick={() => {
                            setChartContent({
                              title: supportChart.chartTitle,
                              body: supportChart.chartDescription,
                            });
                            setOpenChartInfo(true);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <PieChart chart={supportChart} t={t} chartWidth={chartWidth} />
                </>
              )}
            </div>
          </Col>
          <Col key={'chart_4'} className="gutter-row" {...dashboardHalfColumnBps}>
            <div className="chart-section-card">
              {financeChart && (
                <>
                  <div className="chart-title">
                    <Row gutter={30}>
                      <Col span={22}>{financeChart.chartTitle}</Col>
                      <Col span={2}>
                        <InfoCircleOutlined
                          onClick={() => {
                            setChartContent({
                              title: financeChart.chartTitle,
                              body: financeChart.chartDescription,
                            });
                            setOpenChartInfo(true);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <PieChart chart={financeChart} t={t} chartWidth={chartWidth} />
                </>
              )}
            </div>
          </Col>
          <Col key={'chart_5'} className="gutter-row" {...dashboardHalfColumnBps}>
            <div className="chart-section-card">
              {mitigationIndividualChart && (
                <>
                  <div className="chart-title">
                    <Row gutter={30}>
                      <Col span={17}>{mitigationIndividualChart.chartTitle}</Col>
                      <Col span={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Select
                          size="small"
                          style={{ fontSize: '13px' }}
                          defaultValue={mtgYear}
                          showSearch
                          onChange={(value) => {
                            setMtgYear(value);
                          }}
                        >
                          {yearsList.map((year) => (
                            <Option key={year} value={year}>
                              {year}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col span={2}>
                        <InfoCircleOutlined
                          onClick={() => {
                            setChartContent({
                              title: mitigationIndividualChart.chartTitle,
                              body: mitigationIndividualChart.chartDescription,
                            });
                            setOpenChartInfo(true);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <BarChart chart={mitigationIndividualChart} t={t} chartHeight={chartHeight} />
                </>
              )}
            </div>
          </Col>
          <Col key={'chart_6'} className="gutter-row" {...dashboardHalfColumnBps}>
            <div className="chart-section-card">
              {mitigationRecentChart && (
                <>
                  <div className="chart-title">
                    <Row gutter={30}>
                      <Col span={17}>{mitigationRecentChart.chartTitle}</Col>
                      <Col span={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Tag className="year-chip">{new Date().getFullYear() - 1}</Tag>
                      </Col>
                      <Col span={2}>
                        <InfoCircleOutlined
                          onClick={() => {
                            setChartContent({
                              title: mitigationRecentChart.chartTitle,
                              body: mitigationRecentChart.chartDescription,
                            });
                            setOpenChartInfo(true);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <BarChart chart={mitigationRecentChart} t={t} chartHeight={chartHeight} />
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <div className="content-card">
        <Row gutter={30}>
          <Col span={24}>
            <LayoutTable
              tableData={tableData}
              columns={columns}
              loading={loading}
              pagination={{
                total: totalRowCount,
                current: currentPage,
                pageSize: pageSize,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '30'],
                showSizeChanger: true,
                style: { textAlign: 'center' },
                locale: { page: '' },
                position: ['bottomRight'],
              }}
              handleTableChange={handleTableChange}
              emptyMessage={t('noActionsAvailable')}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
