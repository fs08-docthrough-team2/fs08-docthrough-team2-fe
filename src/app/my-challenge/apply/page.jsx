'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useChallengeListQuery } from '@/hooks/mutations/useChallengeMutations';
import Button from '@/components/atoms/Button/Button';
import SearchInput from '@/components/atoms/Input/SearchInput';
import ChallengeList from '@/components/atoms/List/ChallengeList';
import DropdownSort from '@/components/molecules/Dropdown/DropdownSort';
import Tabs from '@/components/molecules/Tabs/Tabs';
import Pagination from '@/components/molecules/Pagination/Pagination';
import styles from '@/styles/pages/my-challenge/MyChallengeApplyPage.module.scss';
import challengeListStyles from '@/styles/components/atoms/List/ChallengeList.module.scss';

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

export default function MyChallengeApplyPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  const mappedItems = useMemo(() => {
    if (!filteredItems.length) return [];

    const baseIndex = (pagination.page - 1) * ITEMS_PER_PAGE;

    return filteredItems.map((item, index) => ({
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
  }, [filteredItems, pagination.page]);

  const totalPages = pagination.totalPages ?? 1;

  const handleSearch = (value) => {
    setCurrentPage(1);
    setSearch(value);
  };

  const handleChangePage = (page) => setCurrentPage(page);

  const handleClickTitle = (challengeId) => {
    if (!challengeId) return;
    router.push(`/my-challenge/${challengeId}/status`);
  };

  return (
    <div className={styles.myChallengeApplyPage}>
      <div className={styles.headerTitleWrapper}>
        <div className={styles.pageTitle}>나의 챌린지</div>
        <Button variant="solid" size="pill" children="신규 챌린지 신청" icon="newChallenge" />
      </div>
      <Tabs />
      <div className={styles.filters}>
        <div className={styles.searchInput}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            placeholder="챌린지 제목을 검색해보세요"
          />
        </div>
        <DropdownSort className={styles.dropdownSort} />
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
            <p className={styles.loading}>목록을 불러오는 중입니다…</p>
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
