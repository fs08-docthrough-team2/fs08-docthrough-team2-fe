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
import styles from '@/styles/components/templates/Work/Work.module.scss';
import { useRouter, useParams } from 'next/navigation';

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
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { challengeId, workId } = useParams();
  const [commentValue, setCommentValue] = useState('');
  const createFeedbackMutation = useCreateFeedbackMutation();

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
          queryClient.invalidateQueries({ queryKey: ['feedback-list', attendId] });
          setCommentValue('');
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
            <Image src={ic_like} alt="like" width={16} height={16} />
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
