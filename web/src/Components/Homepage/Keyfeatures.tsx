import './Dashboard.scss';
import { LayoutDashboard, Table2, Workflow, UsersRound, WindArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureCards = () => {
  const { t } = useTranslation('homepage');
  return (
    <div className="feature-cards-containerout">
      <div className="feature-cards-container">
        <h2 className="header-title-2">{t('features.heading')}</h2>

        <div className="feature-cards-grid">
          {/* First Row - 2 Large Cards */}
          <div className="feature-cards-item feature-cards-large">
            <div className="feature-cards-icon">
              {/* <UserRoundCheck /> */}
              <UsersRound />
            </div>
            <h3 className="feature-cards-heading">{t('feature.1.title')}</h3>
            <p className="feature-cards-text">{t('feature.1.description')}</p>
          </div>

          <div className="feature-cards-item feature-cards-large">
            <div className="feature-cards-icon">
              <LayoutDashboard />
            </div>
            <h3 className="feature-cards-heading">{t('feature.2.title')}</h3>
            <p className="feature-cards-text">{t('feature.2.description')}</p>
          </div>

          {/* Second Row - 3 Small Cards */}
          <div className="feature-cards-item feature-cards-small">
            <div className="feature-cards-icon">
              <Workflow />
            </div>
            <h3 className="feature-cards-heading">{t('feature.3.title')}</h3>
            <p className="feature-cards-text">{t('feature.3.description')}</p>
          </div>

          <div className="feature-cards-item feature-cards-small">
            <div className="feature-cards-icon">
              {/* <ChartColumnBig /> */}
              <Table2 />
            </div>
            <h3 className="feature-cards-heading">{t('feature.4.title')}</h3>
            <p className="feature-cards-text">{t('feature.4.description')}</p>
          </div>

          <div className="feature-cards-item feature-cards-small">
            <div className="feature-cards-icon">
              <WindArrowDown />
            </div>
            <h3 className="feature-cards-heading">{t('feature.5.title')}</h3>
            <p className="feature-cards-text">{t('feature.5.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
