'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminChallengeListQuery } from '@/hooks/queries/useAdminChallenge';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';
import Pagination from '@/components/molecules/Pagination/Pagination.jsx';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup';
import styles from '@/styles/pages/ChallengeList.module.scss';
import TextModal from '@/components/molecules/Modal/TextModal.jsx';

const PAGE_SIZE = 10;

export default function AdminChallengeListPage() {
  const router = useRouter();

  // 검색/필터/페이지
  const [title, setTitle] = useState('');
  const [field, setField] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const dTitle = useDebounce(title, 300);

  const params = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      searchKeyword: dTitle || undefined,
      status: status || undefined,
      // field, type은 어드민 API에 없으므로 훅에서 무시됨(유지해도 무방)
      field,
      type,
    }),
    [page, dTitle, status, field, type],
  );

  const { data, isLoading, isFetching, isError, error } = useAdminChallengeListQuery(params);

  // 응답 정규화
  const items = useMemo(() => {
    const raw = data?.data ?? data?.items ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const pagination = useMemo(() => {
    const p = data?.pagination;
    if (p) {
      return {
        page: Math.max(1, Number(p.page ?? page)),
        totalPages: Math.max(1, Number(p.totalPages ?? 1)),
      };
    }
    return { page, totalPages: Math.max(1, Math.ceil((items.length || 0) / PAGE_SIZE)) };
  }, [data?.pagination, items.length, page]);

  // 삭제 모달
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, title: '' });
  const [deleteReason, setDeleteReason] = useState('');

  const openDeleteModal = (id, title) => {
    setDeleteTarget({ id, title });
    setDeleteReason('');
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteReason('');
    setDeleteTarget({ id: null, title: '' });
  };

  // 액션
  const handleEdit = (challengeId) => {
    if (!challengeId) return;
    router.push(`/admin/${challengeId}/edit`);
  };
  const handleDelete = (challengeId) => {
    if (!challengeId) return;
    if (window.confirm('정말 삭제하시겠어요?')) {
      // TODO: 실제 삭제 mutation 연결
      router.push(`/admin/${challengeId}/delete`);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        {/* 어드민: 신규 신청 버튼 없음 */}
        <ChallengeListToolbar
          search={title}
          onSearchChange={(v) => {
            const next = typeof v === 'string' ? v : (v?.target?.value ?? '');
            setTitle(next);
            setPage(1);
          }}
          filterSlot={
            <FilterPopup
              value={{ field, type, status }}
              onApply={(f) => {
                const selectedFields = Object.keys(f?.fields || {}).filter((k) => f.fields[k]);
                setField(selectedFields.length ? selectedFields : '');
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
              items.map((item) => {
                const id = item.challenge_id ?? item.challengeId ?? item.id ?? null;
                return (
                  <div
                    key={id ?? `${item.title}-${item.deadline}`}
                    className={styles.adminCardOverride}
                  >
                    <ChallengeCard
                      isAdmin
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
                  </div>
                );
              })
            )}
          </section>

          <nav className={styles.paginationWrapper}>
            <Pagination
              currentPage={Math.min(pagination.page, pagination.totalPages)}
              totalPages={pagination.totalPages}
              maxPages={5}
              onPageChange={setPage}
            />
          </nav>

          {/* 삭제 모달 */}
          {isDeleteOpen && (
            <TextModal
              title="삭제 사유"
              label="내용"
              placeholder="삭제 사유를 입력해주세요"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e?.target ? e.target.value : String(e))}
              isOpen={isDeleteOpen}
              onClose={closeDeleteModal}
              onCancel={closeDeleteModal}
              onConfirm={submitDelete}
              confirmText="전송"
              cancelText="취소"
              // 필요시 추가 prop(TextModal 인터페이스에 따라)
              // maxLength={500}
              // required
              // description={`[${deleteTarget.title}]을(를) 삭제합니다.`}
            />
          )}
        </>
      )}
    </main>
  );
}
