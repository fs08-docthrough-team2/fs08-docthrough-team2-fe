import styles from '@/styles/components/molecules/ChallengeCard/ChallengeCard.module.scss';
import Image from 'next/image';
import stroke_lg from '/public/stroke_lg.svg';
import ic_deadline from '/public/icon/ic_deadline.svg';
import ic_person from '/public/icon/ic_person.svg';
import Button from '@/components/atoms/Button/Button';
import { formatKoreanDate } from '@/lib/day.js';
import TypeChip from '@/components/atoms/Chips/TypeChip';
import CategoryChip from '@/components/atoms/Chips/CategoryChip';

const ChallengeCard = ({
  isAdmin = false,
  dueDate = '2025-10-22T08:30:00.000Z',
  total = 15,
  capacity = 15,
  challengeName = 'Next.js - App Router: Routing Fundamentals',
  type = 'Next.js',
  category = '공식문서',
}) => {
  const formattedDueDate = formatKoreanDate(dueDate);

  return (
    <div className={styles.card}>
      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.statusWrapper}>
            <div>모집이 완료된 상태에요</div>
            {isAdmin && <button>드롭다운</button>}
          </div>
          <div className={styles.title}>{challengeName}</div>
        </div>
        <div className={styles.chipWrapper}>
          <TypeChip label={type} color="green" />
          <CategoryChip label={category} />
        </div>
      </div>
      <Image className={styles.stroke} src={stroke_lg} alt="stroke" />
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
        <Button variant="outline" size="pill" children="도전 계속하기" icon="challenge" />
      </div>
    </div>
  );
};

export default ChallengeCard;
