'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import DropdownList from '@/components/atoms/Dropdown/DropdownList';
import optionTriggerIcon from '/public/icon/ic_option_trigger.svg';
import styles from '@/styles/components/molecules/Dropdown/DropdownOption.module.scss';

const DEFAULT_OPTIONS = ['수정하기', '삭제하기'];

export default function DropdownOption({
  options = DEFAULT_OPTIONS,
  onSelect,
  placement = 'right',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    setIsOpen(false);
    onSelect?.(option);
  };

  // 바깥 클릭 시 닫기 (UX 보완)
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setIsOpen(false);
    if (isOpen) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isOpen]);

  return (
    <div className={`${styles.dropdown} ${className}`} ref={ref}>
      <button
        type="button"
        className={styles.optionTriggerButton}
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Image src={optionTriggerIcon} alt="option button" width={16} height={16} priority />
      </button>
      <DropdownList
        options={options}
        isOpen={isOpen}
        onSelect={handleSelect}
        listClassName={styles.optionList}
        listItemClassName={styles.optionListItem}
        optionClassName={styles.optionButton}
        placement={placement}
      />
    </div>
  );
}
