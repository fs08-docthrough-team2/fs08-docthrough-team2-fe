'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/pages/auth/ProfilePage.module.scss';
import { useGetProfile } from '@/hooks/queries/useProfileQueries';
import Spinner from '@/components/common/Spinner';
import { useUpdateProfileMutation } from '@/hooks/mutations/useProfileMutations';
import { showToast } from '@/components/common/Sonner';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const { data: myProfile, isLoading: isMyProfileLoading } = useGetProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  const role = myProfile?.data?.role;
  const profileImage =
    role === 'ADMIN' ? '/image/img_profile_admin.svg' : '/image/img_profile_user.svg';

  const USER_DATA = {
    name: myProfile?.data?.nickName,
    email: myProfile?.data?.email,
    role: role,
    profileImage: profileImage,
    stats: {
      myChallenges: myProfile?.data?.challengeCount,
      totalWorks: myProfile?.data?.workCount,
    },
  };

  const handleEditClick = () => {
    setEditName(USER_DATA.name || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handleSave = () => {
    setIsEditing(false);
    updateProfileMutation.mutate(
      {
        nickName: editName,
      },
      {
        onSuccess: () => {
          showToast({
            kind: 'success',
            title: '닉네임 수정 성공',
          });
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '닉네임 수정 실패',
          });
        },
      },
    );
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
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.nameInput}
                  autoFocus
                />
              ) : (
                <h1 className={styles.userName}>{USER_DATA.name}</h1>
              )}
              <p className={styles.userEmail}>{USER_DATA.email}</p>
              {isEditing ? (
                <div className={styles.editActionButtons}>
                  <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                    취소
                  </button>
                  <button type="button" className={styles.saveButton} onClick={handleSave}>
                    완료
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.profileEditButton}
                  onClick={handleEditClick}
                >
                  프로필 편집
                </button>
              )}
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
