import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/components/organisms/ChallengeListToolbar.module.scss';
import SearchInput from '@/components/atoms/input/SearchInput.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup.jsx';
import { useRouter } from 'next/navigation';

export default function ChallengeListToolbar({
  variant = 'user', // 'user' | 'admin'
  title, // 없으면 "챌린지 목록"
  search, // 컨트롤드 값(선택)
  onSearchChange, // 변경 핸들러(선택)
  onCreateClick, // 유저 전용 버튼 클릭 (선택)
  onFilterChange, // 필터 변경 알림(선택)
  filterSlot, // 커스텀 필터 영역(선택)
  showCreateButton = true, // 유저에서만 의미 있음
}) {
  // --- 검색 상태 (controlled 우선)
  const [localSearch, setLocalSearch] = useState(search ?? '');
  const searchValue = search !== undefined ? search : localSearch;
  const handleSearch = (eOrValue) => {
    const v = typeof eOrValue === 'string' ? eOrValue : (eOrValue?.target?.value ?? '');
    if (onSearchChange) onSearchChange(v);
    else setLocalSearch(v);
  };

  // --- 필터 드롭다운
  const [open, setOpen] = useState(false);
  const slotRef = useRef(null);
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    const onDoc = (e) => {
      if (openRef.current && slotRef.current && !slotRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => {
      if (openRef.current && e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const computedTitle = title ?? '챌린지 목록';
  const shouldShowCreate = variant === 'user' && !!onCreateClick; // ✅ admin이면 자동 숨김
  const router = useRouter();

  return (
    <section className={styles.wrapper}>
      {/* 상단: 제목 + (유저만) 버튼 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{computedTitle}</h2>
        {shouldShowCreate && (
          <button type="button" className={styles.createButton} onClick={onCreateClick}>
            신규 챌린지 신청 +
          </button>
        )}
      </div>

      {/* 하단: 필터 + 검색 */}
      <div className={styles.controls}>
        {/* 필터 영역 */}
        <div className={styles.filterSlot} ref={slotRef}>
          {filterSlot !== undefined ? (
            filterSlot
          ) : (
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
                    showTrigger={false}
                    externalOpen={open}
                    onRequestClose={() => setOpen(false)}
                    onApply={(filters) => {
                      onFilterChange?.(filters);
                      setOpen(false);
                    }}
                    onReset={(initial) => {
                      onFilterChange?.(initial);
                    }}
                    onClose={() => setOpen(false)}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* 검색 영역 */}
        <div className={styles.searchArea}>
          <SearchInput
            value={searchValue} // ✅ controlled 값
            onChange={handleSearch} // ✅ 내부/외부 모두 처리
            onSearch={handleSearch}
            placeholder="챌린지 이름을 검색해보세요"
          />
        </div>
      </div>
    </section>
  );
}
