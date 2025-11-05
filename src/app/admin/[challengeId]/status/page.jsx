'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChallengeApprovalStatus from '@/components/atoms/ChallengeApprovalStatus/ChallengeApprovalStatus';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import LinkPreview from '@/components/common/LinkPreview/LinkPreview';
import Button from '@/components/atoms/Button/Button';
import LoadingSpinner from '@/components/organisms/Loading/LoadingSpinner';
import { useChallengeDetailQuery } from '@/hooks/queries/useChallengeQueries';
import { useApproveChallengeMutation } from '@/hooks/mutations/useChallengeMutations';
import { showToast } from '@/components/common/Sonner';
import { formatYYMMDD } from '@/libs/day';
import styles from '@/styles/pages/admin/AdminChallengeStatusPage.module.scss';

const APPROVAL_STATUS_MAP = {
  PENDING: 'pending',
  APPROVED: 'approved',
  INPROGRESS: 'approved', // 이미 시작된 챌린지도 승인 완료로 간주
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  DEADLINE: 'cancelled',
};

const FIELD_LABEL_MAP = {
  NEXT: 'Next.js',
  API: 'API',
  CAREER: 'Career',
  MODERN: 'Modern JS',
  WEB: 'Web',
};

const TYPE_LABEL_MAP = {
  OFFICIAL: '공식문서',
  BLOG: '블로그',
};

const stroke = (
  <svg xmlns="http://www.w3.org/2000/svg" width="891" height="1" viewBox="0 0 891 1" fill="none">
    <path d="M0.5 0.5H890.5" stroke="#E5E5E5" strokeLinecap="round" />
  </svg>
);

export default function AdminChallengeStatusPage() {
  const router = useRouter();
  const { challengeId } = useParams();

  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useChallengeDetailQuery(challengeId, {
    staleTime: 0,
    enabled: Boolean(challengeId),
  });

  const approveMutation = useApproveChallengeMutation({
    onSuccess: () => {
      showToast({ kind: 'success', title: '챌린지를 승인했어요.' });
      refetch();
    },
    onError: (error) => {
      const description = error?.response?.data?.message;
      showToast({
        kind: 'error',
        title: '승인에 실패했어요.',
        description,
      });
    },
  });

  const challenge = detail?.data;

  const approvalStatus = useMemo(() => {
    if (!challenge?.status) return 'pending';
    return APPROVAL_STATUS_MAP[challenge.status] ?? 'pending';
  }, [challenge?.status]);

  const typeLabel = useMemo(
    () => TYPE_LABEL_MAP[challenge?.type] ?? challenge?.type ?? '-',
    [challenge],
  );
  const fieldLabel = useMemo(
    () => FIELD_LABEL_MAP[challenge?.field] ?? challenge?.field ?? '-',
    [challenge],
  );

  const handleApprove = () => {
    if (!challengeId || approveMutation.isPending) return;
    approveMutation.mutate(challengeId);
  };

  const showActions = challenge?.status === 'PENDING';

  if (!challengeId) {
    return (
      <section className={styles.stateWrapper}>
        <p className={styles.stateMessage}>잘못된 경로입니다.</p>
        <Button variant="solid" onClick={() => router.push('/admin')}>
          목록으로 이동
        </Button>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className={styles.stateWrapper}>
        <LoadingSpinner loading />
      </section>
    );
  }

  if (isError || !challenge) {
    return (
      <section className={styles.stateWrapper}>
        <p className={styles.stateMessage}>챌린지 정보를 불러오지 못했어요.</p>
        <div className={styles.stateActions}>
          <Button variant="solid" onClick={() => router.back()}>
            이전 화면
          </Button>
          <Button variant="solid" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className={styles.page}>
      <ChallengeApprovalStatus
        status={approvalStatus}
        userName={challenge.submittedBy ?? ''}
        reason={challenge.rejectionReason ?? ''}
        createdAt={challenge.appliedDate ? formatYYMMDD(challenge.appliedDate) : ''}
      />
      <div className={styles.stroke}>{stroke}</div>
      <div className={styles.content}>
        <ChallengeCardDetail
          isMyChallenge
          challengeName={challenge.title}
          description={challenge.content}
          type={typeLabel}
          category={fieldLabel}
          dueDate={challenge.deadline}
          total={challenge.maxParticipants}
          onEdit={() => router.push(`/admin/${challengeId}/edit`)}
        />
        {stroke}
        <div className={styles.description}>
          <div className={styles.title}>원문 링크</div>
          {challenge.source ? (
            <LinkPreview url={challenge.source} />
          ) : (
            <div className={styles.emptyLink}>등록된 링크가 없습니다.</div>
          )}
        </div>
        {showActions && (
          <div className={styles.actions}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(`/admin/${challengeId}/status/reject`)}
            >
              거절하기
            </Button>
            <Button
              variant="solid"
              size="lg"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? '승인 중…' : '승인하기'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
