import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PieChart from '../Charts/PieChart/pieChart';
import ChartInformation from '../Popups/chartInformation';
import { ChartData } from '../../Definitions/dashboard.definitions';
import { useTranslation } from 'react-i18next';
import { dashboardHalfColumnBps } from '../../Definitions/breakpoints/breakpoints';
import './TransparencyDashboardDemo.scss';

const TransparencyDashboardDemo: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'actionList', 'columnHeader', 'homepage']);
  const [openChartInfo, setOpenChartInfo] = useState(false);
  const [chartContent, setChartContent] = useState({
    title: '',
    body: '',
  });
  const [chartWidth, setChartWidth] = useState<number>(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateWidth() {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth * 0.65);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const actionChart: ChartData = {
    chartTitle: t('dashboard:actionChartTitle'),
    chartDescription: t('dashboard:actionChartDescription'),
    chartId: 1,
    categories: [
      'Agriculture',
      'Cross-cutting',
      'Energy',
      'Forestry',
      'Transport',
      'Industry (IPPU)',
      'Land Use',
      'Water and Sanitation',
      'Other',
    ],
    values: [32, 15, 9, 18, 32, 15, 9, 18, 5],
    lastUpdatedTime: Date.now() / 1000,
  };
  const projectChart: ChartData = {
    chartTitle: t('dashboard:projectChartTitle'),
    chartDescription: t('dashboard:projectChartDescription'),
    chartId: 2,
    categories: [
      'Agriculture',
      'Cross-cutting',
      'Energy',
      'Forestry',
      'Transport',
      'Industry (IPPU)',
      'Land Use',
      'Water and Sanitation',
      'Other',
    ],
    values: [50, 20, 10, 15, 25, 10, 5, 10, 2],
    lastUpdatedTime: Date.now() / 1000,
  };
  const supportChart: ChartData = {
    chartTitle: t('dashboard:supportChartTitle'),
    chartDescription: t('dashboard:supportChartDescription'),
    chartId: 3,
    categories: ['Support Received', 'Support Needed'],
    values: [12, 17],
    lastUpdatedTime: Date.now() / 1000,
  };
  const financeChart: ChartData = {
    chartTitle: t('dashboard:financeChartTitle'),
    chartDescription: t('dashboard:financeChartDescription'),
    chartId: 4,
    categories: ['Support Received', 'Support Needed'],
    values: [5527000, 3022000],
    lastUpdatedTime: Date.now() / 1000,
  };

  return (
    <div className="transparency-demo-dashboard section">
      <h2 className="header-title">{t('homepage:dashboard.title')}</h2>
      <div>
        <ChartInformation
          open={openChartInfo}
          setOpen={setOpenChartInfo}
          content={chartContent}
        ></ChartInformation>
        <Row className="chart-section-card-wrapper" gutter={30}>
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
        </Row>
      </div>
    </div>
  );
};

export default TransparencyDashboardDemo;
