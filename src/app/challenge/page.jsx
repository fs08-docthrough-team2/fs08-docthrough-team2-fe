'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useChallenges } from '@/hooks/queries/useChallenge';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';
import Pagination from '@/components/molecules/Pagination/Pagination.jsx';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup';
import styles from '@/styles/pages/ChallengeList.module.scss';

// 한국어 마감일 텍스트
function toKoDateText(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('ko-KR', { year: 'numeric', day: 'numeric', month: 'long' }) + ' 마감'
    );
  } catch {
    return '';
  }
}

export default function ChallengeListPage() {
  // ── 컨트롤 상태 (라벨 그대로 사용)
  const [title, setTitle] = useState(''); // 검색어
  const [field, setField] = useState(''); // 예: 'Next.js' | 'Modern JS' | ...
  const [type, setType] = useState(''); // 예: '공식문서' | '블로그'
  const [status, setStatus] = useState(''); // 예: '진행중' | '마감'
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ── 서버 파라미터 (라벨 그대로 전달)
  const params = useMemo(
    () => ({ title, field, type, status, page, pageSize }),
    [title, field, type, status, page, pageSize],
  );

  // ── 쿼리 훅 (queryFn 내부에서 params 사용하도록 구성)
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    status: qStatus,
    refetch,
  } = useChallenges(params);

  // ── 디바운스된 refetch: 검색/필터/페이지 변경 시 300ms 후 재요청
  const debouncedRefetch = useCallback(
    debounce(() => refetch(), 300),
    [refetch],
  );
  useEffect(() => {
    debouncedRefetch();
    return () => debouncedRefetch.cancel();
  }, [params, debouncedRefetch]);

  // ── 응답 매핑
  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1 };

  const cards = useMemo(
    () =>
      items.map((ch) => ({
        key: ch.challengeId ?? ch.no ?? ch.id,
        title: ch.title ?? '제목 없음',
        tags: [ch.field, ch.type].filter(Boolean), // 서버가 라벨로 내려주는 경우 그대로 표시
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
              // ✅ 라벨을 그대로 올려주면 그대로 저장 → 그대로 API로 보냄
              onApply={(f) => {
                setField(f?.field || ''); // ex) 'Next.js'
                setType(f?.type || ''); // ex) '공식문서'
                setStatus(f?.status || ''); // ex) '진행중'
                setPage(1);
              }}
              onReset={() => {
                setField('');
                setType('');
                setStatus('');
                setPage(1);
              }}
              onClose={() => {}}
              // (선택) 현재 선택값 라벨을 내려주고 싶으면 value={{ field, type, status }}
            />
          }
        />
      </header>

      {/* 상태 출력 */}
      {(isLoading || isFetching) && <section className={styles.list}>불러오는 중…</section>}
      {isError && (
        <section className={styles.list}>
          에러: {error?.response?.data?.message || error?.message || '요청 실패'}
        </section>
      )}

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
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
              {`status: ${qStatus}, fetching: ${String(isFetching)}`}
            </div>
          </nav>
        </>
      )}
    </main>
  );
}
