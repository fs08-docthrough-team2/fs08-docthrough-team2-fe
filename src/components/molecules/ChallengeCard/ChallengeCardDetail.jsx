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

const ChallengeCardDetail = ({
  isMyChallenge = false,
  challengeName = '',
  type = '',
  typeLabel = '',
  typeColor = 'green',
  category = '',
  description = '',
  user = '',
  dueDate = '',
  total = '',
  isPending = false,
  onEdit = () => {},
  onDelete = () => {},
  onCancel = () => {},
}) => {
  const formattedDueDate = formatKoreanDate(dueDate);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.title}>{challengeName}</div>
          {isMyChallenge &&
            (isPending ? (
              <DropdownOption showCancelOnly onCancel={onCancel} />
            ) : (
              <DropdownOption onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
        <div className={styles.headerBottom}>
          <TypeChip label={typeLabel || type} color={typeColor} />
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
