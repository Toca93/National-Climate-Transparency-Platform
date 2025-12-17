import { Tabs } from 'antd';
import './combinedExpected.scss';
import { useTranslation } from 'react-i18next';
import { ProjectionType } from '../../Enums/projection.enum';
import { ExpectedGhgReductionTable } from '../../Components/Inventory/expectedGhgReductionTable';
import { useState } from 'react';

const combinedExpected = () => {
  // Page Context

  const { t } = useTranslation(['combinedExpected']);
  const [selectedTab, setSelectedTab] = useState(1);

  const items = [
    {
      key: '1',
      label: t('withMeasuresTitle'),
      title: t('withMeasuresInfoTitle'),
      children: (
        <ExpectedGhgReductionTable index={1} projectionType={ProjectionType.WITH_MEASURES} />
      ),
    },
    {
      key: '2',
      label: t('withAdditionalMeasuresTitle'),
      title: t('withAdditionalMeasuresInfoTitle'),
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
      title: t('withoutMeasuresInfoTitle'),
      children: (
        <ExpectedGhgReductionTable index={1} projectionType={ProjectionType.WITHOUT_MEASURES} />
      ),
    },
  ];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">{t('combinedExpectedTitle')}</div>
        <div className="body-subtitle">{items[selectedTab - 1]?.title}</div>
      </div>
      <div className="combined-expected-section-card">
        <Tabs
          defaultActiveKey="1"
          centered
          items={items}
          onChange={(e) => {
            setSelectedTab(parseInt(e));
          }}
        />
      </div>
    </div>
  );
};

export default combinedExpected;
