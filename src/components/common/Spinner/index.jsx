import { BarLoader } from 'react-spinners';

import styles from '@/styles/components/common/Spinner/Spinner.module.scss';

const Spinner = () => {
  return (
    <div className={styles.overlay}>
      <BarLoader className={styles.spinner} />
    </div>
  );
};

export default Spinner;
