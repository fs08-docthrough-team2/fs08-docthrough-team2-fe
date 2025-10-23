import styles from '@/styles/components/atoms/Chips/CategoryChip.module.scss';

export default function CategoryChip({ label }) {
  return <span className={styles.chip}>{label}</span>;
}
