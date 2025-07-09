import React from 'react';
import { Mail, CheckCircle, Hammer, Wallet } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

// Invisible SVG that defines the linear gradient
const GradientDefs = () => (
  <svg width="0" height="0">
    <defs>
      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0063AC" />
        <stop offset="100%" stopColor="#003257" />
      </linearGradient>
    </defs>
  </svg>
);

const ProcessFlow = () => {
  const { i18n, t } = useTranslation('homepage');
  return (
    <div className="process-flow-container">
      {/* Inject the gradient definition once */}
      <GradientDefs />

      <h2 className="process-flow-title">{t('howDoesItWork.Title')}</h2>
      <p className="process-flow-description">
        <Trans i18nKey={'homepage:howDoesItWork.description'}></Trans>
      </p>
    </div>
  );
};

export default ProcessFlow;
