import './Vision.scss';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Time } from '../../Assets/Images/gov.svg';
import { ReactComponent as Capacity } from '../../Assets/Images/projdev.svg';
import { ReactComponent as Certifier } from '../../Assets/Images/certif.svg';

const Vision = () => {
  const { t } = useTranslation(['homepage']);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Row className="vision">
      <Col>
        <section className="vision-section" id="vision" ref={ref}>
          <motion.div
            className="vision-container"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="vision-title">{t('visionTitle')}</h2>
            <p className="vision-description">{t('visionDescrption')}</p>
            <h3 className="vision-subtitle">{t('visionSubtitle')}</h3>

            <div className="vision-grid">
              <motion.div
                className="vision-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="vision-icon">
                  <Time className="vislogo" />
                </div>
                <p className="vision-role">{t('visionSupTitle1')}</p>
                <p className="vision-text">{t('visionSupSubtitle1')}</p>
              </motion.div>

              <motion.div
                className="vision-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="vision-icon">
                  <Capacity className="vislogo" />
                </div>
                <p className="vision-role">{t('visionSupTitle2')}</p>
                <p className="vision-text">{t('visionSupSubtitle2')}</p>
              </motion.div>

              <motion.div
                className="vision-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="vision-icon">
                  <Certifier className="vislogo" />
                </div>
                <p className="vision-role">{t('visionSupTitle3')}</p>
                <p className="vision-text">{t('visionSupSubtitle3')}</p>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </Col>
    </Row>
  );
};

export default Vision;
