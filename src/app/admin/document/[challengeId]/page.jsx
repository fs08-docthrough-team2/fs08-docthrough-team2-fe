import Work from '@/components/templates/Work';

import styles from '@/styles/pages/admin/AdminWorkPage.module.scss';

const AdminWorkPage = () => {
  return (
    <div className={styles.page}>
      <Work isAdmin={true} />
    </div>
  );
};

export default AdminWorkPage;
