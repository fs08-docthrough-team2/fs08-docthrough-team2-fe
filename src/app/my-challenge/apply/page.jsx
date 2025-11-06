'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { filterSortOptions } from '@/constants/sortOptions.js';
import { useMyAppliedChallengeListQuery } from '@/hooks/queries/useChallengeQueries';
import Button from '@/components/atoms/Button/Button';
import SearchInput from '@/components/atoms/Input/SearchInput';
import ChallengeList from '@/components/atoms/List/ChallengeList';
import DropdownSort from '@/components/molecules/Dropdown/DropdownSort';
import Tabs from '@/components/molecules/Tabs/Tabs';
import Pagination from '@/components/molecules/Pagination/Pagination';
import LoadingSpinner from '@/components/organisms/Loading/LoadingSpinner';
import styles from '@/styles/pages/my-challenge/MyChallengeApplyPage.module.scss';
import challengeListStyles from '@/styles/components/atoms/List/ChallengeList.module.scss';

const ITEMS_PER_PAGE = 10;

export default function MyChallengeApplyPage() {
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

  const { data, isLoading, error } = useMyAppliedChallengeListQuery({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    searchKeyword: searchKeyword || undefined,
    status: statusParam,
    sort: sortParam ?? '신청시간빠름순',
  });

  const challenges = Array.isArray(data?.data?.participates) ? data.data.participates : [];
  const pagination = data?.pagination ?? {
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    totalPages: 1,
  };
  const serverPage = pagination?.page ?? currentPage;
  const totalPages = pagination?.totalPages ?? 1;

  const mappedItems = useMemo(
    () =>
      challenges.map((item, index) => ({
        no: (serverPage - 1) * ITEMS_PER_PAGE + index + 1,
        challengeId: item.challengeId,
        type: item.type,
        field: item.field,
        title: item.title,
        participants: item.currentParticipants,
        maxParticipants: item.maxParticipants,
        appliedDate: item.appliedDate ?? item.createdAt ?? null,
        deadline: item.deadline,
        status: item.status,
      })),
    [challenges, serverPage],
  );

  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearchKeyword(value);
  };

  const handleChangePage = (page) => setCurrentPage(page);

  const handleClickTitle = (challengeId) => {
    if (!challengeId) return;
    router.push(`/my-challenge/${challengeId}/status`);
  };

  const handleTabChange = (index) => {
    if (index === 2) return;
    if (index === 0) router.push('/my-challenge');
    if (index === 1) router.push('/my-challenge');
  };

  return (
    <div className={styles.myChallengeApplyPage}>
      <div className={styles.headerTitleWrapper}>
        <div className={styles.pageTitle}>신청한 챌린지</div>
        <Button
          variant="solid"
          size="pill"
          icon="newChallenge"
          onClick={() => router.push('/challenge/post')}
        >
          신규 챌린지 신청
        </Button>
      </div>
      <div className={styles.tabWrapper}>
        <Tabs activeIndex={2} onTabChange={handleTabChange} />
      </div>
      <div className={styles.filters}>
        <div className={styles.searchInput}>
          <SearchInput
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            onSearch={handleSearch}
            placeholder="챌린지 제목을 검색해 보세요"
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
              emptyMessage="현재 신청한 챌린지가 없습니다."
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
