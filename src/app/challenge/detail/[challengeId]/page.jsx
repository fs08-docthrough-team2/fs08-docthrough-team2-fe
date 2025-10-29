// src/app/challenge/detail/[challengeId]/page.jsx
'use client';

import Image from 'next/image';
import { use, useEffect, useMemo, useState } from 'react';
import styles from '@/styles/pages/challenge/detail/ChallengeDetailPage.module.scss';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import ChallengeContainer from '@/components/molecules/ChallengeContainer/ChallengeContainer';
import List from '@/components/atoms/List/List';
import icArrowLeft from '/public/icon/pagination/ic_arrow_left.svg';
import icArrowLeftDisabled from '/public/icon/pagination/ic_arrow_left_disabled.svg';
import icArrowRight from '/public/icon/pagination/ic_arrow_right.svg';
import icArrowRightDisabled from '/public/icon/pagination/ic_arrow_right_disabled.svg';

const ITEMS_PER_PAGE = 5;
const MAX_CAPACITY = 15;

const mockChallenge = {
  name: 'Next.js App Router: Routing Fundamentals',
  type: 'Next.js',
  category: '공식문서',
  description:
    'Next.js App Router 공식 문서 Routing Fundamentals 내용을 함께 읽고 정리하는 챌린지입니다. 궁금한 점은 언제든 질문으로 남겨 주세요!',
  author: '체다치즈',
  dueDate: '2025-10-22T08:30:00.000Z',
  total: 20,
  capacity: 15,
};

// 임의의 참여 현황 생성 -> 추후 api로 받아오면 수정
const mockParticipants = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  name: `참여자 ${index + 1}`,
  userType: index % 2 === 0 ? '유저' : '전문가',
  likes: 1200 - index * 37,
}));

const ChallengeDetailPage = ({ params }) => {
  const { challengeId } = use(params);
  const [currentPage, setCurrentPage] = useState(1);

  const totalParticipants = mockParticipants.length;
  const totalPages = Math.max(1, Math.min(3, Math.ceil(totalParticipants / ITEMS_PER_PAGE)));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const pageParticipants = useMemo(() => {
    const offset = (safePage - 1) * ITEMS_PER_PAGE;
    return {
      offset,
      items: mockParticipants.slice(offset, offset + ITEMS_PER_PAGE),
    };
  }, [safePage]);

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  const handlePrev = () => {
    if (canPrev) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNext = () => {
    if (canNext) {
      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    }
  };

  const currentItems = pageParticipants.items;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.headerRow}>
          <div className={styles.detailCard}>
            <ChallengeCardDetail
              challengeName={mockChallenge.name}
              type={mockChallenge.type}
              category={mockChallenge.category}
              description={mockChallenge.description}
              user={mockChallenge.author}
              onEdit={() => console.log('edit', challengeId)}
              onDelete={() => console.log('delete', challengeId)}
            />
          </div>

          <aside className={styles.sideCard}>
            <ChallengeContainer
              dueDate={mockChallenge.dueDate}
              total={mockChallenge.total}
              capacity={mockChallenge.capacity}
            />
          </aside>
        </section>

        <section className={styles.participantSection}>
          <div className={styles.participantWrapper}>
            <div className={styles.participantHeader}>
              <div className={styles.participantInfo}>
                <h2>참여 현황</h2>
              </div>
              {/** 나중에 pagination 따로 만들면 바꿀 예정 아니면 그대로 사용 */}
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
                  {safePage} / {totalPages}
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

            <ul className={styles.participantList}>
              {currentItems.length > 0 ? (
                currentItems.map((participant, index) => (
                  <List
                    key={participant.id}
                    rank={pageParticipants.offset + index + 1}
                    name={participant.name}
                    user_type={participant.userType}
                    likes={participant.likes}
                    onWorkClick={() => console.log('open work', participant.id)}
                  />
                ))
              ) : (
                <li className={styles.participantEmpty}>
                  아직 참여한 도전자가 없어요,
                  <br />
                  지금 바로 도전해보세요!
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChallengeDetailPage;
