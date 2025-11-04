'use client';

import Image from 'next/image';
import PostHeader from '@/components/organisms/PostHeader/PostHeader';
import MarkdownEditor from '@/components/common/Markdown/MarkdownEditor';

import styles from '@/styles/components/templates/Work/WorkPost.module.scss';
import stroke_gray from '/public/stroke.svg';

const WorkPost = ({
  content = '',
  onContentChange = () => {},
  title = '개발자로써 자신만의 브랜드를 구축하는 방법(dailydev)',
}) => {
  return (
    <>
      <PostHeader />
      <div className={styles.contentWrapper}>
        <div className={styles.contentHeader}>
          <div className={styles.title}>{title}</div>
        </div>
        <Image src={stroke_gray} alt="stroke" width={890} height={0} />
        <MarkdownEditor value={content} onChange={onContentChange} />
      </div>
    </>
  );
};

export default WorkPost;
