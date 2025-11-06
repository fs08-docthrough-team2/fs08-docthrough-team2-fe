'use client';

import CommentCard from '@/components/molecules/Comment/CommentCard';
import { formatToKoreanTime } from '@/libs/day.js';

import styles from '@/styles/components/organisms/CommentCardList/CommentCardList.module.scss';

const CommentCardList = ({
  userVariant = 'user',
  comments = [],
  onUpdate = () => {},
  onDelete = () => {},
  onCancel = () => {},
}) => {
  return (
    <div className={styles.commentList}>
      {comments?.map((comment) => (
        <CommentCard
          key={comment?.feedbackId}
          feedbackId={comment?.feedbackId}
          variant={userVariant}
          name={comment?.user?.nickName}
          date={formatToKoreanTime(comment?.createdAt)}
          text={comment?.content}
          onUpdate={(feedbackId, content) => onUpdate(feedbackId, content)}
          onDelete={(feedbackId) => onDelete(feedbackId)}
        />
      ))}
    </div>
  );
};

export default CommentCardList;
