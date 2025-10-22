// 챌린지 참여 현황 - lists를 구성하는 각 list
// API 사용 시, id를 이용해 rank, name, user_type 등 불러오도록 수정
// user_profile 추가 시 불러오도록 수정 (유저 프로필 수정 기능 추가 시)

'use client';

import Image from 'next/image';
import styles from '@/styles/components/atoms/List/List.module.scss';

export default function List({
  rank = 1,
  name = 'John Doe',
  user_type = '유저',
  likes = 12574,
  onPortfolioClick = () => {},
}) {
  const rankLabel = rank != null ? String(rank).padStart(2, '0') : '00'; // 2자리로 표현(01, 02...)
  const likesLabel = Number.isFinite(likes) ? likes.toLocaleString() : '0';
  const profileDefault = '/profile_user.svg';
  const isTopRank = Number(rank) === 1;

  return (
    <li className={styles.listItem}>
      <div className={styles.left}>
        <div className={styles.rank}>
          {isTopRank && (
            <span className={styles.rankIcon}>
              <Image src="/icon_crown.svg" alt="rank crown" width={16} height={16} />
            </span>
          )}
          <span className={styles.rankNumber}>{rankLabel}</span>
        </div>

        <div className={styles.icon}>
          <Image
            src={profileDefault}
            alt={name ? `${name} profile` : 'Default profile'}
            width={32}
            height={32}
          />
        </div>

        <div className={styles.user}>
          <span className={styles.name}>{name}</span>
          <span className={styles.type}>{user_type}</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.likes}>
          <span className={styles.likesIcon}>
            <Image src="/heart_active.svg" alt="likes" width={16} height={16} />
          </span>
          <span className={styles.likesValue}>{likesLabel}</span>
        </div>

        <button type="button" className={styles.btn} onClick={onPortfolioClick}>
          <span>작업물 보기</span>
          <span className={styles.btnIcon}>
            <Image src="/arrow_right_list.svg" alt="view" width={16} height={16} />
          </span>
        </button>
      </div>
    </li>
  );
}
