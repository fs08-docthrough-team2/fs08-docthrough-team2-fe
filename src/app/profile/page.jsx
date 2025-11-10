'use client';

import Image from 'next/image';
import styles from '@/styles/pages/auth/ProfilePage.module.scss';
import { useGetProfile } from '@/hooks/queries/useProfileQueries';
import Spinner from '@/components/common/Spinner';

const ProfilePage = () => {
  const { data: myProfile, isLoading: isMyProfileLoading } = useGetProfile();

  const role = myProfile?.data?.user?.role;
  const profileImage =
    role === 'ADMIN' ? '/image/img_profile_admin.svg' : '/image/img_profile_user.svg';

  const USER_DATA = {
    name: myProfile?.data?.user?.nickName,
    email: myProfile?.data?.user?.email,
    role: role,
    profileImage: profileImage,
    stats: {
      myChallenges: 12,
      totalWorks: 45,
    },
  };

  return (
    <>
      {<Spinner isLoading={isMyProfileLoading} />}
      <div className={styles.page}>
        <div className={styles.container}>
          {/* 프로필 헤더 섹션 */}
          <div className={styles.profileSection}>
            <div className={styles.profileImageWrapper}>
              <Image
                src={USER_DATA.profileImage}
                alt="프로필 이미지"
                width={120}
                height={120}
                className={styles.profileImage}
              />
            </div>
            <div className={styles.profileInfo}>
              <h1 className={styles.userName}>{USER_DATA.name}</h1>
              <p className={styles.userEmail}>{USER_DATA.email}</p>
            </div>
          </div>

          {/* 통계 섹션 */}
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{USER_DATA.stats.myChallenges}</div>
              <div className={styles.statLabel}>참여 중인 챌린지</div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{USER_DATA.stats.totalWorks}</div>
              <div className={styles.statLabel}>작성한 작업물</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
