'use client';

import { useMemo, useState } from 'react';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';
import Pagination from '@/components/molecules/Pagination/Pagination.jsx';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard.jsx';
import styles from '@/styles/pages/ChallengeList.module.scss';
import FilterPopup from '@/components/molecules/Popup/FilterPopup';

export default function ChallengeListPage() {
  const allItems = useMemo(
    () => [
      {
        id: 1,
        title: '개발자로써 자신의 브랜드를 구축하는 방법(dailydev)',
        tags: ['Career', '블로그'],
        dateText: '2024년 2월 28일 마감',
        progressText: '2/5 참여중',
        badge: '',
      },
      {
        id: 2,
        title: 'TanStack Query - Optimistic Updates',
        tags: ['Modern JS', '강의/세션'],
        dateText: '2024년 2월 28일 마감',
        progressText: '2/5 참여중',
        badge: '',
      },
      {
        id: 3,
        title: 'Web 개발자의 필수 요건',
        tags: ['Web', '강의/세션'],
        dateText: '2024년 2월 28일 마감',
        progressText: '2/5 참여중',
        badge: '',
      },
      {
        id: 4,
        title: 'Next.js - App Router: Routing Fundamentals',
        tags: ['Next.js', '강의/세션'],
        dateText: '2024년 3월 3일 마감',
        progressText: '5/5 참여 완료',
        badge: '🔥 진행이 활발한 상태예요',
      },
      {
        id: 5,
        title: 'Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)',
        tags: ['API', '정보글'],
        dateText: '2024년 2월 28일 마감',
        progressText: '5/5 참여 완료',
        badge: '🌙 평일저녁 마감지향',
      },
    ],
    [],
  );

  // ── 상태 (검색/필터/페이지)
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // ── 검색 필터링 (필요 시 카테고리/태그 필터도 여기에 추가)
  const filtered = useMemo(() => {
    if (!query) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (it) =>
        it.title.toLowerCase().includes(q) || it.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [allItems, query]);

  // ── 페이지네이션
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  // ── Toolbar 프롭스: 네가 만든 ChallengeListToolbar API에 맞춰 연결
  //   - 예: { onFilterClick, searchValue, onSearchChange, onCreateClick } 등
  //   - 만약 Toolbar가 자체 상태를 갖고 있으면 최소한 searchValue/onChange만 넘겨줘도 OK
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <ChallengeListToolbar
          search={query}
          onSearchChange={(v) => {
            setPage(1);
            setQuery(v?.target ? v.target.value : v);
          }}
          onCreateClick={() => {
            window.location.href = '/challenges/post';
          }}
          filterSlot={<FilterPopup onApply={(f) => {}} onReset={(f) => {}} onClose={() => {}} />}
        />
      </header>

      <section className={styles.list}>
        {current.map((item) => (
          <ChallengeCard
            key={item.id}
            title={item.title}
            tags={item.tags}
            dateText={item.dateText}
            progressText={item.progressText}
            badge={item.badge}
            // 필요하면 onClick, href 등 추가
          />
        ))}
      </section>

      <nav className={styles.pagination}>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(next) => setPage(next)}
          // 필요 시 size/variant 아이콘 등 네 컴포넌트 프롭스 맞게 전달
        />
      </nav>
    </main>
  );
}
