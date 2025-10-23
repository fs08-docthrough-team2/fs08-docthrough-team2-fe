import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/components/organisms/GNB/GNB.module.scss';
import Button from '@/components/atoms/Button/Button';

// 사용자 유형 임시 설정 -> ERD 참고해서 변경
const USER_TYPES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
};

const GNB = ({ userType = USER_TYPES.GUEST, onLogin }) => {
  return (
    <header className={styles.gnbWrapper}>
      <div className={styles.gnbContainer}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/image/img_logo.svg"
            alt="Docthru 서비스 로고"
            width={109}
            height={27}
            className={styles.logoImage}
            priority
          />
        </Link>

        <nav className={styles.navigation}>
          {/* 1. 비로그인 guest */}
          {userType === USER_TYPES.GUEST && (
            <Button
              variant="outline"
              size="md"
              onClick={onLogin} // 로그인 페이지로 연결
            >
              로그인
            </Button>
          )}

          {/* 2. 일반 사용자 로그인 */}
          {userType === USER_TYPES.USER && (
            <>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icon/ic_notification.svg"
                  alt="알림"
                  width={24}
                  height={24}
                  className={styles.notificationImage}
                />
              </div>
              <div className={styles.iconWrapper}>
                <Image
                  src="/image/img_profile_user.svg"
                  alt="유저 프로필"
                  width={32}
                  height={32}
                  className={styles.profileImage}
                />
              </div>
            </>
          )}

          {/* 3. admin 로그인 */}
          {userType === USER_TYPES.ADMIN && (
            <div className={styles.iconWrapper}>
              <Image
                src="/image/img_profile_admin.svg"
                alt="관리자 프로필"
                width={32}
                height={32}
                className={styles.profileImage}
              />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GNB;
