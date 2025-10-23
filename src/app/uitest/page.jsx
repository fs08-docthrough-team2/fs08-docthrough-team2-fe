// 테스트 페이지 입니다. 컴포넌트 테스트 용도로 사용합니다.

'use client';

import { useState } from 'react';
import Pagination from '@/components/molecules/Pagination/Pagination';

const UiTest = () => {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '100px' }}>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default UiTest;
