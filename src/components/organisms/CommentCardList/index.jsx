'use client';

import styles from '@/styles/components/organisms/CommentCardList/CommentCardList.module.scss';
import { useGetFeedbackListInfinite } from '@/hooks/queries/useFeedbackQueries';
import CommentCard from '@/components/molecules/Comment/CommentCard';
import { formatToKoreanTime } from '@/libs/day.js';
import { useEffect } from 'react';

const CommentCardList = ({ userVariant = 'user', attendId = '' }) => {
  const {
    data: feedbackList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFeedbackListInfinite(attendId);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      const scrollBottom = scrollTop + clientHeight;
      const isNearBottom = scrollHeight - scrollBottom <= clientHeight * 0.5;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const comments = feedbackList?.pages?.flatMap((page) => page?.data?.items || []) ?? [];

  return (
    <div className={styles.commentList}>
      {comments?.map((comment) => (
        <CommentCard
          key={comment?.feedback_id}
          variant={userVariant}
          name={comment?.user?.nick_name}
          date={formatToKoreanTime(comment?.created_at)}
          text={comment?.content}
        />
      ))}
    </div>
  );
};

export default CommentCardList;
