import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/components/organisms/ChallengeListToolbar.module.scss';
import SearchInput from '@/components/atoms/input/SearchInput.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup.jsx';

export default function ChallengeListToolbar({
  variant = 'user', // 'user' | 'admin'
  title, // 없으면 "챌린지 목록"
  search, // 컨트롤드 검색 값(선택)
  onSearchChange, // 검색 변경 핸들러(선택)
  onCreateClick, // "신규 챌린지 신청 +" 클릭 (user 전용)
  onFilterChange, // 필터 적용/리셋 시 상위로 전달(선택)
  filterSlot, // 외부에서 커스텀 필터 영역 주입(선택)
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

  // 마운트 시 1회만 등록, 내부에서 open 체크(StrictMode 안전)
  useEffect(() => {
    const onDoc = (e) => {
      if (open && slotRef.current && !slotRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (open && e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
    // open은 deps에 넣지 않음! (리스너는 1회만, 내부에서 open 검사)
  }, [slotRef, open]); // eslint 경고를 피하려면 open 제거 가능: [slotRef]

  const computedTitle = title ?? '챌린지 목록';
  const showCreateButton = variant === 'user';

  return (
    <section className={styles.wrapper}>
      {/* 상단: 제목 + (유저만) 버튼 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{computedTitle}</h2>
        {showCreateButton && (
          <button type="button" className={styles.createButton} onClick={onCreateClick}>
            신규 챌린지 신청 +
          </button>
        )}
      </div>

      {/* 하단: 필터 + 검색 */}
      <div className={styles.controls}>
        {/* 필터 영역 */}
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
                      onFilterChange?.(filters);
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

        {/* 검색 영역 */}
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
