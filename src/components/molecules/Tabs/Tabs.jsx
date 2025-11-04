// tab을 이용해 선택하고 싶은 상태를 선택할 수 있는 tabs 구성
'use client';

import Tab from '../../atoms/Tab/Tab';
import styles from '@/styles/components/molecules/Tabs/Tabs.module.scss';

const DEFAULT_TABS = ['참여중인 챌린지', '완료한 챌린지', '신청한 챌린지'];

function Tabs({ tabs = DEFAULT_TABS, activeIndex = 0, onTabChange }) {
  const handleTabClick = (index) => {
    if (typeof onTabChange === 'function') {
      onTabChange(index);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {tabs.map((label, index) => (
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
