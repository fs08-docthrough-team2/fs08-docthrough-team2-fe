// 정렬을 보여주는 dropdown
'use client';

import { useState } from 'react';
import DropdownList from '../../atoms/Dropdown/DropdownList';
import DropdownTrigger from '../../atoms/Dropdown/DropdownTrigger';
import styles from '@/styles/components/molecules/Dropdown/DropdownSort.module.scss';

const DROPDOWN_OPTIONS = [
  '승인 대기',
  '신청 승인',
  '신청 거절',
  '신청 시간 빠른순',
  '신청 시간 느린순',
  '마감 기한 빠른순',
  '마감 기한 느린순',
];
const DEFAULT_LABEL = '정렬';

function DropdownSort() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(DEFAULT_LABEL);
  const isDefaultLabel = selectedLabel === DEFAULT_LABEL;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    setSelectedLabel(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.triggerWrapper}>
        <DropdownTrigger
          label={selectedLabel}
          isOpen={isOpen}
          onToggle={handleToggle}
          isSelected={!isDefaultLabel}
        />
      </div>
      <DropdownList options={DROPDOWN_OPTIONS} isOpen={isOpen} onSelect={handleSelect} />
    </div>
  );
}

export default DropdownSort;
