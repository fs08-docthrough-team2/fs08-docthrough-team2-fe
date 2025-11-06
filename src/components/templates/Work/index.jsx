'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import TypeChip from '@/components/atoms/Chips/TypeChip';
import CategoryChip from '@/components/atoms/Chips/CategoryChip';
import MarkdownViewer from '@/components/common/Markdown/MarkdownViewer';
import CommentInput from '@/components/atoms/Input/CommentInput';
import DropdownOption from '@/components/molecules/Dropdown/DropdownOption';
import CommentCardList from '@/components/organisms/CommentCardList';
import { formatKoreanDate } from '@/libs/day.js';
import { useCreateFeedbackMutation } from '@/hooks/mutations/useFeedbackMutations';

import ic_profile from '/public/icon/ic_profile.svg';
import ic_like from '/public/icon/ic_like.svg';
import ic_like_active from '/public/icon/ic_heart_active.svg';
import styles from '@/styles/components/templates/Work/Work.module.scss';
import { useRouter, useParams } from 'next/navigation';
import { useLikeToggleMutation } from '@/hooks/mutations/useChallengeWorkMutations';
import { showToast } from '@/components/common/Sonner';

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
  attendId = '',
  likeByMe = false,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { challengeId, workId } = useParams();
  const [commentValue, setCommentValue] = useState('');
  const [isLiked, setIsLiked] = useState(likeByMe);

  const createFeedbackMutation = useCreateFeedbackMutation();
  const likeToggleMutation = useLikeToggleMutation();

  const formattedCreatedAt = formatKoreanDate(createdAt);

  const userVariant = isAdmin ? 'admin' : 'user';

  const handleCommentValueChange = (e) => {
    setCommentValue(e.target.value);
  };

  const handleCommentSubmit = (value) => {
    createFeedbackMutation.mutate(
      {
        attendId,
        content: value,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['feedback-list-infinite', attendId] });
          setCommentValue('');
        },
      },
    );
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    likeToggleMutation.mutate(
      {
        attendId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['challenge-work-detail', attendId] });
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '좋아요 실패',
          });
        },
      },
    );
  };

  const handleEdit = () => {
    router.push(`/${challengeId}/work/edit/${workId}`);
  };

  const handleDelete = () => {
    console.log('delete');
  };

  return (
    <>
      <div className={styles.titleHeader}>
        <div className={styles.titleHeaderTop}>
          <div className={styles.title}>{title}</div>
          {(isMyWork || isAdmin) && <DropdownOption onEdit={handleEdit} onDelete={handleDelete} />}
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
            <button className={styles.likeButton} onClick={handleLike}>
              <Image src={isLiked ? ic_like_active : ic_like} alt="like" width={16} height={16} />
            </button>
            <div className={styles.likeCount}>{likeCount}</div>
          </div>
        </div>
        <div className={styles.userInfoDate}>{formattedCreatedAt}</div>
      </div>
      <MarkdownViewer value={workItem} />
      <div className={styles.commentWrapper}>
        <CommentInput
          value={commentValue}
          onChange={handleCommentValueChange}
          onSubmit={handleCommentSubmit}
        />
        <CommentCardList userVariant={userVariant} attendId={attendId} />
      </div>
    </>
  );
};

export default Work;
