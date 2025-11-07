'use client';

import { useState } from 'react';
import { useChallenges } from '@/hooks/queries/useChallenge';
import { useDebounce } from '@/hooks/useDebounce';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';
import Pagination from '@/components/molecules/Pagination/Pagination.jsx';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup';
import styles from '@/styles/pages/ChallengeList.module.scss';

export default function ChallengeListPage() {
  const [title, setTitle] = useState('');
  const [field, setField] = useState(''); // 문자열 | 객체 | 배열 OK
  const [type, setType] = useState(''); // 문자열 | 객체(단일 가정)
  const [status, setStatus] = useState(''); // 문자열 | 객체(단일 가정)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const dTitle = useDebounce(title, 300);

  const params = {
    title: dTitle,
    field,
    type,
    status,
    page,
    pageSize,
  };

  const { data, isLoading, isFetching, isError, error, status: qStatus } = useChallenges(params);

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? {
    page,
    totalPages: Math.max(1, Math.ceil((items.length || 0) / pageSize)),
  };

  //
  console.log('pagination => ', pagination);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <ChallengeListToolbar
          search={title}
          onSearchChange={(v) => {
            const next = typeof v === 'string' ? v : (v?.target?.value ?? '');
            setTitle(next);
            setPage(1);
          }}
          onCreateClick={() => (window.location.href = '/challenge/post')}
          filterSlot={
            <FilterPopup
              value={{ field, type, status }}
              onApply={(f) => {
                // FilterPopup에서 전달되는 fields 객체에서 선택된 필드만 추출
                const selectedFields = Object.keys(f?.fields || {}).filter(
                  (key) => f.fields[key] === true,
                );
                setField(selectedFields.length > 0 ? selectedFields : '');
                setType(f?.type ?? f?.docType ?? f?.documentType ?? '');
                setStatus(f?.status ?? f?.state ?? '');
                setPage(1);
              }}
              onReset={() => {
                setField('');
                setType('');
                setStatus('');
                setPage(1);
              }}
              onClose={() => {}}
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
            {items.length === 0 ? (
              <div className={styles.empty}>조건에 맞는 챌린지가 없어요.</div>
            ) : (
              items.map((item) => (
                <ChallengeCard
                  challengeName={item.title}
                  type={item.field}
                  category={item.type}
                  status={item.status}
                  dueDate={item.deadline}
                  total={item.maxParticipants}
                  capacity={item.currentParticipants}
                  onEdit={() => handleEdit(id)}
                  onDelete={() => handleDelete(id)}
                />
              ))
            )}
          </section>
          <nav className={styles.paginationWrapper}>
            <Pagination
              currentPage={Math.min(pagination.page, pagination.totalPages)}
              totalPages={pagination.totalPages}
              maxPages={5}
              onPageChange={(next) => setPage(next)}
            />
          </nav>
        </>
      )}
    </main>
  );
}
