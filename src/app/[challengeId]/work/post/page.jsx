'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCreateChallengeWorkMutation } from '@/hooks/mutations/useChallengeWorkMutations';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { showToast } from '@/components/common/Sonner';
import WorkPost from '@/components/templates/WorkPost';
import Button from '@/components/atoms/Button/Button';

import styles from '@/styles/pages/work/WorkPostPage.module.scss';
import ic_cancel from '/public/icon/ic_cancel.svg';

const WorkPostPage = () => {
  const { challengeId } = useParams();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isDraftOpen, setIsDraftOpen] = useState(true);
  const createChallengeWorkMutation = useCreateChallengeWorkMutation();

  // TODO: API 정보로 수정
  const isHasDraft = false;

  const { data: challengeDetail } = useGetChallengeDetail(challengeId);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleDraftOpen = () => {
    setIsDraftOpen((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createChallengeWorkMutation.mutate(
      {
        challengeId: challengeId,
        workItem: content,
      },
      {
        onSuccess: (data) => {
          showToast({
            kind: 'success',
            title: '작업물 제출 성공',
          });
          const attendId = data?.data?.attendId;
          if (attendId) {
            router.push(`/${challengeId}/work/${attendId}`);
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

  return (
    <div className={styles.page}>
      <WorkPost
        content={content}
        onContentChange={handleContentChange}
        onSubmitClick={handleSubmit}
        title={challengeDetail?.data?.title}
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
          <Button variant="solid" size="sm" children="불러오기" />
        </div>
      )}
    </div>
  );
};

export default WorkPostPage;
