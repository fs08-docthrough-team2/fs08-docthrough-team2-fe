'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { filterSortOptions } from '@/constants/sortOptions.js';
import { useAdminChallengeListQuery } from '@/hooks/queries/useChallengeQueries.js';
import SearchInput from '@/components/atoms/Input/SearchInput';
import DropdownSort from '@/components/molecules/Dropdown/DropdownSort';
import ChallengeList from '@/components/atoms/List/ChallengeList';
import Pagination from '@/components/molecules/Pagination/Pagination';
import LoadingSpinner from '@/components/organisms/Loading/LoadingSpinner';
import styles from '@/styles/pages/admin/AdminPage.module.scss';
import challengeListStyles from '@/styles/components/atoms/List/ChallengeList.module.scss';

const ITEMS_PER_PAGE = 10;

export default function AdminPage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterSortValue, setFilterSortValue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { statusParam, sortParam } = useMemo(() => {
    if (!filterSortValue) return { statusParam: undefined, sortParam: undefined };
    const [kind, payload] = filterSortValue.split(':');
    if (kind === 'status') return { statusParam: payload, sortParam: undefined };
    if (kind === 'sort') return { statusParam: undefined, sortParam: payload };
    return { statusParam: undefined, sortParam: undefined };
  }, [filterSortValue]);

  const { data, isLoading, error } = useAdminChallengeListQuery({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    searchKeyword: searchKeyword || undefined,
    status: statusParam,
    sort: sortParam,
  });

  const challenges = data?.data ?? [];
  const pagination = data?.pagination;
  const currentServerPage = pagination?.page ?? currentPage;
  const totalPages = pagination?.totalPages ?? 1;

  const mappedItems = useMemo(
    () =>
      challenges.map((item, index) => ({
        no: item.challenge_no ?? (currentServerPage - 1) * ITEMS_PER_PAGE + index + 1,
        challengeId: item.challenge_id ?? item.challengeId ?? null,
        type: item.type,
        field: item.field,
        title: item.title,
        participants: item.participants,
        maxParticipants: item.maxParticipants,
        appliedDate: item.appliedDate,
        deadline: item.deadline,
        status: item.status,
      })),
    [challenges, currentServerPage],
  );

  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearchKeyword(value);
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
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            placeholder="챌린지 이름을 검색해 보세요"
          />
        </div>
        <DropdownSort
          className={styles.dropdownSort}
          options={filterSortOptions}
          value={filterSortValue}
          onChange={(nextValue) => {
            setFilterSortValue(nextValue);
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
            모집 인원
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
            <LoadingSpinner loading />
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
