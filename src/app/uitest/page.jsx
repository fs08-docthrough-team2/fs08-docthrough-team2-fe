// 테스트 페이지 입니다. 컴포넌트 테스트 용도로 사용합니다.

'use client';

import ChallengeContainer from '@/components/molecules/ChallengeContainer/ChallengeContainer';

const UiTest = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '100px' }}>
      <ChallengeContainer />
    </div>
  );
};

export default UiTest;
