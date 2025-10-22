'use client';

import Image from 'next/image';
import { useState } from 'react';
import DropdownList from '../../atoms/Dropdown/DropdownList';
import optionTriggerIcon from '/public/icon/ic_option_trigger.svg';
import styles from '@/styles/components/molecules/Dropdown/DropdownOption.module.scss';

const DROPDOWN_OPTIONS = ['수정하기', '삭제하기'];
const OPTION_TRIGGER_ARIA_LABEL = '옵션 정렬 열기';

function DropdownOption() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button type="button" className={styles.optionTriggerButton} onClick={handleToggle}>
        <Image src={optionTriggerIcon} alt="option button" width={16} height={16} priority />
      </button>
      <DropdownList options={DROPDOWN_OPTIONS} isOpen={isOpen} onSelect={handleSelect} />
    </div>
  );
}

export default DropdownOption;
