import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/components/organisms/GNB/GNB.module.scss';
import Button from '@/components/atoms/Button/Button';
import DropdownProfile from '@/components/molecules/Dropdown/DropdownProfile';
import NotificationPopup from '@/components/molecules/Popup/NotificationPopup';

const USER_TYPES = {
  GUEST: 'guest',
  USER: 'user',
  EXPERT: 'expert',
  ADMIN: 'admin',
};

const GNB = ({ userType = USER_TYPES.GUEST, onLogin, notifications = [] }) => {
  return (
    <header className={styles.gnbWrapper}>
      <div className={styles.gnbContainer}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/image/img_logo.svg"
            alt="Docthru 메인 로고"
            width={109}
            height={27}
            className={styles.logoImage}
            priority
          />
        </Link>

        <nav className={styles.navigation}>
          {/* 1. 비로그인 guest */}
          {userType === USER_TYPES.GUEST && (
            <Button variant="outline" size="md" onClick={onLogin}>
              로그인
            </Button>
          )}

          {/* 2. 일반 사용자 로그인 */}
          {(userType === USER_TYPES.USER || userType === USER_TYPES.EXPERT) && (
            <>
              <div className={styles.iconWrapper}>
                <NotificationPopup notifications={notifications} />
              </div>
              <DropdownProfile userType={userType} />
            </>
          )}

          {/* 3. admin 로그인 */}
          {userType === USER_TYPES.ADMIN && <DropdownProfile userType={USER_TYPES.ADMIN} />}
        </nav>
      </div>
    </header>
  );
};

export default GNB;
