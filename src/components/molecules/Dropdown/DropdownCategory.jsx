// 신규 챌린지 신청 페이지 - 카테고리 항목들을 보여주는 dropdown
'use client';

import { useEffect, useState } from 'react';
import DropdownList from '../../atoms/Dropdown/DropdownList';
import DropdownTrigger from '../../atoms/Dropdown/DropdownTrigger';
import styles from '@/styles/components/molecules/Dropdown/DropdownCategory.module.scss';

const DROPDOWN_OPTIONS = ['Next.js', 'API', 'Career', 'Modern JS', 'Web'];
const DEFAULT_LABEL = '카테고리';

function DropdownCategory({ onSelect, defaultLabel = DEFAULT_LABEL }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel);
  const isDefaultLabel = selectedLabel === defaultLabel;

  useEffect(() => {
    setSelectedLabel(defaultLabel);
  }, [defaultLabel]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    setSelectedLabel(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div className={styles.dropdown}>
      <DropdownTrigger
        label={selectedLabel}
        isOpen={isOpen}
        onToggle={handleToggle}
        isSelected={!isDefaultLabel}
      />
      <DropdownList options={DROPDOWN_OPTIONS} isOpen={isOpen} onSelect={handleSelect} />
    </div>
  );
}

export default DropdownCategory;
