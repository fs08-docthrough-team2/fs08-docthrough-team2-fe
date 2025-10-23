// Dropdown을 열기위해 누르는 trigger
import Image from 'next/image';
import toggleOpen from '/public/icon/ic_toggle_open.svg';
import toggleClose from '/public/icon/ic_toggle_close.svg';
import styles from '@/styles/components/atoms/Dropdown/DropdownTrigger.module.scss';

function DropdownTrigger({ label, isOpen, onToggle, isSelected = false }) {
  // label의 색상을 결정하기 위해 사용(default면 연하게, 선택되었으면 진하게)
  const triggerLabelClass = isSelected
    ? `${styles.triggerLabel} ${styles.triggerLabelSelected}`
    : styles.triggerLabel;

  return (
    <button
      type="button"
      className={isOpen ? `${styles.trigger} ${styles.triggerActive}` : styles.trigger}
      onClick={onToggle}
    >
      <span className={triggerLabelClass}>{label}</span>
      <Image
        className={styles.triggerIconImage}
        src={isOpen ? toggleOpen : toggleClose}
        alt="toggle icon"
        width={16}
        height={16}
      />
    </button>
  );
}

export default DropdownTrigger;
