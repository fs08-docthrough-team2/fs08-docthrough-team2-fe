'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import TypeChip from '@/components/atoms/Chips/TypeChip';
import CategoryChip from '@/components/atoms/Chips/CategoryChip';
import MarkdownViewer from '@/components/common/Markdown/MarkdownViewer';
import CommentInput from '@/components/atoms/Input/CommentInput';
import DropdownOption from '@/components/molecules/Dropdown/DropdownOption';
import CommentCardList from '@/components/organisms/CommentCardList';
import { formatKoreanDate } from '@/libs/day.js';
import {
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} from '@/hooks/mutations/useFeedbackMutations';
import { useGetFeedbackListInfinite } from '@/hooks/queries/useFeedbackQueries';

import ic_profile from '/public/icon/ic_profile.svg';
import ic_like from '/public/icon/ic_like.svg';
import ic_like_active from '/public/icon/ic_heart_active.svg';
import styles from '@/styles/components/templates/Work/Work.module.scss';
import { useRouter, useParams } from 'next/navigation';
import { useLikeToggleMutation } from '@/hooks/mutations/useChallengeWorkMutations';
import { showToast } from '@/components/common/Sonner';
import TwoButtonModal from '@/components/molecules/Modal/TwoButtonModal';
import { useDeleteChallengeWorkMutation } from '@/hooks/mutations/useChallengeWorkMutations';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  const createFeedbackMutation = useCreateFeedbackMutation();
  const updateFeedbackMutation = useUpdateFeedbackMutation();
  const deleteFeedbackMutation = useDeleteFeedbackMutation();
  const likeToggleMutation = useLikeToggleMutation();
  const deleteChallengeWorkMutation = useDeleteChallengeWorkMutation();

  const {
    data: feedbackList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFeedbackListInfinite(attendId);

  const formattedCreatedAt = formatKoreanDate(createdAt);

  const userVariant = isAdmin ? 'admin' : 'user';

  const comments = feedbackList?.pages?.flatMap((page) => page?.data?.items || []) ?? [];

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

  const handleWorkEdit = () => {
    if (isAdmin) {
      router.push(`/admin/${challengeId}/work/edit/${workId}`);
    } else {
      router.push(`/${challengeId}/work/edit/${workId}`);
    }
  };

  const handleWorkDelete = () => {
    if (!isAdmin) {
      setIsDeleteConfirmModalOpen(true);
    } else if (isAdmin) {
      setIsDeleteModalOpen(true);
    }
  };

  /*
  TODO 어드민 삭제 관련 로직 추가
  const handleDeleteReasonChange = (e) => {
    setDeleteReason(e.target.value);
  };

  const handleAdminDeleteWithReason = () => {
    console.log('handleAdminDeleteWithReason', deleteReason);
  }
  */

  const handleWorkDeleteConfirm = () => {
    console.log('handleWorkDeleteConfirm');
    setIsDeleteConfirmModalOpen(false);
    deleteChallengeWorkMutation.mutate(
      {
        attendId: workId,
      },
      {
        onSuccess: () => {
          showToast({
            kind: 'success',
            title: '작업물 삭제 성공',
          });
          router.push(`/challenge/detail/${challengeId}`);
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '작업물 삭제 실패',
          });
        },
      },
    );
  };

  const handleCommentUpdate = (feedbackId, content) => {
    console.log('comment update', feedbackId, content);
    updateFeedbackMutation.mutate(
      {
        feedbackId,
        content,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['feedback-list-infinite', attendId] });
          showToast({
            kind: 'success',
            title: '댓글 수정 성공',
          });
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '댓글 수정 실패',
          });
        },
      },
    );
  };

  const handleCommentDelete = (feedbackId) => {
    console.log('handleCommentDelete', feedbackId);
    deleteFeedbackMutation.mutate(
      {
        feedbackId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['feedback-list-infinite', attendId] });
          showToast({
            kind: 'success',
            title: '댓글 삭제 성공',
          });
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '댓글 삭제 실패',
          });
        },
      },
    );
  };

  // TODO 어드민 삭제 사유 모달 추가

  return (
    <>
      {isDeleteConfirmModalOpen && (
        <TwoButtonModal
          isOpen={isDeleteConfirmModalOpen}
          onClose={() => setIsDeleteConfirmModalOpen(false)}
          onConfirm={handleWorkDeleteConfirm}
          children="정말 삭제하시겠어요?"
        />
      )}
      <div className={styles.titleHeader}>
        <div className={styles.titleHeaderTop}>
          <div className={styles.title}>{title}</div>
          {(isMyWork || isAdmin) && (
            <DropdownOption onEdit={handleWorkEdit} onDelete={handleWorkDelete} />
          )}
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
        <CommentCardList
          userVariant={userVariant}
          comments={comments}
          onUpdate={handleCommentUpdate}
          onDelete={handleCommentDelete}
        />
      </div>
    </>
  );
};

export default Work;
