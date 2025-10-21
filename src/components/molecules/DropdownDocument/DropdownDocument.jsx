// 신규 챌린지 신청 페이지 - 문서 항목들을 보여주는 dropdown
'use client';

import { useState } from 'react';
import DropdownList from '../../atoms/Dropdown/DropdownList';
import DropdownTrigger from '../../atoms/Dropdown/DropdownTrigger';
import styles from '@/styles/DropdownDocument.module.scss';

const DROPDOWN_OPTIONS = ['공식문서', '블로그'];
const DEFAULT_LABEL = '카테고리';

function DropdownDocument() {
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

export default DropdownDocument;
