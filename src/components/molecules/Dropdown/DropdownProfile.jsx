'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DropdownList from '../../atoms/Dropdown/DropdownList';
import styles from '@/styles/components/molecules/Dropdown/DropdownProfile.module.scss';

const PROFILE_CONFIG = {
  // 추후 API로 데이터 받아오면 수정 (이름 변경하도록)
  user: {
    image: {
      src: '/image/img_profile_user.svg',
      alt: '유저 프로필',
      width: 32,
      height: 32,
    },
    userInfo: {
      name: '체다치즈',
    },
    options: ['나의 챌린지', '로그아웃'],
  },
  admin: {
    image: {
      src: '/image/img_profile_admin.svg',
      alt: '어드민 프로필',
      width: 32,
      height: 32,
    },
    userInfo: {
      name: '어드민 체다asdfasdfasd치즈',
    },
    options: ['로그아웃'],
  },
};

const ROLE_LABEL_BY_TYPE = {
  admin: '어드민',
  user: '유저',
  expert: '전문가',
};

const OPTION_ROUTE_MAP = {
  '나의 챌린지': '/my-challenge',
};

function DropdownProfile({ userType = 'user', options, userInfo, onSelect }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const baseConfig = PROFILE_CONFIG[userType] ?? PROFILE_CONFIG.user;
  const resolvedOptions = options ?? baseConfig.options;
  const resolvedUserInfo = userInfo ? { name: userInfo } : baseConfig.userInfo;
  const profileImage = baseConfig.image;
  const roleLabel = ROLE_LABEL_BY_TYPE[userType] ?? ROLE_LABEL_BY_TYPE.user;

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    setIsOpen(false);
    const trimmed = option.trim();
    const nextRoute = OPTION_ROUTE_MAP[trimmed];
    if (nextRoute) {
      router.push(nextRoute);
      return;
    }
    onSelect?.(option, userType);
  };

  const getOptionClassName = (option) => {
    if (option.trim() === '로그아웃') {
      return styles.profileOptionLogout;
    }
    return styles.profileOptionPrimary;
  };

  return (
    <div className={styles.dropdown}>
      <button type="button" className={styles.optionTriggerButton} onClick={handleToggle}>
        <Image
          src={profileImage.src}
          alt={profileImage.alt}
          width={profileImage.width}
          height={profileImage.height}
          className={styles.profileImage}
          priority
        />
      </button>

      {isOpen && (
        <div className={styles.profileMenu} role="menu">
          {resolvedUserInfo?.name && (
            <div className={styles.profileHeader}>
              <Image
                src={profileImage.src}
                alt={profileImage.alt}
                width={profileImage.width}
                height={profileImage.height}
                className={styles.profileImage}
              />
              <div className={styles.headerText}>
                <span className={styles.headerName}>{resolvedUserInfo.name}</span>
                <span className={styles.headerRole}>{roleLabel}</span>
              </div>
            </div>
          )}

          {/* 유저(일반/전문가)/어드민에 따라 리스트 변경 */}
          <DropdownList
            options={resolvedOptions}
            isOpen={isOpen}
            onSelect={handleSelect}
            listClassName={styles.optionList}
            listItemClassName={styles.profileListItem}
            optionClassName={styles.profileOption}
            getOptionClassName={getOptionClassName}
            showDivider={false}
            variant="inline"
            onClickOutside={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default DropdownProfile;
