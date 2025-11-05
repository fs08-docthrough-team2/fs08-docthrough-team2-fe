import { PulseLoader } from 'react-spinners';
import styles from '@/styles/components/organisms/Loading/LoadingSpinner.module.scss';

function LoadingSpinner({
  loading = false,
  message = '로딩 중입니다…',
  color = '#ffffff',
  size = 64,
}) {
  if (!loading) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="assertive">
      <div className={styles.content}>
        <PulseLoader size={50} />
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
