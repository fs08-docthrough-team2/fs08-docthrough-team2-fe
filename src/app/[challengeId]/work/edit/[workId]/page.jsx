'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import {
  useCreateChallengeWorkDraftMutation,
  useUpdateChallengeWorkMutation,
} from '@/hooks/mutations/useChallengeWorkMutations';
import { useGetChallengeWorkDetail } from '@/hooks/queries/useChallengeWorkQueries';
import { showToast } from '@/components/common/Sonner';
import WorkPost from '@/components/templates/WorkPost';

import styles from '@/styles/pages/work/WorkEditPage.module.scss';

const WorkEditPage = () => {
  const { challengeId, workId } = useParams();
  const router = useRouter();
  const [content, setContent] = useState('');

  const queryClient = useQueryClient();
  const { data: challengeDetail } = useGetChallengeDetail(challengeId);
  const { data: challengeWorkDetail } = useGetChallengeWorkDetail(workId);
  const updateChallengeWorkMutation = useUpdateChallengeWorkMutation();
  const createChallengeWorkDraftMutation = useCreateChallengeWorkDraftMutation();

  useEffect(() => {
    if (challengeWorkDetail?.data?.item?.workItem) {
      setContent(challengeWorkDetail?.data?.item?.workItem);
    }
  }, [challengeWorkDetail]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateChallengeWorkMutation.mutate(
      {
        attendId: workId,
        workItem: content,
      },
      {
        onSuccess: () => {
          showToast({
            kind: 'success',
            title: '작업물 수정 성공',
          });
          router.push(`/${challengeId}/work/${workId}`);
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '작업물 수정 실패',
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
    router.push(`/${challengeId}/work/${workId}`);
  };

  return (
    <div className={styles.page}>
      <WorkPost
        content={content}
        onContentChange={handleContentChange}
        title={challengeDetail?.data?.title}
        onSubmitClick={handleSubmit}
        onDraftSaveClick={handleDraftSave}
        onQuitClick={handleQuit}
      />
    </div>
  );
};

export default WorkEditPage;
