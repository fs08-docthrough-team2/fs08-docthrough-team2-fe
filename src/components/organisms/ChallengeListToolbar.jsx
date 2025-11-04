import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/components/organisms/ChallengeListToolbar.module.scss';
import SearchInput from '@/components/atoms/input/SearchInput.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup.jsx';
import { useRouter } from 'next/navigation';

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
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const onDoc = (e) => {
      if (openRef.current && slotRef.current && !slotRef.current.contains(e.target)) {
        setOpen(false);
      }
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
  }, []); // ← 의존성 비움 (1회만 등록)

  const computedTitle = title ?? '챌린지 목록';
  const showCreateButton = variant === 'user';
  const router = useRouter();

  return (
    <section className={styles.wrapper}>
      {/* 상단: 제목 + (유저만) 버튼 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{computedTitle}</h2>
        {showCreateButton && (
          <button
            type="button"
            className={styles.createButton}
            onClick={() => router.push('/challenge/post')}
          >
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
                    showTrigger={false} // ✅ 내부 트리거 숨김
                    externalOpen={open} // ✅ 툴바가 열림 상태를 제어
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            placeholder="챌린지 이름을 검색해보세요"
          />
        </div>
      </div>
    </section>
  );
}
