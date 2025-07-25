import { Tabs } from 'antd';
import './combinedExpected.scss';
import { useTranslation } from 'react-i18next';
import { ProjectionType } from '../../Enums/projection.enum';
import { ExpectedGhgReductionTable } from '../../Components/Inventory/expectedGhgReductionTable';

const combinedExpected = () => {
  // Page Context

  const { t } = useTranslation(['combinedExpected']);

  const items = [
    {
      key: '1',
      label: t('withMeasuresTitle'),
      children: (
        <ExpectedGhgReductionTable index={1} projectionType={ProjectionType.WITH_MEASURES} />
      ),
    },
    {
      key: '2',
      label: t('withAdditionalMeasuresTitle'),
      children: (
        <ExpectedGhgReductionTable
          index={1}
          projectionType={ProjectionType.WITH_ADDITIONAL_MEASURES}
        />
      ),
    },
    {
      key: '3',
      label: t('withoutMeasuresTitle'),
      children: (
        <ExpectedGhgReductionTable index={1} projectionType={ProjectionType.WITHOUT_MEASURES} />
      ),
    },
  ];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">{t('combinedExpectedTitle')}</div>
      </div>
      <div className="combined-expected-section-card">
        <Tabs defaultActiveKey="1" centered items={items} />
      </div>
    </div>
  );
};

export default combinedExpected;
