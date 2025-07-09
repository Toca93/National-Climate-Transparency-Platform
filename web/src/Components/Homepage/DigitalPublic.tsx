import { motion } from 'framer-motion';
import './Dashboard.scss';
import { Trans, useTranslation } from 'react-i18next';

import publicGoodImage from '../../Assets/Images/public-good.jpg';

const DigitalPublicGood = () => {
  const { i18n, t } = useTranslation(['common', 'homepage']);
  return (
    <div className="digital-public-good">
      <h2 className="header-title">{t('homepage:digitalPublicTitle')}</h2>

      <div className="image-containers">
        <img src={publicGoodImage} alt="A Digital Public Good" className="main-image" />

        <motion.div
          className="image-caption"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Trans
            i18nKey={'homepage:digitalPublicBody'}
            components={{
              a1: <a href="https://digitalpublicgoods.net/digital-public-goods/" target="_blank" />,
              a2: (
                <a
                  href="https://github.com/undp/National-Climate-Transparency-Platform"
                  target="_blank"
                />
              ),
            }}
          >
            In response to countries’ need for support, UNDP has created the National Climate
            Transparency Platform as an open-source toolkit that follows the
            <a href="https://digitalpublicgoods.net/digital-public-goods/" target="_blank">
              Digital Public Goods Standard.
            </a>
            . Countries can access the free, open-source code and installation instructions
            <a
              href="https://github.com/undp/National-Climate-Transparency-Platform"
              target="_blank"
            >
              from UNDP’s managed Github
            </a>
            to customize their own Transparency Platform according to national needs. This approach
            helps save time, reduce costs, and avoids duplication of effort.
          </Trans>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalPublicGood;
