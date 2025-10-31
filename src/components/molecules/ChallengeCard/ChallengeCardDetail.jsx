'use client';

import styles from '@/styles/components/molecules/ChallengeCard/ChallengeCardDetail.module.scss';
import DropdownOption from '../Dropdown/DropdownOption';
import Image from 'next/image';

import ic_profile from '/public/icon/ic_profile.svg';
import TypeChip from '@/components/atoms/Chips/TypeChip.jsx';
import CategoryChip from '@/components/atoms/Chips/CategoryChip.jsx';
import ic_deadline from '/public/icon/ic_deadline.svg';
import ic_person from '/public/icon/ic_person.svg';
import { formatKoreanDate } from '@/libs/day.js';

const CARD_DATA = {
  challengeName: 'Next.js - App Router: Routing Fundamentals',
  type: 'Next.js',
  category: '공식문서',
  description:
    'Next.js App Router 공식 문서 중 Routing Fundamentals 내용입니다! 라우팅에 따른 폴더와 파일이 구성되는 법칙과 컨벤션 등에 대해 공부할 수 있을 것 같아요~! 다들 챌린지 많이 참여해 주세요 :)',
  user: '럽윈즈올',
  dueDate: '2025-10-22T08:30:00.000Z',
  total: 15,
  capacity: 15,
};

const ChallengeCardDetail = ({
  isMyChallenge = false,
  challengeName = CARD_DATA.challengeName,
  type = CARD_DATA.type,
  category = CARD_DATA.category,
  description = CARD_DATA.description,
  user = CARD_DATA.user,
  dueDate = CARD_DATA.dueDate,
  total = CARD_DATA.total,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const formattedDueDate = formatKoreanDate(dueDate);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.title}>{challengeName}</div>
          <DropdownOption onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className={styles.headerBottom}>
          <TypeChip label={type} color="green" />
          <CategoryChip label={category} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.description}>{description}</div>
        {isMyChallenge ? (
          <div className={styles.footer}>
            <div className={styles.dueDateWrapper}>
              <Image src={ic_deadline} alt="deadline" width={24} height={24} />
              <div className={styles.content}>{formattedDueDate}</div>
            </div>
            <div className={styles.totalWrapper}>
              <Image src={ic_person} alt="person" width={24} height={24} />
              <div className={styles.content}>{total}</div>
            </div>
          </div>
        ) : (
          <div className={styles.userInfo}>
            <Image src={ic_profile} alt="profile" width={24} height={24} />
            <div className={styles.user}>{user}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeCardDetail;
