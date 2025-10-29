'use client';

import { useState } from 'react';
import styles from '@/styles/components/organisms/ChallengeListToolbar.module.scss';
import SearchInput from '@/components/atoms/input/SearchInput.jsx';

export default function ChallengeListToolbar({
  variant = 'user', // 'user' | 'admin'
  title, // 주면 그걸 사용, 안 주면 "챌린지 목록"
  search, // optional controlled value
  onSearchChange, // optional controlled handler
  onCreateRequest, // user일 때만 쓰임
  filterSlot = null, // 필터 드롭다운 자리
}) {
  const [localSearch, setLocalSearch] = useState(search ?? '');
  const searchValue = search !== undefined ? search : localSearch;

  const handleSearch = (eOrValue) => {
    const v = typeof eOrValue === 'string' ? eOrValue : (eOrValue?.target?.value ?? '');
    if (onSearchChange) onSearchChange(v);
    else setLocalSearch(v);
  };

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
        <div className={styles.filterSlot}>
          {filterSlot ?? <div style={{ width: 112, height: 40 }} aria-hidden />}
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
