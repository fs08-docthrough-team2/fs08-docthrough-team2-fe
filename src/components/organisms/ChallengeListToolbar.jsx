'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/components/organisms/ChallengeListToolbar.module.scss';
import SearchInput from '@/components/atoms/input/SearchInput.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup.jsx';

export default function ChallengeListToolbar({
  variant = 'user', // 'user' | 'admin'
  title, // 주면 그걸 사용, 안 주면 "챌린지 목록"
  search,
  onSearchChange,
  onCreateRequest, // user일 때만 쓰임
  filterSlot,
}) {
  const [localSearch, setLocalSearch] = useState(search ?? '');
  const searchValue = search !== undefined ? search : localSearch;
  const handleSearch = (eOrValue) => {
    const v = typeof eOrValue === 'string' ? eOrValue : (eOrValue?.target?.value ?? '');
    if (onSearchChange) onSearchChange(v);
    else setLocalSearch(v);
  };

  const [open, setOpen] = useState(false);
  const slotRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (slotRef.current && !slotRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const computedTitle = title ?? '챌린지 목록';
  const showCreateButton = variant === 'user'; // ✅ 유저만 버튼 노출

  return (
    <section className={styles.wrapper}>
      {/* 상단: 제목 + (유저만) 버튼 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{computedTitle}</h2>
        {showCreateButton && (
          <button type="button" className={styles.createButton} onClick={onCreateRequest}>
            신규 챌린지 신청 +
          </button>
        )}
      </div>

      {/* 하단: 필터 + 검색 */}
      <div className={styles.controls}>
        {/* 🔹 필터 영역: 외부에서 filterSlot 주면 그걸 쓰고, 아니면 기본 트리거+팝업 */}
        <div className={styles.filterSlot} ref={slotRef}>
          {filterSlot ?? (
            <>
              <button
                type="button"
                className={styles.filterTrigger}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span>필터</span>
                <span aria-hidden>▾</span>
              </button>

              {open && (
                <div className={styles.filterPopupWrap}>
                  <FilterPopup
                    onApply={(filters) => {
                      onFilterChange?.(filters); // ✅ 필터 상태 전달
                      setOpen(false);
                    }}
                    onReset={(initialFilters) => {
                      onFilterChange?.(initialFilters);
                    }}
                    onClose={() => setOpen(false)}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.searchArea}>
          <SearchInput
            value={searchValue}
            onChange={handleSearch}
            placeholder="챌린지 이름을 검색해보세요"
          />
        </div>
      </div>
    </section>
  );
}
