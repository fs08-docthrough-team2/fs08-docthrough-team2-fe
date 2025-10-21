// Dropdown을 열기위해 누르는 trigger
import toggleCloseIcon from '@/../public/toggle_close.svg';
import toggleOpenIcon from '@/../public/toggle_open.svg';
import styles from '@/styles/DropdownTrigger.module.scss';

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
      <img
        className={styles.triggerIconImage}
        src={isOpen ? toggleOpenIcon.src : toggleCloseIcon.src}
        alt="toggle icon"
      />
    </button>
  );
}

export default DropdownTrigger;
