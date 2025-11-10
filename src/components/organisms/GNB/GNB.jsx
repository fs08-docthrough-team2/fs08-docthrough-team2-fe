'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLogout } from '@/hooks/useAuth';
import { useMyNotifications } from '@/hooks/queries/useNotificationQueries';
import { useMarkNoticeAsRead } from '@/hooks/mutations/useNotificationMutations';
import Button from '@/components/atoms/Button/Button';
import DropdownProfile from '@/components/molecules/Dropdown/DropdownProfile';
import NotificationPopup from '@/components/molecules/Popup/NotificationPopup';
import styles from '@/styles/components/organisms/GNB/GNB.module.scss';

const USER_TYPES = {
  GUEST: 'guest',
  USER: 'user',
  EXPERT: 'expert',
  ADMIN: 'admin',
};

const ADMIN_TABS = [
  { href: '/admin', label: '챌린지 관리' },
  { href: '/admin/challenge', label: '챌린지 목록' },
];

const HIDDEN_ROUTES = new Set([
  '/auth/login',
  '/auth/signup',
  '/user/:challengeId/work/post',
  '/user/:challengeId/work/edit/:workId',
  '/admin/:challengeId/work/edit/:workId',
]);

const GNB = ({ notifications: notificationsProp = [] }) => {
  const user = useAuthStore((state) => state.user);
  const userType = user ? user.role : 'GUEST';
  const { logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  const normalizedPath = (pathname ?? '').replace(/\/+$/, '');
  const isHiddenRoute =
    HIDDEN_ROUTES.has(normalizedPath) ||
    /^\/user\/[^/]+\/work\/post$/.test(normalizedPath) ||
    /^\/user\/[^/]+\/work\/edit\/[^/]+$/.test(normalizedPath) ||
    /^\/admin\/[^/]+\/work\/edit\/[^/]+$/.test(normalizedPath);

  const isManagePage = normalizedPath === '/admin';
  const isChallengePage = normalizedPath.startsWith('/admin/challenge');

  const handleLogin = () => router.push('/auth/login');
  const handleSelect = (option) => {
    if (option === '로그아웃') logout();
  };

  const {
    data: fetchedNotifications = [],
    isLoading: isNoticeLoading,
    refetch: refetchNotifications,
  } = useMyNotifications();

  const { mutateAsync: markAsRead } = useMarkNoticeAsRead();
  if (isHiddenRoute) return null;

  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(notification.id);
    } catch (error) {
      console.error('알림 읽음 처리 실패', error);
    }
  };

  const notifications = notificationsProp.length > 0 ? notificationsProp : fetchedNotifications;

  return (
    <header className={styles.gnbWrapper}>
      <div className={styles.gnbContainer}>
        <div className={styles.leftSection}>
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

          {userType === 'ADMIN' && (
            <div className={styles.adminTabGroup}>
              {ADMIN_TABS.map(({ href, label }) => {
                const isActive = href === '/admin' ? isManagePage : isChallengePage;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`${styles.adminTab} ${isActive ? styles.isActive : ''}`}
                  >
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <nav className={styles.navigation}>
          {userType === 'GUEST' && (
            <Button variant="outline" size="md" onClick={handleLogin}>
              로그인
            </Button>
          )}

          {(userType === 'USER' || userType === 'EXPERT') && (
            <>
              <div className={styles.iconWrapper}>
                <NotificationPopup
                  notifications={notifications}
                  isLoading={isNoticeLoading}
                  onRefresh={refetchNotifications}
                  onClickNotification={handleNotificationClick}
                />
              </div>
              <DropdownProfile
                userType={userType}
                userInfo={user?.nickName}
                onSelect={handleSelect}
              />
            </>
          )}

          {userType === 'ADMIN' && (
            <DropdownProfile userType="admin" userInfo={user?.nickName} onSelect={handleSelect} />
          )}
        </nav>
      </div>
    </header>
  );
};

export default GNB;
