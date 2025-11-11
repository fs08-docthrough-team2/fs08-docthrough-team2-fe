'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetChallengeWorkDraftList,
  useGetChallengeWorkDraftDetail,
} from '@/hooks/queries/useChallengeWorkQueries';
import {
  useCreateChallengeWorkMutation,
  useCreateChallengeWorkDraftMutation,
} from '@/hooks/mutations/useChallengeWorkMutations';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { showToast } from '@/components/common/Sonner';
import WorkPost from '@/components/templates/WorkPost';
import Button from '@/components/atoms/Button/Button';
import DraftModal from '@/components/molecules/Modal/DraftModal';
import TwoButtonModal from '@/components/molecules/Modal/TwoButtonModal';
import Spinner from '@/components/common/Spinner';

import styles from '@/styles/pages/work/WorkPostPage.module.scss';
import ic_cancel from '/public/icon/ic_cancel.svg';

const WorkPostPage = () => {
  const { challengeId } = useParams();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isDraftOpen, setIsDraftOpen] = useState(true);
  const [isDraftListOpen, setIsDraftListOpen] = useState(false);
  const [selectedAttendId, setSelectedAttendId] = useState(null);
  const [loadDraftConfirmModalOpen, setLoadDraftConfirmModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const createChallengeWorkMutation = useCreateChallengeWorkMutation();
  const createChallengeWorkDraftMutation = useCreateChallengeWorkDraftMutation();
  const { data: challengeDetail, isLoading: isChallengeDetailLoading } =
    useGetChallengeDetail(challengeId);
  const { data: challengeWorkDraftList, isLoading: isChallengeWorkDraftListLoading } =
    useGetChallengeWorkDraftList();
  const { data: challengeWorkDraftDetail, isLoading: isChallengeWorkDraftDetailLoading } =
    useGetChallengeWorkDraftDetail(selectedAttendId);

  const isHasDraft = challengeWorkDraftList?.data?.items?.length > 0;
  const challengeTitle = challengeDetail?.data?.title;

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleDraftOpen = () => {
    setIsDraftOpen((prev) => !prev);
  };

  const handleDraftListOpen = () => {
    setIsDraftListOpen(true);
  };

  const handleDraftListClose = () => {
    setIsDraftListOpen(false);
  };

  const handleLoadDraft = (draft) => {
    const attendId = draft.attendId;
    setSelectedAttendId(attendId);
  };

  useEffect(() => {
    if (
      challengeWorkDraftDetail?.data?.item?.workItem &&
      selectedAttendId &&
      !loadDraftConfirmModalOpen
    ) {
      setIsDraftListOpen(false);
      setLoadDraftConfirmModalOpen(true);
    }
  }, [challengeWorkDraftDetail, selectedAttendId, loadDraftConfirmModalOpen]);

  const handleLoadDraftConfirm = () => {
    setContent(challengeWorkDraftDetail.data.item.workItem);
    setSelectedAttendId(null);
    setLoadDraftConfirmModalOpen(false);
    setIsDraftListOpen(false);
    setIsDraftOpen(false);
    showToast({
      kind: 'success',
      title: '임시 저장된 작업물을 불러왔어요.',
    });
  };

  const handleLoadDraftCancel = () => {
    setLoadDraftConfirmModalOpen(false);
    setSelectedAttendId(null);
    setIsDraftListOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createChallengeWorkMutation.mutate(
      {
        challengeId: challengeId,
        workItem: content,
        title: challengeTitle,
      },
      {
        onSuccess: (data) => {
          showToast({
            kind: 'success',
            title: '작업물 제출 성공',
          });
          const attendId = data?.data?.attendId;
          if (attendId) {
            router.replace(`/user/${challengeId}/work/${attendId}`);
          }
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '작업물 제출 실패',
          });
        },
      },
    );
  };

  const handleDraftSave = () => {
    createChallengeWorkDraftMutation.mutate(
      {
        challengeId: challengeId,
        workItem: content,
        title: challengeTitle,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['challenge-work-draft-list'] });
          showToast({
            kind: 'success',
            title: '임시 저장 성공',
          });
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '임시 저장 실패',
          });
        },
      },
    );
  };

  const handleQuit = () => {
    router.replace(`/user/challenge/detail/${challengeId}`);
  };

  return (
    <>
      {
        <Spinner
          isLoading={
            isChallengeDetailLoading ||
            isChallengeWorkDraftListLoading ||
            isChallengeWorkDraftDetailLoading
          }
        />
      }
      <div className={styles.page}>
        <WorkPost
          content={content}
          onContentChange={handleContentChange}
          onSubmitClick={handleSubmit}
          onDraftSaveClick={handleDraftSave}
          onQuitClick={handleQuit}
          title={challengeTitle}
        />
        {isHasDraft && isDraftOpen && (
          <div className={styles.draft}>
            <div className={styles.left}>
              <button className={styles.cancelButton} onClick={handleDraftOpen}>
                <Image src={ic_cancel} alt="cancel" width={24} height={24} />
              </button>
              <div className={styles.description}>
                임시 저장된 작업물이 있어요. 저장된 작업물을 불러오시겠어요??
              </div>
            </div>
            <Button variant="solid" size="sm" children="불러오기" onClick={handleDraftListOpen} />
          </div>
        )}
        {isDraftListOpen && (
          <DraftModal
            isOpen={isDraftListOpen}
            onClose={handleDraftListClose}
            drafts={challengeWorkDraftList?.data?.items}
            onLoadDraft={handleLoadDraft}
          />
        )}
        {loadDraftConfirmModalOpen && (
          <TwoButtonModal
            isOpen={loadDraftConfirmModalOpen}
            onClose={handleLoadDraftCancel}
            onConfirm={handleLoadDraftConfirm}
            children="이전 작업물을 불러오시겠어요?"
          />
        )}
      </div>
    </>
  );
};

export default WorkPostPage;
