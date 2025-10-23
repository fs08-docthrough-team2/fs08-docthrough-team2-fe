import style from '@/styles/components/atoms/chips/StatusChip.module.scss';

export default function StatusChip({ label, type = 'pending' }) {
  return <span className={`${style.chip} ${style[type]}`}>{label}</span>;
}
