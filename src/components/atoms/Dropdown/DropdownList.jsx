// Dropdown에서 항목들을 보여주는 list
import styles from '@/styles/DropdownList.module.scss';

function DropdownList({ options, isOpen, onSelect }) {
  if (!isOpen) {
    return null;
  }

  const handleSelect = (option) => {
    if (typeof onSelect === 'function') {
      onSelect(option);
    }
  };

  return (
    <ul className={styles.list}>
      {options.map((option) => (
        <li key={option} className={styles.listItem}>
          <button type="button" className={styles.option} onClick={() => handleSelect(option)}>
            {option}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default DropdownList;
