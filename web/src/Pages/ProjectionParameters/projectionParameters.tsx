import { useTranslation } from 'react-i18next';
import { ProjectionParameters } from '../../Components/Inventory/ProjectionParameters';
import './projectionParameters.scss';

const GhgProjectionParameters = () => {
  const { t } = useTranslation(['projection']);

  return (
    <div className="content-container projection-parameters-page">
      <div className="title-bar">
        <div className="body-title">{t('projectionParametersTitle')}</div>
      </div>
      <ProjectionParameters />
    </div>
  );
};

export default GhgProjectionParameters;
