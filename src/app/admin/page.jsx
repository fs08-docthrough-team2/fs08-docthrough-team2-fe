'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { challengeSortOptions } from '@/constants/sortOptions.js';
import { sortChallenges } from '@/utils/sortChallenges';
import { useChallengeListQuery } from '@/hooks/mutations/useChallengeMutations';
import SearchInput from '@/components/atoms/Input/SearchInput';
import DropdownSort from '@/components/molecules/Dropdown/DropdownSort';
import ChallengeList from '@/components/atoms/List/ChallengeList';
import Pagination from '@/components/molecules/Pagination/Pagination';
import styles from '@/styles/pages/admin/AdminPage.module.scss';
import challengeListStyles from '@/styles/components/atoms/List/ChallengeList.module.scss';
import LoadingSpinner from '@/components/organisms/Loading/LoadingSpinner';

const ITEMS_PER_PAGE = 10;

const FIELD_TEXT = {
  OFFICIAL: '공식문서',
  BLOG: '블로그',
};

const CATEGORY_TEXT = {
  NEXT: 'Next.js',
  API: 'API',
  CAREER: 'Career',
  MODERN: 'Modern JS',
  WEB: 'Web',
};

export default function AdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);

  const { data, isLoading, error } = useChallengeListQuery({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  const challenges = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1, totalCount: 0 };

  const filteredItems = useMemo(() => {
    if (!search.trim()) return challenges;
    const keyword = search.trim().toLowerCase();
    return challenges.filter(({ title, field, type }) => {
      const fieldLabel = CATEGORY_TEXT[field] ?? field;
      const typeLabel = FIELD_TEXT[type] ?? type;
      return (
        title.toLowerCase().includes(keyword) ||
        fieldLabel.toLowerCase().includes(keyword) ||
        typeLabel.toLowerCase().includes(keyword)
      );
    });
  }, [challenges, search]);

  const sortedItems = useMemo(
    () => sortChallenges(filteredItems, sortKey),
    [filteredItems, sortKey],
  );

  const mappedItems = useMemo(() => {
    if (!sortedItems.length) return [];

    const baseIndex = (pagination.page - 1) * ITEMS_PER_PAGE;

    return sortedItems.map((item, index) => ({
      no: baseIndex + index + 1,
      challengeId: item.challengeId,
      type: item.type,
      field: item.field,
      title: item.title,
      participants: `${item.currentParticipants} / ${item.maxParticipants}`,
      appliedDate: item.appliedDate ?? item.createdAt ?? null,
      deadline: item.deadline,
      status: item.status,
    }));
  }, [sortedItems, pagination.page]);

  const totalPages = pagination.totalPages ?? 1;

  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearch(value);
  };

  const handleChangePage = (page) => setCurrentPage(page);

  const handleClickTitle = (challengeId) => {
    if (!challengeId) return;
    router.push(`/admin/${challengeId}/status`);
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>챌린지 신청 관리</h1>
      <div className={styles.filters}>
        <div className={styles.searchInput}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            placeholder="챌린지 제목을 검색해보세요"
          />
        </div>
        <DropdownSort
          className={styles.dropdownSort}
          options={challengeSortOptions}
          value={sortKey}
          onChange={(nextKey) => {
            setSortKey(nextKey);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className={styles.tableScrollArea}>
        <div className={clsx(styles.listHeader, styles.tableInner, challengeListStyles.row)}>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellNo,
            )}
          >
            No.
          </span>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellField,
            )}
          >
            분야
          </span>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellCategory,
            )}
          >
            카테고리
          </span>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellTitle,
            )}
          >
            챌린지 제목
          </span>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellCapacity,
            )}
          >
            모집 정원
          </span>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellApplied,
            )}
          >
            신청일
          </span>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellDeadline,
            )}
          >
            마감 기한
          </span>
          <span
            className={clsx(
              styles.headerCell,
              challengeListStyles.cell,
              challengeListStyles.cellStatus,
            )}
          >
            상태
          </span>
        </div>
        <div className={styles.tableInner}>
          {isLoading ? (
            <LoadingSpinner loading={true} />
          ) : error ? (
            <p className={styles.loading}>챌린지 목록을 불러오지 못했습니다.</p>
          ) : (
            <ChallengeList
              items={mappedItems}
              onClickTitle={handleClickTitle}
              emptyMessage="현재 등록된 챌린지가 없습니다."
            />
          )}
        </div>
      </div>

      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={Math.min(currentPage, totalPages)}
          totalPages={totalPages}
          maxPages={5}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
}
