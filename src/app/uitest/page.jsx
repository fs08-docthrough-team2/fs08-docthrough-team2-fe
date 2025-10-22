// 테스트 페이지 입니다. 컴포넌트 테스트 용도로 사용합니다.

'use client';

import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard';

const UiTest = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '100px' }}>
      <ChallengeCard />
    </div>
  );
};

export default UiTest;
