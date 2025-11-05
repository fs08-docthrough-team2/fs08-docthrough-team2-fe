import Image from 'next/image';
import TypeChip from '@/components/atoms/Chips/TypeChip';
import CategoryChip from '@/components/atoms/Chips/CategoryChip';
import MarkdownViewer from '@/components/common/Markdown/MarkdownViewer';
import CommentInput from '@/components/atoms/Input/CommentInput';
import CommentCard from '@/components/molecules/Comment/CommentCard';
import DropdownOption from '@/components/molecules/Dropdown/DropdownOption';
import { formatKoreanDate } from '@/libs/day.js';

import ic_profile from '/public/icon/ic_profile.svg';
import ic_like from '/public/icon/ic_like.svg';
import styles from '@/styles/components/templates/Work/Work.module.scss';

const Work = ({
  isMyWork = false,
  isAdmin = false,
  title = '',
  type = '',
  category = '',
  nickName = '',
  createdAt = '',
  likeCount = 0,
  workItem = '',
}) => {
  const formattedCreatedAt = formatKoreanDate(createdAt);

  return (
    <>
      <div className={styles.titleHeader}>
        <div className={styles.titleHeaderTop}>
          <div className={styles.title}>{title}</div>
          {(isMyWork || isAdmin) && <DropdownOption />}
        </div>
        <div className={styles.chipWrapper}>
          <TypeChip label={type} color="green" />
          <CategoryChip label={category} />
        </div>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userInfoLeft}>
          <div className={styles.userNameWrapper}>
            <Image src={ic_profile} alt="profile" width={24} height={24} />
            <div className={styles.name}>{nickName}</div>
          </div>
          <div className={styles.likeWrapper}>
            <Image src={ic_like} alt="like" width={16} height={16} />
            <div className={styles.likeCount}>{likeCount}</div>
          </div>
        </div>
        <div className={styles.userInfoDate}>{formattedCreatedAt}</div>
      </div>
      <MarkdownViewer value={workItem} />
      <div className={styles.commentWrapper}>
        <CommentInput />
        <div className={styles.commentList}>
          <CommentCard variant={isAdmin ? 'admin' : 'user'} />
          <CommentCard />
          <CommentCard />
        </div>
      </div>
    </>
  );
};

export default Work;
