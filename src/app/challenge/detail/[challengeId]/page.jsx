'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetChallengeDetail,
  useChallengeParticipantsQuery,
} from '@/hooks/queries/useChallengeQueries';
import { useIsAdmin } from '@/hooks/useAuthStatus';
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
  const [page, setPage] = useState(1);
  const isAdmin = useIsAdmin();

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

  const challenge = challengeDetailRes?.data;
  const participantsResponse = participantsRes ?? null;
  const participants = participantsResponse?.data?.participates ?? [];
  const pagination = participantsResponse?.pagination ?? {
    page,
    pageSize: ITEMS_PER_PAGE,
  };

  const totalPages = useMemo(() => {
    if (pagination.totalPages) return pagination.totalPages;
    const pageSize = pagination.pageSize ?? ITEMS_PER_PAGE;
    return participants.length === pageSize ? page + 1 : page;
  }, [pagination, participants.length, page]);

  const canPrev = page > 1;
  const canNext = canPrev
    ? page < totalPages
    : participants.length === (pagination.pageSize ?? ITEMS_PER_PAGE);

  if (!challengeId) {
    return <div className={styles.page}>잘못된 접근입니다.</div>;
  }
  if (isChallengeLoading) {
    return <div className={styles.page}>챌린지 정보를 불러오는 중입니다…</div>;
  }
  if (isChallengeError || !challenge) {
    return <div className={styles.page}>챌린지 정보를 가져오지 못했습니다.</div>;
  }

  // 더 이상 참여할 수 없는 상태인지 확인
  const closedStatusSet = new Set(['DEADLINE', 'ISCLOSED', 'ISCOMPLETED', 'CANCELLED']);
  const isClosedByStatus = closedStatusSet.has(challenge.status);
  const isClosedByDeadline =
    challenge.deadline && new Date(challenge.deadline).getTime() < Date.now();
  const isFull =
    Number.isFinite(challenge.currentParticipants) &&
    Number.isFinite(challenge.maxParticipants) &&
    challenge.currentParticipants >= challenge.maxParticipants;
  const isClosed = isClosedByStatus || isClosedByDeadline || isFull;

  const handlePrev = () => canPrev && setPage((prev) => prev - 1);
  const handleNext = () => canNext && setPage((prev) => prev + 1);

  const lastSubmittedLabel = (isoString) => {
    if (!isoString) return '제출 이력 없음';
    try {
      const date = new Date(isoString);
      return `마지막 제출 ${date.toLocaleDateString('ko-KR')}`;
    } catch {
      return '마지막 제출 미상';
    }
  };

  console.log('participate-list response', participantsResponse);
  console.log('rendering participants', participants);

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
              user={challenge.submittedBy ?? ''}
              dueDate={challenge.deadline}
              total={challenge.maxParticipants}
              isMyChallenge={challenge.isMine}
              onEdit={() => router.push(`/challenge/edit/${challengeId}`)}
              onDelete={() => console.log('TODO: delete challenge', challengeId)}
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
                  {page} / {totalPages}
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
                  participants.map((participant) => (
                    <List
                      key={participant.attendId}
                      rank={participant.rank}
                      name={participant.nickName}
                      user_type={lastSubmittedLabel(participant.lastSubmittedAt)}
                      likes={participant.hearts}
                      onWorkClick={() => {
                        const basePath = isAdmin
                          ? `/admin/${challengeId}/work/${participant.attendId}`
                          : `/${challengeId}/work/${participant.attendId}`;
                        router.push(basePath);
                      }}
                    />
                  ))
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
