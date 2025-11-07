'use client';

import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { useCancelChallengeMutation } from '@/hooks/mutations/useChallengeMutations';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import ChallengeApprovalStatus from '@/components/atoms/ChallengeApprovalStatus/ChallengeApprovalStatus';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import LinkPreview from '@/components/common/LinkPreview/LinkPreview';
import { showToast } from '@/components/common/Sonner';

import ic_stroke from '/public/stroke.svg';
import styles from '@/styles/pages/my-challenge/ChallengeApprovalDetailPage.module.scss';

const ChallengeApprovalDetailPage = () => {
  const { challengeId } = useParams();
  const { data: challengeDetail } = useGetChallengeDetail(challengeId);

  const cancelChallengeMutation = useCancelChallengeMutation();

  // TODO: API 연동 후 수정
  const isPending = true;

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
        },
        onError: (error) => {
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
      <ChallengeApprovalStatus />
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
          onCancel={handlePendingChallengeCancel}
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
