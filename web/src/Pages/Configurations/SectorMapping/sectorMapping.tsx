import { FC } from 'react';
import '../configurations.scss';
import { useTranslation } from 'react-i18next';
import SectorConfigTable from '../../../Components/Inventory/sectorConfigTable';

const SectorMapping: FC = () => {
  const { t } = useTranslation(['configuration']);
  return (
    <div className="configuration-section-card">
      <div className="form-section-header sectors">{t('sectorMappingConfigurationTitle')}</div>
      <div className="form-section-subheader">{t('sectorMappingDescription')}</div>
      <SectorConfigTable />
    </div>
  );
};

export default SectorMapping;
