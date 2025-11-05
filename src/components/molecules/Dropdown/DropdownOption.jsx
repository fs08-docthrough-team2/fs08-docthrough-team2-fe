'use client';
import Image from 'next/image';
import { useState, useMemo, useEffect, useRef } from 'react';
import DropdownList from '../../atoms/Dropdown/DropdownList';
import optionTriggerIcon from '/public/icon/ic_option_trigger.svg';
import styles from '@/styles/components/molecules/Dropdown/DropdownOption.module.scss';
const DROPDOWN_OPTIONS = [
  { key: 'edit', label: '수정하기' },
  { key: 'delete', label: '삭제하기' },
];
function DropdownOption({ onEdit = () => {}, onDelete = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const optionLabels = useMemo(() => DROPDOWN_OPTIONS.map((option) => option.label), []);
  const handlersByKey = useMemo(() => ({ edit: onEdit, delete: onDelete }), [onEdit, onDelete]);
  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (selectedLabel) => {
    const option = DROPDOWN_OPTIONS.find((item) => item.label === selectedLabel);
    const handler = option ? handlersByKey[option.key] : undefined;
    handler?.();
    setIsOpen(false);
  };

  // 외부 클릭 시 닫히도록 설정

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      {' '}
      <button type="button" className={styles.optionTriggerButton} onClick={handleToggle}>
        {' '}
        <Image src={optionTriggerIcon} alt="option button" width={16} height={16} priority />{' '}
      </button>{' '}
      <DropdownList
        options={optionLabels}
        isOpen={isOpen}
        onSelect={handleSelect}
        listClassName={styles.optionList}
        listItemClassName={styles.optionListItem}
        optionClassName={styles.optionButton}
        placement="right"
        onClickOutside={() => setIsOpen(false)}
      />{' '}
    </div>
  );
}
export default DropdownOption;
