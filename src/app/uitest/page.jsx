// 테스트 페이지 입니다. 컴포넌트 테스트 용도로 사용합니다.

'use client';

import ToggleButton from '@/components/atoms/Button/ToggleButton';

const UiTest = () => {
  const handleClick = () => {
    console.log('click');
  };

  return (
    <div>
      <ToggleButton type="radio" onClick={handleClick} checked={true} />
    </div>
  );
};

export default UiTest;
