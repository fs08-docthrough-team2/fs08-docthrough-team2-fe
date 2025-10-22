// 테스트 페이지 입니다. 컴포넌트 테스트 용도로 사용합니다.

'use client';

import ToggleButton from '@/components/atoms/Button/ToggleButton';
import FeedbackButton from '@/components/atoms/Button/FeedbackButton';
import NextButton from '@/components/atoms/Button/NextButton';

const UiTest = () => {
  const handleClick = () => {
    console.log('click');
  };

  return (
    <div>
      <NextButton onClick={handleClick} />
      <FeedbackButton onClick={handleClick} />
      <FeedbackButton isActive={true} onClick={handleClick} />
    </div>
  );
};

export default UiTest;
