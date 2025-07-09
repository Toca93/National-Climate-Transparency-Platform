import React, { useState } from 'react';
import './Dashboard.scss';
import './Faq.scss';
import { ChevronDown } from 'react-bootstrap-icons';
import { Trans, useTranslation } from 'react-i18next';
import SupportedReports from './SupportedReports';

const FAQ = () => {
  const { t } = useTranslation(['homepage']);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq-container">
      <h2 className="header-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 0 ? 'active' : ''}`}
            onClick={() => toggleItem(0)}
          >
            <span className={`chevron ${openIndex === 0 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ1')}</span>
          </button>
          {openIndex === 0 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA1"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                  br: <br />,
                }}
              />
            </div>
          )}
        </div>

        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 1 ? 'active' : ''}`}
            onClick={() => toggleItem(1)}
          >
            <span className={`chevron ${openIndex === 1 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ2')}</span>
          </button>
          {openIndex === 1 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA2"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                }}
              />
            </div>
          )}
        </div>
        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 2 ? 'active' : ''}`}
            onClick={() => toggleItem(2)}
          >
            <span className={`chevron ${openIndex === 2 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ3')}</span>
          </button>
          {openIndex === 2 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA3"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                  br: <br />,
                  a1: (
                    <a href="https://unfccc.int/sites/default/files/resource/cma3_auv_5_transparency_0.pdf" />
                  ),
                }}
              />
              <SupportedReports />
            </div>
          )}
        </div>
        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 3 ? 'active' : ''}`}
            onClick={() => toggleItem(3)}
          >
            <span className={`chevron ${openIndex === 3 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ4')}</span>
          </button>
          {openIndex === 3 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA4"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                  br: <br />,
                  a1: (
                    <a href="https://unfccc.int/sites/default/files/resource/cma3_auv_5_transparency_0.pdf" />
                  ),
                }}
              />
            </div>
          )}
        </div>
        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 4 ? 'active' : ''}`}
            onClick={() => toggleItem(4)}
          >
            <span className={`chevron ${openIndex === 4 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ5')}</span>
          </button>
          {openIndex === 4 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA5"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                }}
              />
            </div>
          )}
        </div>
        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 5 ? 'active' : ''}`}
            onClick={() => toggleItem(5)}
          >
            <span className={`chevron ${openIndex === 5 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ6')}</span>
          </button>
          {openIndex === 5 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA6"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                }}
              />
            </div>
          )}
        </div>
        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 6 ? 'active' : ''}`}
            onClick={() => toggleItem(6)}
          >
            <span className={`chevron ${openIndex === 6 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ7')}</span>
          </button>
          {openIndex === 6 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA7"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                }}
              />
            </div>
          )}
        </div>
        <div className="faq-item">
          <button
            className={`faq-question ${openIndex === 7 ? 'active' : ''}`}
            onClick={() => toggleItem(7)}
          >
            <span className={`chevron ${openIndex === 7 ? 'rotated' : ''}`}>
              <ChevronDown />
            </span>
            <span className="question-text">{t('faqQ8')}</span>
          </button>
          {openIndex === 7 && (
            <div className="faq-answer">
              <Trans
                i18nKey="homepage:faqA8"
                components={{
                  ul: <ul />,
                  li: <li />,
                  b: <strong />,
                  a1: <a href="mailto:digital4planet@undp.org" />,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
