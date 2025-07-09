import { Trans, useTranslation } from 'react-i18next';
import './WhyThisplatform.scss';

const WhyThisPlatform = () => {
  const { t } = useTranslation(['homepage']);
  return (
    <div className="why-this-platform section">
      <div className="why-this-platform-content">
        <h2 className="header-title">{t('homepage:whyThisPlatform.title')}</h2>
        <p className="why-this-platform-description">
          <Trans i18nKey="homepage:whyThisPlatform.description">
            <p>
              Article 13 of the Paris Agreement establishes the Enhanced Transparency Framework
              (ETF) to ensure that all Parties provide clear, consistent, and comparable information
              on their climate actions and support.
              <br />
              Governments are required to submit Biennial Transparency Reports (BTRs), which include
              data on greenhouse gas emissions, progress toward nationally determined contributions
              (NDCs), adaptation efforts, and support provided or received. This reporting enables
              international review and accountability, helping build trust and track global progress
              toward climate goals. Due to the volume and complexity of national information
              required under the ETF, digital systems such as this are essential to help countries
              consolidate and report information efficiently and effectively. <br />
              The open-source National Climate Transparency Platform currently supports longitudinal
              data collection and automated reporting of common tabular formats for Annex III
              (Decision 5/CMA.3), with potential to expand to Annex II formats in future releases.
            </p>
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default WhyThisPlatform;
