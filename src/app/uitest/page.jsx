// 테스트 페이지 입니다. 컴포넌트 테스트 용도로 사용합니다.

'use client';

import { useState } from 'react';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard';
import CardStatusChip from '@/components/atoms/Chips/CardStatusChip';

const UiTest = () => {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '100px' }}>
      {/* <ChallengeCard isAdmin={true} /> */}
      <CardStatusChip status="isCompleted" />
      <CardStatusChip status="isClosed" />
    </div>
  );
};

export default UiTest;
