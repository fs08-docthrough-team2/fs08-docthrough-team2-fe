import { BarLoader } from 'react-spinners';
import { useEffect, useState } from 'react';

import styles from '@/styles/components/common/Spinner/Spinner.module.scss';

const Spinner = ({ isLoading = true }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : styles.hidden}`}>
      <BarLoader className={styles.spinner} />
    </div>
  );
};

export default Spinner;
