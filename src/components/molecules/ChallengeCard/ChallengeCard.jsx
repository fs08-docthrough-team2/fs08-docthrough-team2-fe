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
import { deriveCardStatus } from '@/utils/deriveCardStatus.js';

const CARD_DATA = {
  challengeName: 'Next.js - App Router: Routing Fundamentals',
  type: 'Next.js',
  category: '공식문서',
  status: 'ISCOMPLETED',
  dueDate: '2025-10-22T08:30:00.000Z',
  total: 15,
  capacity: 15,
};

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
  const derivedCardStatus = deriveCardStatus({ status, dueDate, total, capacity });

  const handleClick = () => {
    if (!challengeId) return; // 안전장치
    // 요구사항: 어드민 상세로 이동
    router.push(`/user/challenge/detail/${challengeId}`);
    // 유저 상세로 보내려면 아래 주석 사용
    // router.push(`/user/challenge/detail/${challengeId}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.statusWrapper}>
            {derivedCardStatus && <CardStatusChip status={derivedCardStatus} />}
            {isAdmin && <DropdownOption onEdit={onEdit} onDelete={onDelete} />}
          </div>
          <div className={styles.title}>{challengeName}</div>
        </div>

        <div className={styles.chipWrapper}>
          <TypeChip label={type} color="green" />
          <CategoryChip label={category} />
        </div>
      </div>

      {/* 버튼 클릭 가림 방지: CSS에서 pointer-events: none; 권장 */}
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

        <Button variant="outline" size="pill" icon="challenge" onClick={handleClick}>
          도전 계속하기
        </Button>
      </div>
    </div>
  );
};

export default ChallengeCard;
