'use client';

import Work from '@/components/templates/Work';
import styles from '@/styles/pages/work/WorkPage.module.scss';

const WorkPage = () => {
  return (
    <div className={styles.page}>
      <Work isAdmin={true} />
    </div>
  );
};

export default WorkPage;
