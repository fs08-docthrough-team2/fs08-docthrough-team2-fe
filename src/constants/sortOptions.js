export const adminFilterSortOptions = [
  // 상태 필터
  { value: 'status:신청대기', label: '승인 대기' },
  { value: 'status:신청승인', label: '신청 승인' },
  { value: 'status:신청거절', label: '신청 거절' },
  // 정렬 조건
  { value: 'sort:신청시간빠름순', label: '신청 시간 빠른순' },
  { value: 'sort:신청시간느림순', label: '신청 시간 느린순' },
  { value: 'sort:마감기한빠름순', label: '마감 기한 빠른순' },
  { value: 'sort:마감기한느림순', label: '마감 기한 느린순' },
];
