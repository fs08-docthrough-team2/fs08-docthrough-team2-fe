import { useState } from 'react';
import styles from '@/styles/components/atoms/Input/SearchInput.module.scss';

export default function SearchInput({
  placeholder = '챌린지 이름을 검색해보세요',
  value,
  onChange,
  onSearch,
}) {
  const [keyword, setKeyword] = useState(value ?? '');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(keyword.trim());
    }
  };

  return (
    <div className={styles.inputWrap}>
      <div className={styles.leftNode}>
        <img src="/icons/search.svg" alt="검색" width={24} height={24} />
      </div>

      <input
        className={styles.input}
        type="search"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          onChange?.(e);
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
