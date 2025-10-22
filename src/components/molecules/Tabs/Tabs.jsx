// tab을 이용해 선택하고 싶은 상태를 선택할 수 있는 tabs 구성
'use client';

import { useState } from 'react';
import Tab from '../../atoms/Tab/Tab';
import styles from '@/styles/components/molecules/Tabs/Tabs.module.scss';

const DEFAULT_TABS = ['참여중인 챌린지', '완료한 챌린지', '신청한 챌린지'];

function Tabs({ onTabChange }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (typeof onTabChange === 'function') {
      onTabChange(DEFAULT_TABS[index]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {DEFAULT_TABS.map((label, index) => (
          <Tab
            key={index}
            label={label}
            isActive={index === activeIndex}
            onClick={() => handleTabClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Tabs;
