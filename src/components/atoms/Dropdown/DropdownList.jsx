// Dropdown에서 항목들을 보여주는 list
import clsx from 'clsx';
import styles from '@/styles/components/atoms/Dropdown/DropdownList.module.scss';

function DropdownList({
  options,
  isOpen,
  onSelect,
  listClassName = '',
  listItemClassName = '',
  optionClassName = '',
  getOptionClassName,
  showDivider = true,
  variant = 'dropdown',
}) {
  if (!isOpen) {
    return null;
  }

  const handleSelect = (option) => {
    if (typeof onSelect === 'function') {
      onSelect(option);
    }
  };

  return (
    <ul className={clsx(styles.list, variant === 'inline' && styles.listInline, listClassName)}>
      {options.map((option) => (
        <li
          key={option}
          className={clsx(
            styles.listItem,
            listItemClassName,
            showDivider && styles.listItemDivider,
          )}
        >
          <button
            type="button"
            className={clsx(
              styles.option,
              optionClassName,
              typeof getOptionClassName === 'function' ? getOptionClassName(option) : null,
            )}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default DropdownList;
