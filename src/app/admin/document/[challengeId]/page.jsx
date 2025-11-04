import Work from '@/components/templates/Work/Work';

import styles from '@/styles/pages/admin/AdminWorkPage.module.scss';

const AdminWorkPage = () => {
  const isMyWork = false; // DB 연동으로 상태 결정

  return (
    <div className={styles.page}>
      <Work isMyWork={isMyWork} />
    </div>
  );
};

export default AdminWorkPage;
