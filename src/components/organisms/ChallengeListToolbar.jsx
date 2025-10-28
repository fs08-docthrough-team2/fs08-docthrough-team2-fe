'use client';

import React from 'react';

import styles from '@/styles/components/organisms/ChallengeListToolbar.module.scss';
import SearchInput from '@/components/atoms/input/SearchInput.jsx';
import DropdownCategory from '@/components/molecules/Dropdown/DropdownCategory.jsx';

export default function ChallengeListToolbar({
  variant = 'user',
  title,
  category,
  categoryOptions = [],
  onCategoryChange,
  search = '',
  onSearchChange,
  onCreateRequest,
}) {
  const isAdmin = variant === 'admin';
  const computedTitle = title ?? (isAdmin ? '챌린지 목록' : '나의 챌린지');
  const pick = (v) => v?.target?.value ?? v;

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

      {/* 드롭다운 + 검색 */}
      <div className={styles.controls}>
        <DropdownCategory
          value={category}
          options={categoryOptions}
          onChange={(v) => onCategoryChange?.(pick(v))}
        />
        <SearchInput
          value={search}
          onChange={(v) => onSearchChange?.(pick(v))}
          placeholder="챌린지 이름을 검색해보세요"
        />
      </div>
    </section>
  );
}
