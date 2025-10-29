'use client';

import React from 'react';
import styles from '@/styles/components/organisms/ChallengeListToolbar.module.scss';
import SearchInput from '@/components/atoms/input/SearchInput.jsx';

export default function ChallengeListToolbar({
  variant = 'user',
  title,
  // 기존 상태 props
  search = '',
  onSearchChange,
  onCreateRequest,
  // 🔸 임시: 필터 자리에 렌더할 컴포넌트/노드 (나중에 팀 드롭다운 꽂기)
  filterSlot = null,
}) {
  const isAdmin = variant === 'admin';
  const computedTitle = title ?? (isAdmin ? '챌린지 목록' : '나의 챌린지');
  const pick = (v) => v?.target?.value ?? v;
  const handleSearch = (value) => {
    if (onSearchChange) onSearchChange(value);
    else setSearch?.(value); // 혹시 내부 상태 쓸 때 대비
  };

  return (
    <section className={styles.wrapper}>
      {/* 상단 제목 + 버튼 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{computedTitle}</h2>
        {!isAdmin && (
          <button type="button" className={styles.createButton} onClick={onCreateRequest}>
            신규 챌린지 신청 +
          </button>
        )}
      </div>

      {/* 컨트롤 바: [필터 자리] + [검색] */}
      <div className={styles.controls}>
        {/* 🔸 필터 슬롯: 없으면 placeholder로 동일한 폭만 차지 */}
        <div className={styles.filterSlot}>
          {filterSlot ?? <div className={styles.placeholder} aria-hidden />}
        </div>

        <div className={styles.searchArea}>
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="챌린지 이름을 검색해보세요"
          />
        </div>
      </div>
    </section>
  );
}
