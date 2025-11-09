// 정렬을 보여주는 dropdown
'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { filterSortOptions } from '@/constants/sortOptions.js';
import DropdownList from '../../atoms/Dropdown/DropdownList';
import DropdownTrigger from '../../atoms/Dropdown/DropdownTrigger';
import styles from '@/styles/components/molecules/Dropdown/DropdownSort.module.scss';

function DropdownSort({
  className,
  options = filterSortOptions,
  value = null,
  defaultLabel = '정렬',
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const normalizedOptions = useMemo(
    () =>
      options.map((option, index) => {
        if (typeof option === 'string') {
          return {
            key: option,
            value: option,
            label: option,
          };
        }

        const computedValue = option?.value ?? null;
        const computedLabel =
          option?.label ??
          (computedValue !== null && computedValue !== undefined ? String(computedValue) : '');
        const computedKey =
          option?.key ??
          (computedValue !== null && computedValue !== undefined
            ? String(computedValue)
            : (option?.label ?? `option-${index}`));

        return {
          ...option,
          key: computedKey,
          value: computedValue,
          label: computedLabel,
        };
      }),
    [options],
  );

  const selectedOption = useMemo(
    () => normalizedOptions.find((option) => option.value === value) ?? null,
    [normalizedOptions, value],
  );

  const isDefaultSelection =
    selectedOption == null ||
    selectedOption.value === null ||
    typeof selectedOption.value === 'undefined';

  const triggerLabel = isDefaultSelection
    ? defaultLabel
    : (selectedOption.label ?? (typeof value === 'string' ? value : defaultLabel));

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (selected) => {
    const nextOption =
      normalizedOptions.find((option) => option.value === selected) ??
      normalizedOptions.find((option) => option.label === selected) ??
      null;

    const nextValue = nextOption?.value ?? (typeof selected === 'string' ? selected : null);

    if (typeof onChange === 'function') {
      onChange(nextValue);
    }

    setIsOpen(false);
  };

  return (
    <div className={clsx(styles.dropdown, className)}>
      <div className={styles.triggerWrapper}>
        <DropdownTrigger
          label={triggerLabel}
          isOpen={isOpen}
          onToggle={handleToggle}
          isSelected={!isDefaultSelection}
        />
      </div>
      <DropdownList
        options={normalizedOptions}
        isOpen={isOpen}
        onSelect={handleSelect}
        onClickOutside={() => setIsOpen(false)}
        placement="right"
      />
    </div>
  );
}

export default DropdownSort;
