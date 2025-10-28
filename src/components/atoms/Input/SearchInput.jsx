'use client';

import { useState } from 'react';
import styles from '@/styles/components/atoms/input/SearchInput.module.scss';

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = '챌린지 이름을 검색해보세요',
}) {
  return (
    <div className={styles.siWrap}>
      <div className={styles.siLeft}>
        <img src="/icons/search.svg" alt="검색" width={24} height={24} />
      </div>
      <input
        className={styles.siInput}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.(value.trim())}
      />
    </div>
  );
}
