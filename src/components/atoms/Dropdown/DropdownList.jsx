// Dropdown에서 항목들을 보여주는 list
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from '@/styles/components/atoms/Dropdown/DropdownList.module.scss';

function DropdownList({
  options = [],
  isOpen,
  onSelect,
  onClickOutside,
  listClassName = '',
  listItemClassName = '',
  optionClassName = '',
  getOptionClassName,
  showDivider = true,
  variant = 'dropdown',
  placement = 'stretch',
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const listElement = listRef.current;
      if (!listElement) return;
      if (listElement.contains(event.target)) return;

      if (typeof onClickOutside === 'function') {
        onClickOutside(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClickOutside]);

  if (!isOpen) {
    return null;
  }

  const normalizedOptions = options.map((option, index) => {
    if (typeof option === 'string') {
      return {
        key: option,
        label: option,
        value: option,
        original: option,
        hasOwnValue: false,
      };
    }

    const hasOwnValue = option != null && Object.prototype.hasOwnProperty.call(option, 'value');
    const value = option?.value ?? null;
    const label = option?.label ?? (value !== null && value !== undefined ? String(value) : '');
    const fallbackKey = option?.label ?? `option-${index}`;
    const keyCandidate =
      option?.key ?? (value !== null && value !== undefined ? value : null) ?? fallbackKey;

    return {
      key:
        typeof keyCandidate === 'string' || typeof keyCandidate === 'number'
          ? String(keyCandidate)
          : `option-${index}`,
      label,
      value,
      original: option,
      hasOwnValue,
    };
  });

  const handleSelect = (option) => {
    if (typeof onSelect === 'function') {
      const payload =
        typeof option.original === 'string'
          ? option.original
          : option.hasOwnValue
            ? option.value
            : option.label;
      onSelect(payload);
    }
  };

  const placementClassName =
    variant === 'dropdown'
      ? ({
          stretch: styles.listStretch,
          left: styles.listAlignLeft,
          right: styles.listAlignRight,
        }[placement] ?? styles.listStretch)
      : null;

  return (
    <ul
      ref={listRef}
      className={clsx(
        styles.list,
        variant === 'inline' && styles.listInline,
        placementClassName,
        listClassName,
      )}
    >
      {normalizedOptions.map((option) => (
        <li
          key={option.key}
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
              typeof getOptionClassName === 'function' ? getOptionClassName(option.original) : null,
            )}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default DropdownList;
