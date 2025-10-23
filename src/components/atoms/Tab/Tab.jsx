// 각각의 Tab을 구성하는 구성요소
import styles from '@/styles/components/atoms/Tab/Tab.module.scss';

function Tab({ label, isActive, onClick }) {
  const tabClassName = isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab;

  return (
    <button type="button" className={tabClassName} onClick={onClick}>
      {label}
    </button>
  );
}

export default Tab;
