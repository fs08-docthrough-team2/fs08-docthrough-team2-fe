import styles from '@/styles/components/molecules/ChallengeCard/ChallengeCard.module.scss';
import Image from 'next/image';
import stroke from '/public/stroke.svg';
import ic_deadline from '/public/icon/ic_deadline.svg';
import ic_person from '/public/icon/ic_person.svg';
import Button from '@/components/atoms/Button/Button.jsx';
import { formatKoreanDate } from '@/libs/day.js';
import TypeChip from '@/components/atoms/Chips/TypeChip.jsx';
import CategoryChip from '@/components/atoms/Chips/CategoryChip.jsx';
import DropdownOption from '@/components/molecules/Dropdown/DropdownOption.jsx';
import CardStatusChip from '@/components/atoms/Chips/CardStatusChip.jsx';
import { useRouter } from 'next/navigation';

const CARD_DATA = {
  challengeName: 'Next.js - App Router: Routing Fundamentals',
  type: 'Next.js',
  category: '공식문서',
  status: 'ISCOMPLETED',
  dueDate: '2025-10-22T08:30:00.000Z',
  total: 15,
  capacity: 15,
};

/*
isAdmin: 어드민 여부
dueDate: 챌린지 마감일
total: 챌린지 총 인원
capacity: 챌린지 참여 가능 인원
challengeName: 챌린지 이름
type: 챌린지 타입
category: 챌린지 카테고리
status: 챌린지 상태
*/
const ChallengeCard = ({
  isAdmin,
  challengeId = '',
  challengeName = CARD_DATA.challengeName,
  type = CARD_DATA.type,
  category = CARD_DATA.category,
  status = CARD_DATA.status,
  dueDate = CARD_DATA.dueDate,
  total = CARD_DATA.total,
  capacity = CARD_DATA.capacity,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const router = useRouter();
  const formattedDueDate = formatKoreanDate(dueDate);

  const handleClick = () => {
    router.push(`/challenge/detail/${challengeId}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.statusWrapper}>
            {status === 'ISCOMPLETED' || status === 'ISCLOSED' ? (
              <CardStatusChip status={status} />
            ) : null}
            {isAdmin && <DropdownOption onEdit={onEdit} onDelete={onDelete} />}
          </div>
          <div className={styles.title}>{challengeName}</div>
        </div>
        <div className={styles.chipWrapper}>
          <TypeChip label={type} color="green" />
          <CategoryChip label={category} />
        </div>
      </div>
      <Image className={styles.stroke} src={stroke} alt="stroke" />
      <div className={styles.footerWrapper}>
        <div className={styles.footerLeft}>
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
        <Button
          variant="outline"
          size="pill"
          children="도전 계속하기"
          icon="challenge"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default ChallengeCard;
