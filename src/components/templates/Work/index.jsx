import Image from 'next/image';
import TypeChip from '@/components/atoms/Chips/TypeChip';
import CategoryChip from '@/components/atoms/Chips/CategoryChip';
import MarkdownViewer from '@/components/common/Markdown/MarkdownViewer';
import CommentInput from '@/components/atoms/Input/CommentInput';
import CommentCard from '@/components/molecules/Comment/CommentCard';
import DropdownOption from '@/components/molecules/Dropdown/DropdownOption';

import ic_profile from '/public/icon/ic_profile.svg';
import ic_like from '/public/icon/ic_like.svg';
import styles from '@/styles/components/templates/Work/Work.module.scss';

const mockMarkdown =
  '일반적으로 개발자는 일련의 하드 스킬을 가지고 있어야 커리어에서 경력과 전문성을 쌓을 수 있습니다. 하지만 이에 못지 않게 개인 브랜드 구축도 만족스럽고 성취감 있는 경력을 쌓기 위해 중요하며 이를 쌓기는 더 어려울 수 있습니다.';

const Work = ({ isMyWork = false, isAdmin = false }) => {
  return (
    <>
      <div className={styles.titleHeader}>
        <div className={styles.titleHeaderTop}>
          <div className={styles.title}>개발자로써 자신만의 브랜드를 구축하는 방법(dailydev)</div>
          {(isMyWork || isAdmin) && <DropdownOption />}
        </div>
        <div className={styles.chipWrapper}>
          <TypeChip label="DailyDev" color="green" />
          <CategoryChip label="공식문서" />
        </div>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userInfoLeft}>
          <div className={styles.userNameWrapper}>
            <Image src={ic_profile} alt="profile" width={24} height={24} />
            <div className={styles.name}>럽윈즈올</div>
          </div>
          <div className={styles.likeWrapper}>
            <Image src={ic_like} alt="like" width={16} height={16} />
            <div className={styles.likeCount}>100</div>
          </div>
        </div>
        <div className={styles.userInfoDate}>25/10/31</div>
      </div>
      <MarkdownViewer value={mockMarkdown} />
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
