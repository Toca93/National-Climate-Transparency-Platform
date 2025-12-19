import { motion } from 'framer-motion';
import './Dashboard.scss';
import { Trans, useTranslation } from 'react-i18next';

const DigitalPublicGood = () => {
  const { i18n, t } = useTranslation(['common', 'homepage']);
  return (
    <div className="digital-public-good-text">
      <h2 className="header-title">{t('homepage:digitalPublicTitle')}</h2>

      <motion.div
        className="digital-public-description"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <Trans
          i18nKey={'homepage:digitalPublicBody'}
          components={{
            a2: (
              <a
                href="https://github.com/undp/National-Climate-Transparency-Platform"
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}
        />
      </motion.div>
    </div>
  );
};

export default DigitalPublicGood;
