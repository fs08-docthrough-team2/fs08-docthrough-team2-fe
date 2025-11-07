'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/components/organisms/GNB/GNB.module.scss';
import Button from '@/components/atoms/Button/Button';
import DropdownProfile from '@/components/molecules/Dropdown/DropdownProfile';
import NotificationPopup from '@/components/molecules/Popup/NotificationPopup';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLogout } from '@/hooks/useAuth';

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
  '/:challengeId/work/post',
  '/:challengeId/work/edit/:workId',
  '/admin/:challengeId/work/edit/:workId',
]);

const GNB = ({ notifications = [] }) => {
  const user = useAuthStore((state) => state.user);
  const userType = user ? user.role : 'GUEST';
  const { logout } = useLogout();

  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = (pathname ?? '').replace(/\/+$/, '');
  const isHiddenRoute =
    HIDDEN_ROUTES.has(normalizedPath) ||
    /^\/[^/]+\/work\/post$/.test(normalizedPath) ||
    /^\/[^/]+\/work\/edit\/[^/]+$/.test(normalizedPath) ||
    /^\/admin\/[^/]+\/work\/edit\/[^/]+$/.test(normalizedPath);
  if (isHiddenRoute) {
    return null;
  }

  const isManagePage = normalizedPath === '/admin';
  const isChallengePage = normalizedPath.startsWith('/admin/challenge');

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSelect = (option) => {
    if (option === '로그아웃') {
      logout();
    }
  };

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
                <NotificationPopup notifications={notifications} />
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
