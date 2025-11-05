'use client';

import { useMemo, useState } from 'react';
import { useChallenges } from '@/hooks/queries/useChallenge';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';
import Pagination from '@/components/molecules/Pagination/Pagination.jsx';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard.jsx';
import styles from '@/styles/pages/ChallengeList.module.scss';
import FilterPopup from '@/components/molecules/Popup/FilterPopup';

function toKoDateText(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) + ' 마감'
    );
  } catch {
    return '';
  }
}

export default function ChallengeListPage() {
  // ── 컨트롤 상태
  const [title, setTitle] = useState(''); // 검색어
  const [field, setField] = useState(''); // 분야
  const [type, setType] = useState(''); // 문서 타입
  const [status, setStatus] = useState(''); // 상태
  const [sort, setSort] = useState('asc'); // 마감일 asc|desc
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // ── 서버 호출 (훅: 항상 위에서 호출)
  const params = useMemo(
    () => ({ title, field, type, status, page, pageSize, sort }),
    [title, field, type, status, page, pageSize, sort],
  );

  const { data, isLoading, isError, error, isFetching, status: qStatus } = useChallenges(params);

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1 };

  const cards = useMemo(
    () =>
      items.map((ch) => ({
        key: ch.challengeId ?? ch.no ?? ch.id,
        title: ch.title ?? '제목 없음',
        tags: [ch.field, ch.type].filter(Boolean),
        dateText: toKoDateText(ch.deadline),
        progressText:
          typeof ch.currentParticipants === 'number' && typeof ch.maxParticipants === 'number'
            ? `${ch.currentParticipants}/${ch.maxParticipants} 참여중`
            : '',
        badge: ch.status ?? '',
      })),
    [items],
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <ChallengeListToolbar
          search={title}
          onSearchChange={(v) => {
            const next = v?.target ? v.target.value : v;
            setPage(1);
            setTitle(next);
          }}
          onCreateClick={() => (window.location.href = '/challenge/post')}
          filterSlot={
            <FilterPopup
              onApply={(f) => {
                setField(f?.field || '');
                setType(f?.type || '');
                setStatus(f?.status || '');
                setSort(f?.sort || 'asc');
                setPage(1);
              }}
              onReset={() => {
                setField('');
                setType('');
                setStatus('');
                setSort('asc');
                setPage(1);
              }}
              onClose={() => {}}
            />
          }
        />
      </header>

      {/* 상태를 화면에 확실히 드러내기 */}
      {isLoading && <section className={styles.list}>불러오는 중…</section>}
      {isError && <section className={styles.list}>에러: {error?.message || '요청 실패'}</section>}

      {!isLoading && !isError && (
        <>
          <section className={styles.list}>
            {cards.length === 0 ? (
              <div className={styles.empty}>조건에 맞는 챌린지가 없어요.</div>
            ) : (
              cards.map((c) => (
                <ChallengeCard
                  key={c.key}
                  title={c.title}
                  tags={c.tags}
                  dateText={c.dateText}
                  progressText={c.progressText}
                  badge={c.badge}
                />
              ))
            )}
          </section>

          <nav className={styles.pagination}>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={(next) => setPage(next)}
            />
            {/* 디버깅 보조용 (원하면 숨겨도 됨) */}
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
              {`status: ${qStatus}, fetching: ${String(isFetching)}`}
            </div>
          </nav>
        </>
      )}
    </main>
  );
}
