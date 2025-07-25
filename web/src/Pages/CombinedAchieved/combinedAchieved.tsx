import { Tabs } from 'antd';
import './combinedAchieved.scss';
import { useTranslation } from 'react-i18next';
import { AchievedGhgReductionTable } from '../../Components/Inventory/achievedGhgReductionTable';
import { ReductionType } from '../../Enums/reduction.enum';

const combinedAchieved = () => {
  // Page Context

  const { t } = useTranslation(['combinedAchieved']);

  const items = [
    {
      key: '1',
      label: t('baselineEmissionsTitle'),
      children: (
        <AchievedGhgReductionTable index={1} reductionType={ReductionType.BASELINE_EMISSIONS} />
      ),
    },
    {
      key: '2',
      label: t('ActivityEmissionsTitle'),
      children: (
        <AchievedGhgReductionTable index={1} reductionType={ReductionType.ACTIVITY_EMISSIONS} />
      ),
    },
    {
      key: '3',
      label: t('equivalentEmissionReductionsTitle'),
      children: (
        <AchievedGhgReductionTable
          index={1}
          reductionType={ReductionType.EQUIVALENT_EMISSION_REDUCTIONS}
        />
      ),
    },
  ];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">{t('combinedAchievedTitle')}</div>
      </div>
      <div className="combined-achieved-section-card">
        <Tabs defaultActiveKey="1" centered items={items} />
      </div>
    </div>
  );
};

export default combinedAchieved;
