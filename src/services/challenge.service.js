import api from '@/libs/api.js';

export const getIndividualParticipateChallengeList = async ({ searchValue = '', signal }) => {
  const params = searchValue.trim() ? { title: searchValue.trim() } : undefined;
  const res = await api.get('/challenge/inquiry/individual-participate-list', { params, signal });
  return res.data;
};

export const getIndividualCompleteChallengeList = async ({ searchValue = '', signal }) => {
  const params = searchValue.trim() ? { title: searchValue.trim() } : undefined;
  const res = await api.get('/challenge/inquiry/individual-complete-list', { params, signal });
  return res.data;
};

// POST /challenge/create
export const createChallenge = async (payload) => {
  const { data } = await api.post('/challenge/create', payload);
  return data;
};

// GET /challenge/inquiry/challenge-detail/:challengeId
export const getChallengeDetail = async (challengeId) => {
  const res = await api.get(`/challenge/inquiry/challenge-detail/${challengeId}`);
  return res.data;
};

// GET /challenge/inquiry/challenge-list (User)
export const getChallengeList = async ({ page, pageSize, searchKeyword, status, sort }) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (searchKeyword) params.set('searchKeyword', searchKeyword);
  if (status) params.set('status', status);
  if (sort) params.set('sort', sort);

  const { data } = await api.get(`/challenge/inquiry/challenge-list?${params.toString()}`);
  return data;
};

// GET /challenge/inquiry/challenge-list (Admin)
export const getAdminChallengeList = async ({ page, pageSize, searchKeyword, status, sort }) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (searchKeyword) params.set('searchKeyword', searchKeyword);
  if (status) params.set('status', status);
  if (sort) params.set('sort', sort);

  const { data } = await api.get(`/challenge/admin/inquiry/challenge-list?${params.toString()}`);
  return data;
};

// PATCH /challenge/update/:challengeId
export const updateChallenge = async ({ challengeId, payload }) => {
  const { data } = await api.patch(`/challenge/update/${challengeId}`, payload);
  return data;
};

// 호환용 래퍼: 훅(useChallenges)이 기대하는 형태로 변환해서 반환
export const fetchChallenges = async (params = {}) => {
  const res = await getChallengeList(params);
  return {
    items: res?.data ?? [],
    pagination: res?.pagination ?? {
      page: 1,
      pageSize: params.pageSize ?? 10,
      totalCount: 0,
      totalPages: 1,
    },
  };
};

// GET /challenge/inquiry/participate-list/:challengeId
export const getChallengeParticipants = async ({ challengeId, page = 1, pageSize = 5, signal }) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const res = await api.get(
    `/challenge/inquiry/participate-list/${challengeId}?${params.toString()}`,
    { signal },
  );
  return res.data;
};

// GET /challenge/inquiry/individual-challenge-detail (pagination + search/sort)
export const getMyAppliedChallenges = async ({
  page,
  pageSize,
  searchKeyword,
  status,
  sort,
  signal,
}) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (searchKeyword) params.set('title', searchKeyword);
  if (status) params.set('status', status);
  if (sort) params.set('sort', sort);

  const { data } = await api.get(
    `/challenge/inquiry/individual-challenge-detail?${params.toString()}`,
    { signal },
  );
  return data;
};

// PATCH /challenge/delete/:challengeId (챌린지 논리적 삭제)
export const deleteChallenge = async (challengeId) => {
  const { data } = await api.patch(`/challenge/delete/${challengeId}`);
  return data;
};

// PATCH /challenge/admin/new-challenge/approve/:challengeId
export const approveAdminChallenge = async (challengeId) => {
  const { data } = await api.patch(`/challenge/admin/new-challenge/approve/${challengeId}`);
  return data;
};

// PATCH /challenge/admin/new-challenge/reject/:challengeId
export const rejectAdminChallenge = async ({ challengeId, reason }) => {
  const payload = { reject_comment: reason };
  const { data } = await api.patch(`/challenge/admin/new-challenge/reject/${challengeId}`, payload);
  return data;
};
