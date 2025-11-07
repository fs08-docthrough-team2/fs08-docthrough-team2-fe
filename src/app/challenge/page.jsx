'use client';

import { useMemo, useState, useEffect } from 'react';
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
      d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) + ' 마감'
    );
  } catch {
    return '';
  }
}

export default function ChallengeListPage() {
  // ── 컨트롤 상태(라벨 그대로 보관)
  const [title, setTitle] = useState(''); // 검색어(실시간 입력)
  const [debouncedTitle, setDebouncedTitle] = useState(''); // 서버에 보낼 디바운스 값
  const [field, setField] = useState(''); // 'Next.js' | 'Modern JS' | ...
  const [type, setType] = useState(''); // '공식문서' | '블로그'
  const [status, setStatus] = useState(''); // '진행중' | '마감'
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ── 검색어 디바운스(300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTitle(title), 300);
    return () => clearTimeout(t);
  }, [title]);

  // ── 서버 파라미터 (라벨 그대로 전달; 훅 내부/서비스에서 ENUM 변환)
  const params = useMemo(
    () => ({ title: field, type, status, page, pageSize }),
    [field, type, status, page, pageSize],
  );

  // ── 쿼리 훅 (queryKey에 params 요소 포함해서 자동 refetch)
  const { data, isLoading, isError, error, isFetching, status: qStatus } = useChallenges(params);

  // ── 응답 매핑
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
              value={{ field, type, status }}
              onApply={(f) => {
                // 어떤 키로 오든 1개 값만 뽑아 문자열로
                const pickOne = (obj, keys) => {
                  for (const k of keys) {
                    const v = obj?.[k];
                    if (v != null)
                      return Array.isArray(v) ? String(v[0] ?? '').trim() : String(v).trim();
                  }
                  return '';
                };

                const nextField = pickOne(f, ['field']);
                const nextType = pickOne(f, ['type']);
                const nextStatus = pickOne(f, ['status', 'state']); // ← 핵심: 둘 다 지원

                console.debug('[popup] onApply ->', { nextField, nextType, nextStatus });

                setField(nextField);
                setType(nextType);
                setStatus(nextStatus); // ← 여기서 '마감'이 실제로 들어와야 함
                setPage(1);
              }}
              onReset={() => {
                setField('');
                setType('');
                setStatus('');
                setPage(1);
              }}
            />
          }
        />
      </header>

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
