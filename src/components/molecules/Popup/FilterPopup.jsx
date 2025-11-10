/**
  - onApply(filters): 적용 버튼 클릭 시 선택된 필터 세트를 전달. 목록 필터링/정렬에 직접 사용.
  - onReset(initialFilters): 초기화 버튼 클릭 시 필터가 기본 상태로 바뀐 값을 전달. 상위 상태를 초기화할 때 활용.
  - onClose(): 팝업이 닫힐 때 알림만 필요하다면 선택적으로 연결.

  사용 예시)
    <FilterPopup
      onApply={setFilters}
      onReset={setFilters}
      onClose={setIsPopupOpen(false)}
    />
 */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DropdownTrigger from '../../atoms/Dropdown/DropdownTrigger';
import Button from '@/components/atoms/Button/Button';
import styles from '@/styles/components/molecules/Popup/FilterPopup.module.scss';

const FIELD_OPTIONS = [
  { id: 'nextjs', label: 'Next.js' },
  { id: 'modernjs', label: 'Modern JS' },
  { id: 'api', label: 'API' },
  { id: 'web', label: 'Web' },
  { id: 'career', label: 'Career' },
];

const DOC_TYPE_OPTIONS = [
  { id: 'official', label: '공식문서' },
  { id: 'blog', label: '블로그' },
];

const STATUS_OPTIONS = [
  { id: 'inProgress', label: '진행중' },
  { id: 'closed', label: '마감' },
];

const DEFAULT_FIELD_SELECTION = {
  nextjs: false,
  modernjs: false,
  api: false,
  web: false,
  career: false,
};

const createInitialFilters = () => ({
  fields: { ...DEFAULT_FIELD_SELECTION },
  docType: 'official',
  status: 'inProgress',
});

function FilterPopup({ onApply = () => {}, onReset = () => {}, onClose = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(createInitialFilters);
  const wrapperRef = useRef(null);

  const { hasActiveFilters, activeFieldCount } = useMemo(() => {
    const fieldCount = Object.values(selectedFilters.fields).filter(Boolean).length;

    return {
      hasActiveFilters: fieldCount > 0,
      activeFieldCount: fieldCount,
    };
  }, [selectedFilters.fields]);

  const closeDropdown = useCallback(() => {
    if (!isOpen) return;
    setIsOpen(false);
    onClose?.();
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeDropdown]);

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      setIsOpen(true);
    }
  };

  const handleCheckboxChange = (field) => {
    setSelectedFilters((prev) => ({
      ...prev,
      fields: { ...prev.fields, [field]: !prev.fields[field] },
    }));
  };

  const handleRadioChange = (group, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [group]: prev[group] === value ? null : value,
    }));
  };

  const handleReset = () => {
    const initial = createInitialFilters();
    setSelectedFilters(initial);
    onReset?.(initial);
    closeDropdown();
  };

  const handleApply = () => {
    onApply?.(selectedFilters);
    closeDropdown();
  };

  const triggerText = activeFieldCount > 0 ? `필터(${activeFieldCount})` : '필터';

  return (
    <div className={styles.filterLayoutContainer} ref={wrapperRef}>
      <div className={styles.triggerWrapper}>
        <DropdownTrigger
          label={triggerText}
          isOpen={isOpen}
          onToggle={toggleDropdown}
          isSelected={hasActiveFilters}
        />
      </div>

      {isOpen && (
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>필터</h2>
            <button onClick={closeDropdown} className={styles.closeButton} type="button">
              &times;
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>분야</h3>
              <div className={styles.optionsContainer}>
                {FIELD_OPTIONS.map(({ id, label }) => (
                  <label key={id} className={styles.optionItem}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.fields[id]}
                      onChange={() => handleCheckboxChange(id)}
                    />
                    <span className={styles.customCheckbox} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>문서 타입</h3>
              <div className={styles.optionsContainer}>
                {DOC_TYPE_OPTIONS.map(({ id, label }) => (
                  <label key={id} className={styles.optionItem}>
                    <input
                      type="radio"
                      name="docType"
                      value={id}
                      checked={selectedFilters.docType === id}
                      onChange={() => handleRadioChange('docType', id)}
                    />
                    <span className={styles.customRadio} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>상태</h3>
              <div className={styles.optionsContainer}>
                {STATUS_OPTIONS.map(({ id, label }) => (
                  <label key={id} className={styles.optionItem}>
                    <input
                      type="radio"
                      name="status"
                      value={id}
                      checked={selectedFilters.status === id}
                      onChange={() => handleRadioChange('status', id)}
                    />
                    <span className={styles.customRadio} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.buttonWrapper}>
              <Button variant="outline" size="md" onClick={handleReset}>
                초기화
              </Button>
            </div>
            <div className={styles.buttonWrapper}>
              <Button variant="solid" size="md" onClick={handleApply}>
                적용하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPopup;
