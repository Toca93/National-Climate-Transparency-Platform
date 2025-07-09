import React from 'react';
import './Dashboard.scss';
import i18next from 'i18next';
import { Trans, useTranslation } from 'react-i18next';

const DemoSite = () => {
  const { t } = useTranslation('homepage');
  return (
    <div className="demo-site-container">
      <h1 className="header-title">{t('demoSite.title')}</h1>
      <div className="demo-site-card"></div>

      <div className="demo-site-content">
        <div className="demo-site-text">
          <Trans
            i18nKey={'homepage:demoSite.description'}
            components={{
              b: <strong />,
              u: <u />,
              li: <li />,
              a1: <a href="#" className="link" />,
              a2: <a href="mailto:digital4planet@undp.org" className="link" />,
              ul: <ul className="feature-list" />,
              a3: (
                <a
                  href="https://github.com/undp/National-Climate-Transparency-Platform"
                  className="link"
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DemoSite;
