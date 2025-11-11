'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminChallengeListQuery } from '@/hooks/queries/useAdminChallenge';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';
import Pagination from '@/components/molecules/Pagination/Pagination.jsx';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard.jsx';
import FilterPopup from '@/components/molecules/Popup/FilterPopup';
import styles from '@/styles/pages/ChallengeList.module.scss';
import TextModal from '@/components/molecules/Modal/TextModal.jsx';
import { showToast } from '@/components/common/Sonner';
import { deleteAdminChallenge } from '@/services/admin.challenge.service.js';
import Spinner from '@/components/common/Spinner';

const PAGE_SIZE = 10;
const EMPTY_SECTION_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
};
const EMPTY_TEXT_STYLE = {
  textAlign: 'center',
  color: '#9fa4a9',
  fontSize: '16px',
  fontWeight: 500,
};

export default function AdminChallengeListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 검색/필터/페이지
  const [title, setTitle] = useState('');
  const [field, setField] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const dTitle = useDebounce(title, 300);

  const params = {
    title: dTitle,
    field,
    type,
    status,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading, isFetching, isError, error } = useAdminChallengeListQuery(params);

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? {
    page,
    totalPages: Math.max(1, Math.ceil((items.length || 0) / PAGE_SIZE)),
  };

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

  const deleteMutation = useMutation({
    mutationFn: ({ id, reason }) => deleteAdminChallenge({ id, reason }),
    onSuccess: () => {
      showToast({ kind: 'success', title: '챌린지를 삭제했어요.' });
      queryClient.invalidateQueries({ queryKey: ['admin-challenge-list'] });
      closeDeleteModal();
    },
    onError: (err) => {
      showToast({
        kind: 'error',
        title: '삭제에 실패했어요.',
        description: err?.response?.data?.message || err?.message || '잠시 후 다시 시도해주세요.',
      });
    },
  });

  // ✅ 삭제 모달 제출
  const submitDelete = (inputReason) => {
    if (!deleteTarget.id || deleteMutation.isPending) return;
    const trimmedReason =
      typeof inputReason === 'string' ? inputReason.trim() : deleteReason.trim();
    if (!trimmedReason) return;
    deleteMutation.mutate({ id: deleteTarget.id, reason: trimmedReason });
  };

  // 액션
  const handleEdit = (challengeId) => {
    if (!challengeId) return;
    router.push(`/admin/${challengeId}/edit`);
  };
  const handleDelete = (challengeId, title) => {
    if (!challengeId) return;
    openDeleteModal(challengeId, title);
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

      {<Spinner isLoading={isLoading || isFetching} />}
      {isError && (
        <section className={styles.list}>
          에러: {error?.response?.data?.message || error?.message || '요청 실패'}
        </section>
      )}

      {!isLoading && !isError && (
        <>
          <section
            className={styles.list}
            style={items.length === 0 ? EMPTY_SECTION_STYLE : undefined}
          >
            {items.length === 0 ? (
              <div className={styles.empty} style={EMPTY_TEXT_STYLE}>
                조건에 맞는 챌린지가 없어요.
              </div>
            ) : (
              items.map((item) => {
                const id = item.challenge_id ?? item.challengeId ?? item.id ?? null;
                return (
                  <div
                    key={id ?? `${item.title}-${item.deadline}`}
                    className={styles.adminCardOverride}
                    onClickCapture={(e) => {
                      const btn = e.target.closest('button, a');
                      if (!btn) return;
                      const label = (btn.textContent || '').trim();
                      if (!label) return;

                      // ✅ DropdownOption 내부를 못 고치므로, 여기서 가로채기
                      if (label.includes('삭제하기')) {
                        e.preventDefault();
                        e.stopPropagation();
                        openDeleteModal(id, item.title); // ← TextModal 열기
                      } else if (label.includes('수정하기')) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(id); // ← /admin/{id}/edit 이동
                      }
                    }}
                  >
                    <ChallengeCard
                      isAdmin={true}
                      challengeId={id}
                      challengeName={item.title}
                      type={item.field}
                      category={item.type}
                      status={item.status}
                      dueDate={item.deadline}
                      total={item.maxParticipants}
                      capacity={item.currentParticipants}
                      onEdit={() => handleEdit(id)}
                      onDelete={() => handleDelete(id, item.title)}
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
              placeholder="삭제 사유를 입력해주세요"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e?.target ? e.target.value : String(e))}
              isOpen={isDeleteOpen}
              onClose={closeDeleteModal}
              onSubmit={submitDelete}
              isSubmitting={deleteMutation.isPending}
            />
          )}
        </>
      )}
    </main>
  );
}
