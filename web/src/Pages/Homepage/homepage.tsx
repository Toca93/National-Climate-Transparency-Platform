import { Button, Col, Collapse, CollapseProps, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import i18next from 'i18next';
import sliderLogo from '../../Assets/Images/mrvlogo.svg';
import heroImage1 from '../../Assets/Images/homepage_img.webp';
import heroImage2 from '../../Assets/Images/homepage_img2.webp';
import heroImage3 from '../../Assets/Images/homepage_img3.webp';
// import undpLogo from '../../Assets/Images/undp1.webp';
// import EBRD from '../../Assets/Images/EBRD.webp';
// import EBRDff from '../../Assets/Images/EBRD.png';
// import UNFCCC from '../../Assets/Images/UNFCCC.webp';
// import UNFCCCff from '../../Assets/Images/UNFCCC.png';
// import IETA from '../../Assets/Images/IETA.webp';
// import IETAff from '../../Assets/Images/IETA.png';
// import ESA from '../../Assets/Images/ESA.webp';
// import ESAff from '../../Assets/Images/ESA.png';
// import WBANK from '../../Assets/Images/WBANK.webp';
// import WBANKff from '../../Assets/Images/WBANK.png';
// import forestfall from '../../Assets/Images/forestnew.png';
// import resources from '../../Assets/Images/resources.webp';
// import resourcesfall from '../../Assets/Images/resources.png';
import LayoutFooter from '../../Components/Footer/layout.footer';
// import { ImgWithFallback } from '@undp/carbon-library';
import './homepage.scss';
import ProcessFlow from '../../Components/Homepage/Howdoesitwork';
import FAQ from '../../Components/Homepage/Faq';
import MapAnimation from '../../Components/Homepage/MapAnimation';
import { ROUTES } from '../../Config/uiRoutingConfig';
import DigitalPublicGood from '../../Components/Homepage/DigitalPublic';
import DemoSite from '../../Components/Homepage/DemoSite';
import FeatureCards from '../../Components/Homepage/Keyfeatures';
import Vision from '../../Components/Homepage/Vision';
import WhyThisPlatform from '../../Components/Homepage/WhyThisPlatform';
import TransparencyDashboardDemo from '../../Components/Homepage/TransparencyDashboardDemo';

const Homepage = () => {
  const { i18n, t } = useTranslation(['common', 'homepage']);
  const countryName = 'CountryX';
  const navigate = useNavigate();
  const [Visible, setVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [heroImage1, heroImage2, heroImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const controlDownArrow = () => {
    if (window.scrollY > 150) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleClickScroll = () => {
    const element = document.getElementById('vision');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('i18nextLng')!.length > 2) {
      i18next.changeLanguage('en');
    }
    window.addEventListener('scroll', controlDownArrow);
    return () => {
      window.removeEventListener('scroll', controlDownArrow);
    };
  }, []);

  return (
    <div className="homepage-container">
      <Row>
        <Col md={24} lg={24} flex="auto">
          <div
            className="homepage-img-container"
            style={{
              backgroundImage: `url(${heroImages[currentSlide]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              transition: 'background-image 1s ease-in-out',
            }}
          >
            <Row>
              <Col md={18} lg={21} xs={17} flex="auto">
                <div className="homepage-header-container">
                  <div className="logo">
                    <img src={sliderLogo} alt="slider-logo" />
                  </div>
                  <div>
                    <div style={{ display: 'flex' }}>
                      <div className="title">{t('homepage:heading')}</div>
                    </div>
                    <div className="country-name">{countryName}</div>
                  </div>
                </div>
              </Col>
              <Col md={6} lg={3} xs={7} flex="auto">
                <div className="homepage-button-container">
                  <div className="button">
                    <Button type="primary" onClick={() => navigate(ROUTES.LOGIN)}>
                      SIGN IN
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <div className="text-ctn">
                <span>
                  <Trans
                    i18nKey="homepage:heading"
                    components={{
                      br: <br />,
                    }}
                  />
                </span>
                <div className="subhome">{t('homepage:subHeading')}</div>
              </div>
            </Row>
            <Row className="arrow-ctn">
              {Visible && (
                <nav className={'arrows'}>
                  <svg onClick={handleClickScroll}>
                    <path className="a1" d="M0 0 L30 32 L60 0"></path>
                    <path className="a2" d="M0 20 L30 52 L60 20"></path>
                    <path className="a3" d="M0 40 L30 72 L60 40"></path>
                  </svg>
                </nav>
              )}

              {/* Dot Indicators below the arrow */}
              <div className="hero-slider-dots">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Row>
          </div>
        </Col>
      </Row>
      <Vision />
      <WhyThisPlatform />
      <TransparencyDashboardDemo />
      <DigitalPublicGood />
      <MapAnimation />
      <DemoSite />
      <ProcessFlow />
      <FeatureCards />
      {/* <PartnershipBanner /> */}
      <FAQ />

      <Row className="developer-resources-row">
        <Col xs={12} sm={6} md={6} lg={3} xl={3} className="Devresources">
          <div className="resource-item">
            <b>{t('homepage:develperResources.title')}</b>
          </div>
        </Col>
        <Col xs={12} sm={6} md={6} lg={3} xl={3} className="Devresources">
          <u>
            <a
              href="https://github.com/undp/National-Climate-Transparency-Platform"
              target="_blank"
            >
              {' '}
              <div className="resource-item connects">
                {t('homepage:develperResources.resource.1')}
              </div>
            </a>
          </u>
        </Col>
        <Col xs={12} sm={6} md={6} lg={3} xl={3} className="Devresources">
          <div className="resource-item connects">Companion Training Material</div>
        </Col>
        <Col xs={12} sm={6} md={6} lg={3} xl={3} className="Devresources">
          <div className="resource-item connects">Data Templates</div>
        </Col>
      </Row>
      <LayoutFooter />
    </div>
  );
};

export default Homepage;
