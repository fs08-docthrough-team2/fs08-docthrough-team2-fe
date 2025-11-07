'use client';

import {
  useGetChallengeDetail,
  useGetChallengeApprovalDetail,
} from '@/hooks/queries/useChallengeQueries';
import { useCancelChallengeMutation } from '@/hooks/mutations/useChallengeMutations';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ChallengeApprovalStatus from '@/components/atoms/ChallengeApprovalStatus/ChallengeApprovalStatus';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import LinkPreview from '@/components/common/LinkPreview/LinkPreview';
import { showToast } from '@/components/common/Sonner';

import ic_stroke from '/public/stroke.svg';
import styles from '@/styles/pages/my-challenge/ChallengeApprovalDetailPage.module.scss';
import TwoButtonModal from '@/components/molecules/Modal/TwoButtonModal';

const ChallengeApprovalDetailPage = () => {
  const router = useRouter();
  const { challengeId } = useParams();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data: challengeDetail } = useGetChallengeDetail(challengeId);
  const { data: challengeApprovalDetail } = useGetChallengeApprovalDetail(challengeId);

  const cancelChallengeMutation = useCancelChallengeMutation();

  const isPending =
    challengeApprovalDetail?.data?.isApprove === false &&
    challengeApprovalDetail?.data?.isReject === false &&
    challengeApprovalDetail?.data?.isDeleted === false;

  let status = 'pending';
  if (isPending) {
    status = 'pending';
  } else if (challengeApprovalDetail?.data?.isDeleted) {
    status = 'deleted';
  } else if (challengeApprovalDetail?.data?.isReject) {
    status = 'rejected';
  }

  let reason = '';
  if (challengeApprovalDetail?.data?.isDeleted) {
    reason = challengeApprovalDetail?.data?.deleteReason;
  } else if (challengeApprovalDetail?.data?.isReject) {
    reason = challengeApprovalDetail?.data?.rejectReason;
  }

  const handlePendingChallengeCancel = () => {
    cancelChallengeMutation.mutate(
      {
        challengeId,
      },
      {
        onSuccess: () => {
          showToast({
            kind: 'success',
            title: '챌린지를 취소 성공.',
          });
          router.push('/my-challenge/apply');
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '챌린지를 취소 실패.',
          });
        },
      },
    );
  };

  return (
    <div className={styles.page}>
      {isCancelModalOpen && (
        <TwoButtonModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handlePendingChallengeCancel}
          confirmText="네"
          cancelText="아니오"
          children="정말 취소하시겠어요?"
        />
      )}
      <ChallengeApprovalStatus status={status} reason={reason} />
      <div className={styles.stroke}>
        <Image src={ic_stroke} alt="stroke" width={890} height={0} />
      </div>
      <div className={styles.content}>
        <ChallengeCardDetail
          isMyChallenge={true}
          challengeName={challengeDetail?.data?.title}
          type={challengeDetail?.data?.field}
          category={challengeDetail?.data?.type}
          description={challengeDetail?.data?.content}
          dueDate={challengeDetail?.data?.deadline}
          total={challengeDetail?.data?.maxParticipants}
          isPending={isPending}
          onCancel={() => setIsCancelModalOpen(true)}
        />
        <Image src={ic_stroke} alt="stroke" width={890} height={0} />
        <div className={styles.description}>
          <div className={styles.title}>원문 링크</div>
          <LinkPreview url={challengeDetail?.data?.source} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeApprovalDetailPage;
