import styles from '@/styles/components/atoms/chips/TypeChip.module.scss';

export default function TypeChip({ label, color = 'green' }) {
  return <span className={`${styles.chip} ${styles[color]}`}>{label}</span>;
}
