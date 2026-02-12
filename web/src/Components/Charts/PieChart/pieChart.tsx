import { Empty, Tag } from 'antd';
import Chart from 'react-apexcharts';
import {
  CustomFormatDate,
  DashboardTotalFormatter,
  getArraySum,
} from '../../../Utils/utilServices';
import { ChartData, chartColorMappings } from '../../../Definitions/dashboard.definitions';
import { useEffect, useState } from 'react';

interface Props {
  chart: ChartData;
  t: any;
  chartWidth: number;
  showDate?: boolean;
  isCompact?: boolean;
}

const PieChart: React.FC<Props> = ({
  chart,
  t,
  chartWidth,
  showDate = true,
  isCompact = false,
}) => {
  // Screen Dimension Context

  // Pie Chart General State

  const [total, setTotal] = useState<number>(0);
  const [chartColorMapping, setChartColorMapping] = useState<string[]>([]);

  // Setting the Total value

  useEffect(() => {
    const arraySum = getArraySum(chart.values);
    setTotal(arraySum);
  }, [chart.values]);

  // Setting the Color Mapping

  useEffect(() => {
    let tempChartColorMapping: string[];

    switch (chart.chartId) {
      case 1:
      case 2:
      case 5:
      case 6:
        tempChartColorMapping = chartColorMappings.sectors;
        break;
      case 3:
        tempChartColorMapping = chartColorMappings.support;
        break;
      case 4:
        tempChartColorMapping = chartColorMappings.finance;
        break;
      case 7:
        tempChartColorMapping = chartColorMappings.typeOfSupport;
        break;
      case 8:
        tempChartColorMapping = chartColorMappings.activityStatus;
        break;
      case 9:
        tempChartColorMapping = chartColorMappings.etfSector;
        break;
      case 10:
        tempChartColorMapping = chartColorMappings.finInstrument;
        break;
      case 11:
        tempChartColorMapping = chartColorMappings.financingChannel;
        break;
      default:
        tempChartColorMapping = chartColorMappings.sectors;
    }

    setChartColorMapping(tempChartColorMapping);
  }, [chart.chartId]);

  return (
    <div className="pie-chart">
      {total > 0 ? (
        <>
          <Chart
            type="donut"
            options={{
              labels: chart.categories,
              colors: chartColorMapping,
              dataLabels: {
                enabled: false,
              },
              tooltip: {
                enabled: false,
              },
              plotOptions: {
                pie: {
                  donut: {
                    size: isCompact ? '75%' : '65%',
                    labels: {
                      show: true,
                      name: {
                        show: true,
                        formatter: (name) => (name.length > 12 ? `${name.slice(0, 12)}...` : name),
                      },
                      value: {
                        show: true,
                        formatter: (value) =>
                          chart.chartId === 4 ? `$ ${Math.round(parseFloat(value))}` : value,
                      },
                      total: {
                        show: true,
                        label: 'Total',
                        color: '#373d3f',
                        fontWeight: 500,
                        fontSize: isCompact ? '13px' : '14px',
                        formatter: function (w) {
                          return DashboardTotalFormatter(
                            w.globals.seriesTotals.reduce((a: number, b: number) => {
                              return a + b;
                            }, 0),
                            chart.chartId === 4 ? true : false
                          );
                        },
                      },
                    },
                  },
                },
              },
              legend: {
                width: isCompact ? 120 : 200,
                fontSize: isCompact ? '11px' : '12px',
                position: 'right',
                floating: false,
                offsetY: isCompact ? 10 : 0,
                itemMargin: {
                  horizontal: 8,
                  vertical: isCompact ? 4 : 0,
                },
              },
            }}
            series={chart.values}
            width={chartWidth}
          />
          {showDate && (
            <div className="chart-update-time">
              <Tag className="time-chip">{CustomFormatDate(chart.lastUpdatedTime)}</Tag>
            </div>
          )}
        </>
      ) : isCompact ? (
        <div
          style={{ height: 188, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Empty
            className="empty-chart-compact"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('noChartDataAvailable')}
          />
        </div>
      ) : (
        <Empty
          className={
            chartWidth === 560
              ? 'empty-chart-xxl'
              : chartWidth === 480
              ? 'empty-chart-xl'
              : 'empty-chart'
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('noChartDataAvailable')}
        />
      )}
    </div>
  );
};

export default PieChart;
