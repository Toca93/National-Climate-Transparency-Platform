import React, { useEffect, useRef, useState } from 'react';
import styles from './MapAnimation.module.scss';
// Import as ReactComponent to allow ref forwarding
import { ReactComponent as MapSVG } from '../../Assets/Images/animated-map-updated.svg';
import { Trans, useTranslation } from 'react-i18next';

const MapAnimation = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<SVGSVGElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { i18n, t } = useTranslation(['common', 'homepage']);
  const countries = [
    { name: 'Seychelles', id: 'seychelles' },
    { name: 'Senegal', id: 'senegal' },
    { name: 'Montenegro', id: 'montenegro' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          const targetElements = mapRef.current?.querySelectorAll?.('.animate-target') ?? [];
          const textElements = mapRef.current?.querySelectorAll?.('text') ?? [];

          targetElements.forEach((el: Element, i: number) => {
            (el as HTMLElement).style.animationDelay = `${i * 0.1}s`;
            el.classList.add(styles.mapElement);
          });

          textElements.forEach((el: Element, i: number) => {
            (el as HTMLElement).style.animationDelay = `${1 + i * 0.2}s`;
            el.classList.add(styles.textLabel);
          });

          setHasAnimated(true); // Prevent retriggering
          if (containerRef.current) {
            observer.unobserve(containerRef.current); // Optional: stop observing once triggered
          }
        }
      },
      {
        threshold: 0.05, // Trigger when 30% is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect(); // Cleanup on unmount
  }, [hasAnimated]);

  return (
    <div>
      <div className="global-impact-container">
        <h2 className="global-impact-title">{t('homepage:globalImpact.title')}</h2>
        <div className="global-impact-content">
          <p className="global-impact-description">
            <Trans i18nKey="homepage:globalImpact.description" components={{ br: <br /> }}>
              {
                'Ovo su neke od zemalja koje sarađuju sa UNDP-em na prilagođavanju i podešavanju platforme za klimatsku transparentnost sopstvenom kontekstu.'
              }
              <br />
              <br />
              {'Senegal - Crna Gora – Sejšeli'}
            </Trans>
          </p>

          <div className="countries-grid">
            {countries.map((country, index) => (
              <div key={country.id} className="country-item">
                <span className="country-bullet">•</span>
                <span className="country-name">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={containerRef} className={styles.mapContainer}>
        <MapSVG ref={mapRef} className={styles.animatedMap} />
      </div>
    </div>
  );
};

export default MapAnimation;
