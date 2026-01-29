import { Button, message, Select, Tabs } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './projection.scss';
import { useTranslation } from 'react-i18next';
import { ProjectionForm } from '../../Components/Inventory/projectionForm';
import { ProjectionType } from '../../Enums/projection.enum';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { displayErrorMessage } from '../../Utils/errorMessageHandler';

// Scenario type mapping for export
const TAB_TO_SCENARIO: Record<string, string> = {
  '1': 'WM', // With Measures
  '2': 'WAM', // With Additional Measures
  '3': 'WOM', // Without Measures
};

const GhgProjections = () => {
  // Page Context

  const { t } = useTranslation(['projection', 'configuration', 'report']);
  const { get } = useConnection();

  const [availableBaseYears, setAvailableBaseYears] = useState<number[]>([]);
  const [selectedBaseYear, setSelectedBaseYear] = useState<number>(2000);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('1');

  const getAvailableBaseYears = useCallback(async () => {
    try {
      const response: any = await get('national/emissions/summary/available');
      if (response.status === 200 || response.status === 201) {
        const years: number[] = (response.data ?? [])
          .map((report: any) => Number(report?.year))
          .filter((y: unknown): y is number => typeof y === 'number' && Number.isFinite(y))
          .sort((a: number, b: number) => a - b);

        // Deduplicate just in case.
        const uniqueYears: number[] = Array.from(new Set<number>(years));
        setAvailableBaseYears(uniqueYears);

        // Default to the most recent available year (common expectation for "base year").
        if (uniqueYears.length > 0) {
          setSelectedBaseYear(uniqueYears[uniqueYears.length - 1]);
        }
      }
    } catch (error: any) {
      // Keep a safe default so the page stays usable even if the fetch fails.
      displayErrorMessage(error);
    }
  }, [get]);

  useEffect(() => {
    getAvailableBaseYears();
  }, [getAvailableBaseYears]);

  // Export projections to Excel based on active tab
  const handleExportProjections = useCallback(async () => {
    const scenarioType = TAB_TO_SCENARIO[activeTab];
    setIsExporting(true);
    try {
      const response: any = await get(`national/projections/export?scenarioType=${scenarioType}`, {
        responseType: 'blob',
      });

      if (response.status === 200 || response.status === 201) {
        // Create blob from response data
        const blob = new Blob([response.response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ghg-projections-${scenarioType}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        message.success('Export successful');
      }
    } catch (error: any) {
      if (error?.status === 404) {
        message.warning('No projection data available for this scenario');
      } else {
        displayErrorMessage(error);
      }
    } finally {
      setIsExporting(false);
    }
  }, [get, activeTab]);

  const baseYearOptions = useMemo(
    () => availableBaseYears.map((y) => ({ value: y, label: y.toString() })),
    [availableBaseYears]
  );

  const items = useMemo(
    () => [
      {
        key: '1',
        label: t('withMeasuresTitle'),
        children: <ProjectionForm index={1} projectionType={ProjectionType.WITH_MEASURES} />,
      },
      {
        key: '2',
        label: t('withAdditionalMeasuresTitle'),
        children: (
          <ProjectionForm index={1} projectionType={ProjectionType.WITH_ADDITIONAL_MEASURES} />
        ),
      },
      {
        key: '3',
        label: t('withoutMeasuresTitle'),
        children: <ProjectionForm index={1} projectionType={ProjectionType.WITHOUT_MEASURES} />,
      },
    ],
    [t]
  );

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">{t('projectionTitle')}</div>
      </div>
      <div className="projection-section-card">
        <div className="projection-toolbar">
          <div className="projection-toolbar-row">
            <div className="base-year-group">
              <div className="base-year-label">{t('configuration:baselineYear')}</div>
              <Select<number>
                className="projection-base-year-select"
                value={selectedBaseYear}
                options={baseYearOptions}
                onChange={(year: number) => setSelectedBaseYear(year)}
                aria-label={String(t('configuration:baselineYear'))}
                showSearch
                optionFilterProp="label"
                disabled={availableBaseYears.length === 0}
              />
            </div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportProjections}
              loading={isExporting}
              className="export-excel-button"
            >
              {t('report:exportAsExcel')}
            </Button>
          </div>
        </div>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={items}
        />
      </div>
    </div>
  );
};

export default GhgProjections;
