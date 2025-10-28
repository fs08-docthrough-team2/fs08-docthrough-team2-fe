'use client';

import { useEffect, useState } from 'react';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar'; // ✅ 여기 이름/경로 수정

export default function TestPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('inProgress');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalCount = 25;

  useEffect(() => {
    const base = Array.from({ length: totalCount }, (_, i) => ({
      id: i + 1,
      title: `챌린지 ${i + 1}`,
      tags: ['Next.js', 'React'],
      likes: 10 + i,
      views: 100 + i,
      createdAt: '2025-10-28',
    }));
    const start = (page - 1) * pageSize;
    setItems(base.slice(start, start + pageSize));
  }, [page, search, category]);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <ChallengeListToolbar
      
        variant="user"
        title="챌린지 목록"
        category={category}
        categoryOptions={[
          { label: '전체', value: 'all' },
          { label: '참여중', value: 'inProgress' },
          { label: '완료함', value: 'completed' },
        ]}
        onCategoryChange={(v) => setCategory(v)}
        search={search}
        onSearchChange={(v) => setSearch(v)}
        onCreateRequest={() => alert('신규 챌린지 신청 클릭!')} // ✅ 테스트용 함수
      />
    </main>
  );
}
