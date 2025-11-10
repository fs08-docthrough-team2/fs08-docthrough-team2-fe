import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { deriveCardStatus } from '@/utils/deriveCardStatus.js';
import { formatKoreanDate } from '@/libs/day.js';
import TypeChip from '@/components/atoms/Chips/TypeChip.jsx';
import CategoryChip from '@/components/atoms/Chips/CategoryChip.jsx';
import DropdownOption from '@/components/molecules/Dropdown/DropdownOption.jsx';
import CardStatusChip from '@/components/atoms/Chips/CardStatusChip.jsx';

import stroke from '/public/stroke.svg';
import ic_deadline from '/public/icon/ic_deadline.svg';
import ic_person from '/public/icon/ic_person.svg';
import styles from '@/styles/components/molecules/ChallengeCard/ChallengeCard.module.scss';

const TYPE_CHIP_MAP = {
  NEXT: {
    label: 'Next.js',
    color: 'green',
  },
  API: {
    label: 'API',
    color: 'orange',
  },
  CAREER: {
    label: 'Career',
    color: 'blue',
  },
  MODERN: {
    label: 'Modern JS',
    color: 'red',
  },
  WEB: {
    label: 'Web',
    color: 'yellow',
  },
};

const ChallengeCard = ({
  isAdmin,
  challengeId = '',
  challengeName = '',
  type = '',
  category = '',
  status = '',
  dueDate = '',
  total = '',
  capacity = '',
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const router = useRouter();
  const formattedDueDate = formatKoreanDate(dueDate);
  const derivedCardStatus = deriveCardStatus({ status, dueDate, total, capacity });

  const handleClick = () => {
    isAdmin
      ? router.push(`/admin/challenge/detail/${challengeId}`)
      : router.push(`/user/challenge/detail/${challengeId}`);
  };

  const handleCardClick = (e) => {
    // 버튼이나 드롭다운 클릭 시에는 카드 클릭 이벤트 방지
    if (e.target.closest('button, a, [role="button"]')) {
      return;
    }
    handleClick();
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.contentWrapper}>
        <div
          className={clsx(styles.titleWrapper, {
            [styles.titleWrapperWithStatus]: derivedCardStatus,
          })}
        >
          <div className={styles.statusWrapper}>
            {derivedCardStatus && <CardStatusChip status={derivedCardStatus} />}
            {isAdmin && derivedCardStatus && <DropdownOption onEdit={onEdit} onDelete={onDelete} />}
          </div>
          <div className={styles.titleWrapperInner}>
            <div className={styles.title}>{challengeName}</div>
            {isAdmin && !derivedCardStatus && (
              <DropdownOption onEdit={onEdit} onDelete={onDelete} />
            )}
          </div>
        </div>

        <div className={styles.chipWrapper}>
          <TypeChip label={TYPE_CHIP_MAP[type].label} color={TYPE_CHIP_MAP[type].color} />
          <CategoryChip label={category} />
        </div>
      </div>

      <Image className={styles.stroke} src={stroke} alt="stroke" />

      <div className={styles.footerWrapper}>
        <div className={styles.dueDateWrapper}>
          <Image src={ic_deadline} alt="deadline" width={24} height={24} />
          <div className={styles.dueDate}>{formattedDueDate} 마감</div>
        </div>
        <div className={styles.peopleWrapper}>
          <Image src={ic_person} alt="person" width={24} height={24} />
          <div className={styles.people}>
            {capacity}/{total} 참여완료
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
