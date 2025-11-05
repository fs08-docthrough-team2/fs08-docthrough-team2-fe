'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { adminFilterSortOptions } from '@/constants/sortOptions.js';
import { useAdminChallengeListQuery } from '@/hooks/mutations/useChallengeMutations';
import SearchInput from '@/components/atoms/Input/SearchInput';
import DropdownSort from '@/components/molecules/Dropdown/DropdownSort';
import ChallengeList from '@/components/atoms/List/ChallengeList';
import Pagination from '@/components/molecules/Pagination/Pagination';
import LoadingSpinner from '@/components/organisms/Loading/LoadingSpinner';
import styles from '@/styles/pages/admin/AdminPage.module.scss';
import challengeListStyles from '@/styles/components/atoms/List/ChallengeList.module.scss';

const ITEMS_PER_PAGE = 10;

<<<<<<< HEAD
=======
const MOCK_CHALLENGE = [
  {
    no: 1,
    type: 'OFFICIAL',
    field: 'NEXTJS',
    title: 'Next.js App Router 심화',
    participants: '6 / 12',
    appliedDate: '2024-10-08T08:15:00.000Z',
    deadline: '2024-10-31T23:59:59.000Z',
    status: 'pending',
  },
  {
    no: 2,
    type: 'BLOG',
    field: 'CAREER',
    title: '시니어 개발자 커리어 로드맵',
    participants: '2 / 10',
    appliedDate: '2024-10-12T12:00:00.000Z',
    deadline: '2024-11-01T23:59:59.000Z',
    status: 'rejected',
  },
  {
    no: 3,
    type: 'OFFICIAL',
    field: 'API',
    title: 'RESTful API 핵심 이론',
    participants: '5 / 15',
    appliedDate: '2024-10-18T18:20:00.000Z',
    deadline: '2024-11-12T23:59:59.000Z',
    status: 'approved',
  },
  {
    no: 4,
    type: 'BLOG',
    field: 'WEB',
    title: '웹 접근성 체크리스트',
    participants: '12 / 18',
    appliedDate: '2024-10-20T09:00:00.000Z',
    deadline: '2024-11-05T23:59:59.000Z',
    status: 'deleted',
  },
  {
    no: 5,
    type: 'OFFICIAL',
    field: 'MODERN',
    title: 'Jest test framework',
    participants: '3 / 10',
    appliedDate: '2024-10-22T06:08:15.171Z',
    deadline: '2024-11-17T23:59:59.000Z',
    status: 'pending',
  },
  {
    no: 6,
    type: 'OFFICIAL',
    field: 'API',
    title: 'GraphQL Best Practice',
    participants: '7 / 12',
    appliedDate: '2024-09-30T09:40:00.000Z',
    deadline: '2024-11-20T23:59:59.000Z',
    status: 'approved',
  },
  {
    no: 7,
    type: 'BLOG',
    field: 'MODERN',
    title: 'ES2024 신기능 훑어보기',
    participants: '4 / 9',
    appliedDate: '2024-10-01T07:10:00.000Z',
    deadline: '2024-11-10T23:59:59.000Z',
    status: 'pending',
  },
  {
    no: 8,
    type: 'OFFICIAL',
    field: 'NEXTJS',
    title: 'Next.js 렌더링 전략 비교',
    participants: '9 / 16',
    appliedDate: '2024-10-03T15:30:00.000Z',
    deadline: '2024-11-07T23:59:59.000Z',
    status: 'approved',
  },
  {
    no: 9,
    type: 'BLOG',
    field: 'CAREER',
    title: '리더십을 위한 커뮤니케이션',
    participants: '1 / 8',
    appliedDate: '2024-10-05T12:00:00.000Z',
    deadline: '2024-11-03T23:59:59.000Z',
    status: 'rejected',
  },
  {
    no: 10,
    type: 'OFFICIAL',
    field: 'WEB',
    title: '웹 성능 최적화 가이드',
    participants: '8 / 14',
    appliedDate: '2024-10-06T09:00:00.000Z',
    deadline: '2024-11-15T23:59:59.000Z',
    status: 'approved',
  },
  {
    no: 11,
    type: 'BLOG',
    field: 'API',
    title: 'Postman 고급 활용법',
    participants: '6 / 12',
    appliedDate: '2024-10-08T19:20:00.000Z',
    deadline: '2024-11-22T23:59:59.000Z',
    status: 'pending',
  },
  {
    no: 12,
    type: 'OFFICIAL',
    field: 'MODERN',
    title: '타입스크립트 고급 패턴',
    participants: '11 / 18',
    appliedDate: '2024-10-10T10:45:00.000Z',
    deadline: '2024-11-18T23:59:59.000Z',
    status: 'deleted',
  },
];

const FIELD_TEXT = {
  OFFICIAL: '공식문서',
  BLOG: '블로그',
};

const CATEGORY_TEXT = {
  NEXTJS: 'Next.js',
  API: 'API',
  CAREER: 'Career',
  MODERN: 'Modern JS',
  WEB: 'Web',
};

>>>>>>> origin/develop
export default function AdminPage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterSortValue, setFilterSortValue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

<<<<<<< HEAD
  // 선택한 옵션 value = "status:신청대기" 또는 "sort:마감기한빠름순"
  const { statusParam, sortParam } = useMemo(() => {
    if (!filterSortValue) return { statusParam: undefined, sortParam: undefined };
    const [kind, payload] = filterSortValue.split(':');
    if (kind === 'status') return { statusParam: payload, sortParam: undefined };
    if (kind === 'sort') return { statusParam: undefined, sortParam: payload };
    return { statusParam: undefined, sortParam: undefined };
  }, [filterSortValue]);
=======
  const filteredItems = useMemo(() => {
    if (!search.trim()) return MOCK_CHALLENGE;
    const keyword = search.trim().toLowerCase();
    return MOCK_CHALLENGE.filter(({ title, type, field }) => {
      const typeLabel = FIELD_TEXT[type] ?? type;
      const fieldLabel = CATEGORY_TEXT[field] ?? field;
      return (
        title.toLowerCase().includes(keyword) ||
        typeLabel.toLowerCase().includes(keyword) ||
        fieldLabel.toLowerCase().includes(keyword)
      );
    });
  }, [search]);
>>>>>>> origin/develop

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
            placeholder="챌린지 제목을 검색해 보세요"
          />
        </div>
        <DropdownSort
          className={styles.dropdownSort}
          options={adminFilterSortOptions}
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
