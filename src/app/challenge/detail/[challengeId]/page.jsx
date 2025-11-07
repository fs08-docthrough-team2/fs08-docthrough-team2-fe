'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetChallengeDetail,
  useChallengeParticipantsQuery,
} from '@/hooks/queries/useChallengeQueries';
import { useIsAdmin } from '@/hooks/useAuthStatus';
import { useDeleteChallengeMutation } from '@/hooks/mutations/useChallengeMutations';
import { showToast } from '@/components/common/Sonner';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import ChallengeContainer from '@/components/molecules/ChallengeContainer/ChallengeContainer';
import List from '@/components/atoms/List/List';
import icArrowLeft from '/public/icon/pagination/ic_arrow_left.svg';
import icArrowLeftDisabled from '/public/icon/pagination/ic_arrow_left_disabled.svg';
import icArrowRight from '/public/icon/pagination/ic_arrow_right.svg';
import icArrowRightDisabled from '/public/icon/pagination/ic_arrow_right_disabled.svg';
import styles from '@/styles/pages/challenge/detail/ChallengeDetailPage.module.scss';

const ITEMS_PER_PAGE = 5;

const ChallengeDetailPage = () => {
  const router = useRouter();
  const { challengeId } = useParams();
  const isAdmin = useIsAdmin();
  const [page, setPage] = useState(1);
  const [topParticipantNickname, setTopParticipantNickname] = useState(null);

  const {
    data: challengeDetailRes,
    isLoading: isChallengeLoading,
    isError: isChallengeError,
  } = useGetChallengeDetail(challengeId);

  const {
    data: participantsRes,
    isLoading: isParticipantsLoading,
    isError: isParticipantsError,
  } = useChallengeParticipantsQuery({ challengeId, page, pageSize: ITEMS_PER_PAGE });

  const deleteChallengeMutation = useDeleteChallengeMutation({
    onSuccess: () => {
      showToast({ kind: 'success', title: '챌린지를 삭제했어요.' });
      router.push(isAdmin ? '/admin' : '/challenge');
    },
    onError: (error) => {
      showToast({
        kind: 'error',
        title: '삭제에 실패했어요.',
        description: error?.response?.data?.message,
      });
    },
  });

  const challenge = challengeDetailRes?.data;
  const participantsResponse = participantsRes ?? null;
  const participants = participantsResponse?.data?.participates ?? [];
  const pagination = participantsResponse?.pagination ?? {
    page,
    pageSize: ITEMS_PER_PAGE,
  };

  const pageSize = pagination.pageSize ?? ITEMS_PER_PAGE;
  const apiTotalPages = pagination.totalPages;
  const totalCount = pagination.totalCount;
  const totalParticipants = useMemo(() => {
    if (!Number.isFinite(challenge?.currentParticipants)) return null;
    return Math.max(0, challenge.currentParticipants);
  }, [challenge?.currentParticipants]);

  const totalPages = useMemo(() => {
    if (Number.isFinite(apiTotalPages)) {
      return Math.max(1, apiTotalPages);
    }
    if (Number.isFinite(totalCount)) {
      return Math.max(1, Math.ceil(totalCount / pageSize));
    }
    if (Number.isFinite(totalParticipants)) {
      return Math.max(1, Math.ceil(totalParticipants / pageSize));
    }
    return null;
  }, [apiTotalPages, totalCount, totalParticipants, pageSize]);

  const inferredTotalPages = useMemo(() => {
    if (totalPages != null) return totalPages;
    const hasFullPage = participants.length === pageSize;
    return Math.max(1, page + (hasFullPage ? 1 : 0));
  }, [totalPages, participants.length, page, pageSize]);

  useEffect(() => {
    const currentPage = pagination.page ?? page;
    if (currentPage !== 1 || participants.length === 0) return;

    const bestParticipant = participants.reduce((best, candidate) => {
      if (!best) return candidate;

      const candidateHearts = Number(candidate.hearts) || 0;
      const bestHearts = Number(best.hearts) || 0;
      if (candidateHearts > bestHearts) return candidate;
      if (candidateHearts === bestHearts) {
        const candidateRank = Number(candidate.rank) || Infinity;
        const bestRank = Number(best.rank) || Infinity;
        if (candidateRank < bestRank) return candidate;
      }
      return best;
    }, null);

    setTopParticipantNickname(bestParticipant?.nickName ?? null);
  }, [participants, pagination.page, page]);

  useEffect(() => {
    if (totalPages == null && !isParticipantsLoading && participants.length === 0 && page > 1) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  }, [totalPages, isParticipantsLoading, participants.length, page]);

  useEffect(() => {
    if (page > inferredTotalPages) {
      setPage(inferredTotalPages);
    }
  }, [page, inferredTotalPages]);

  const canPrev = page > 1;
  const canNext = page < inferredTotalPages;

  if (!challengeId) {
    return <div className={styles.page}>잘못된 접근입니다.</div>;
  }
  if (isChallengeLoading) {
    return <div className={styles.page}>챌린지 정보를 불러오는 중입니다…</div>;
  }
  if (isChallengeError || !challenge) {
    return <div className={styles.page}>챌린지 정보를 가져오지 못했습니다.</div>;
  }

  const closedStatusSet = new Set(['DEADLINE', 'ISCLOSED', 'ISCOMPLETED', 'CANCELLED']);
  const isClosedByStatus = closedStatusSet.has(challenge.status);
  const isClosedByDeadline =
    challenge.deadline && new Date(challenge.deadline).getTime() < Date.now();
  const isFull =
    Number.isFinite(challenge.currentParticipants) &&
    Number.isFinite(challenge.maxParticipants) &&
    challenge.currentParticipants >= challenge.maxParticipants;
  const isClosed = isClosedByStatus || isClosedByDeadline || isFull;

  const handlePrev = () => {
    if (canPrev) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canNext) setPage((prev) => prev + 1);
  };

  const handleEdit = () => {
    router.push(`/challenge/edit/${challengeId}`);
  };

  const handleDelete = () => {
    if (!challengeId || deleteChallengeMutation.isPending) return;
    if (!window.confirm('정말 이 챌린지를 삭제하시겠어요?')) return;
    deleteChallengeMutation.mutate(challengeId);
  };

  const authorName =
    challenge?.submittedBy ??
    topParticipantNickname ??
    challenge?.ownerNickName ??
    challenge?.author ??
    '유저';

  const roleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return '어드민';
      case 'EXPERT':
        return '전문가';
      case 'USER':
      default:
        return '유저';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.headerRow}>
          <div className={styles.detailCard}>
            <ChallengeCardDetail
              challengeName={challenge.title ?? ''}
              type={challenge.field ?? ''}
              category={challenge.type ?? ''}
              description={challenge.content ?? ''}
              user={authorName}
              dueDate={challenge.deadline}
              total={challenge.maxParticipants}
              isMyChallenge={challenge.isMine}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <aside className={styles.sideCard}>
            <ChallengeContainer
              dueDate={challenge.deadline}
              total={challenge.maxParticipants}
              capacity={challenge.currentParticipants}
              sourceUrl={challenge.source}
              onSourceClick={() => {
                if (challenge.source) {
                  window.open(challenge.source, '_blank', 'noopener,noreferrer');
                }
              }}
              onApplyClick={() => router.push(`/${challengeId}/work/post`)}
              isApplyDisabled={isClosed}
            />
          </aside>
        </section>

        <section className={styles.participantSection}>
          <div className={styles.participantWrapper}>
            <div className={styles.participantHeader}>
              <div className={styles.participantInfo}>
                <h2>참여 현황</h2>
              </div>
              <div className={styles.paginationControls}>
                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={handlePrev}
                  disabled={!canPrev}
                >
                  <Image
                    src={canPrev ? icArrowLeft : icArrowLeftDisabled}
                    alt="이전 페이지"
                    width={24}
                    height={24}
                  />
                </button>
                <span className={styles.paginationStatus}>
                  {page} / {inferredTotalPages}
                </span>
                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={handleNext}
                  disabled={!canNext}
                >
                  <Image
                    src={canNext ? icArrowRight : icArrowRightDisabled}
                    alt="다음 페이지"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>

            {isParticipantsLoading && <div>참여 현황을 불러오는 중입니다…</div>}
            {isParticipantsError && <div>참여 현황을 가져오지 못했습니다.</div>}

            {!isParticipantsLoading && !isParticipantsError && (
              <ul className={styles.participantList}>
                {participants.length > 0 ? (
                  participants.map((participant, index) => {
                    const currentPage = pagination.page ?? page;
                    const apiRank = Number(participant.rank);
                    const expectedMinRank = (currentPage - 1) * pageSize + 1;
                    const expectedMaxRank = currentPage * pageSize;
                    const hasValidApiRank =
                      Number.isFinite(apiRank) &&
                      apiRank >= expectedMinRank &&
                      apiRank <= expectedMaxRank;

                    const displayRank = hasValidApiRank
                      ? apiRank
                      : (currentPage - 1) * pageSize + (index + 1);

                    const destination = isAdmin
                      ? `/admin/${challengeId}/work/${participant.attendId}`
                      : `/${challengeId}/work/${participant.attendId}`;

                    return (
                      <List
                        key={participant.attendId}
                        rank={displayRank}
                        name={participant.nickName}
                        user_type={roleLabel(participant.role)}
                        likes={participant.hearts}
                        onWorkClick={() => router.push(destination)}
                      />
                    );
                  })
                ) : (
                  <li className={styles.participantEmpty}>
                    아직 참여자가 없습니다.
                    <br />
                    지금 바로 참여해보세요!
                  </li>
                )}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChallengeDetailPage;
