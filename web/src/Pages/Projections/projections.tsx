import { Select, Tabs } from 'antd';
import './projection.scss';
import { useTranslation } from 'react-i18next';
import { ProjectionForm } from '../../Components/Inventory/projectionForm';
import { ProjectionType } from '../../Enums/projection.enum';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { displayErrorMessage } from '../../Utils/errorMessageHandler';

const GhgProjections = () => {
  // Page Context

  const { t } = useTranslation(['projection', 'configuration']);
  const { get } = useConnection();

  const [availableBaseYears, setAvailableBaseYears] = useState<number[]>([]);
  const [selectedBaseYear, setSelectedBaseYear] = useState<number>(2000);

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
        <Tabs defaultActiveKey="1" centered items={items} />
      </div>
    </div>
  );
};

export default GhgProjections;
