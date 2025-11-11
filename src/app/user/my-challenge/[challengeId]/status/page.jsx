'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetChallengeDetail,
  useGetChallengeApprovalDetail,
} from '@/hooks/queries/useChallengeQueries';
import { useCancelChallengeMutation } from '@/hooks/mutations/useChallengeMutations';
import { showToast } from '@/components/common/Sonner';
import { formatToKoreanHyphenDate } from '@/libs/day';
import ChallengeApprovalStatus from '@/components/atoms/ChallengeApprovalStatus/ChallengeApprovalStatus';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import LinkPreview from '@/components/common/LinkPreview/LinkPreview';
import TwoButtonModal from '@/components/molecules/Modal/TwoButtonModal';

import ic_stroke from '/public/stroke.svg';
import styles from '@/styles/pages/my-challenge/ChallengeApprovalDetailPage.module.scss';
import Spinner from '@/components/common/Spinner';

const TYPE_CHIP_MAP = {
  NEXT: { label: 'Next.js', color: 'green' },
  API: { label: 'API', color: 'orange' },
  CAREER: { label: 'Career', color: 'blue' },
  MODERN: { label: 'Modern JS', color: 'red' },
  WEB: { label: 'Web', color: 'yellow' },
};

const ChallengeApprovalDetailPage = () => {
  const router = useRouter();
  const { challengeId } = useParams();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data: challengeDetail, isLoading: isChallengeDetailLoading } =
    useGetChallengeDetail(challengeId);
  const { data: challengeApprovalDetail, isLoading: isChallengeApprovalDetailLoading } =
    useGetChallengeApprovalDetail(challengeId);

  const cancelChallengeMutation = useCancelChallengeMutation();

  const challengeField = challengeDetail?.data?.field ?? '';
  const challengeTypeMeta = useMemo(() => {
    if (!challengeField) return { label: '', color: 'green' };
    const normalized = String(challengeField).toUpperCase();
    return TYPE_CHIP_MAP[normalized] ?? { label: challengeField, color: 'green' };
  }, [challengeField]);

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
  } else if (challengeApprovalDetail?.data?.isApprove) {
    status = 'approved';
  }

  let reason = '';
  if (challengeApprovalDetail?.data?.isDeleted) {
    reason = challengeApprovalDetail?.data?.deleteReason;
  } else if (challengeApprovalDetail?.data?.isReject) {
    reason = challengeApprovalDetail?.data?.rejectReason;
  }

  const formattedDate = formatToKoreanHyphenDate(challengeApprovalDetail?.data?.updatedAt);

  const handlePendingChallengeCancel = () => {
    cancelChallengeMutation.mutate(
      {
        challengeId,
      },
      {
        onSuccess: () => {
          showToast({
            kind: 'success',
            title: '챌린지 취소 성공',
          });
          router.push('/user/my-challenge/apply');
        },
        onError: () => {
          showToast({
            kind: 'error',
            title: '챌린지 취소 실패',
          });
        },
      },
    );
  };

  return (
    <>
      <Spinner isLoading={isChallengeDetailLoading || isChallengeApprovalDetailLoading} />
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
        <ChallengeApprovalStatus status={status} reason={reason} createdAt={formattedDate} />
        <div className={styles.stroke}>
          <Image src={ic_stroke} alt="stroke" width={890} height={0} />
        </div>
        <div className={styles.content}>
          <ChallengeCardDetail
            isMyChallenge={true}
            challengeName={challengeDetail?.data?.title}
            type={challengeField}
            typeLabel={challengeTypeMeta.label}
            typeColor={challengeTypeMeta.color}
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
    </>
  );
};

export default ChallengeApprovalDetailPage;
