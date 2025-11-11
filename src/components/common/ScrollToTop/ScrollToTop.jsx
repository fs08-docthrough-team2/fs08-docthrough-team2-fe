'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import ic_arrow_right from '/public/icon/ic_arrow_right.svg';
import styles from '@/styles/components/common/ScrollToTop/ScrollToTop.module.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button className={styles.scrollToTop} onClick={scrollToTop} aria-label="맨 위로 이동">
      <Image src={ic_arrow_right} alt="맨 위로" width={20} height={20} className={styles.icon} />
    </button>
  );
};

export default ScrollToTop;
