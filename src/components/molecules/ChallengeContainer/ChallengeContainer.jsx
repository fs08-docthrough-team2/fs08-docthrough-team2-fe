import styles from '@/styles/components/molecules/ChallengeContainer/ChallengeContainer.module.scss';
import Image from 'next/image';

import ic_deadline from '/public/icon/ic_deadline.svg';
import ic_person from '/public/icon/ic_person.svg';
import Button from '@/components/atoms/Button/Button';
import { formatKoreanDate } from '@/libs/day.js';

const ChallengeContainer = ({
  dueDate = '2025-10-22T08:30:00.000Z',
  total = 15,
  capacity = 15,
}) => {
  const formattedDueDate = formatKoreanDate(dueDate);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <div className={styles.dueDateWrapper}>
          <Image src={ic_deadline} alt="deadline" width={24} height={24} />
          <div className={styles.text}>{formattedDueDate} 마감</div>
        </div>
        <div className={styles.peopleWrapper}>
          <Image src={ic_person} alt="person" width={24} height={24} />
          <div className={styles.text}>
            {capacity}/{total}
          </div>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button variant="filled" size="md" children="원문 보기" />
        <Button variant="solid" size="md" children="작업 도전하기" />
      </div>
    </div>
  );
};

export default ChallengeContainer;
