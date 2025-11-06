import api from '@/libs/api.js';

// --------------------------------------
// 개인 참여 목록
export const getIndividualParticipateChallengeList = async ({ searchValue = '', signal }) => {
  const params = searchValue.trim() ? { title: searchValue.trim() } : undefined;
  const res = await api.get('/challenge/inquiry/individual-participate-list', { params, signal });
  return res.data;
};

// 개인 완료 목록
export const getIndividualCompleteChallengeList = async ({ searchValue = '', signal }) => {
  const params = searchValue.trim() ? { title: searchValue.trim() } : undefined;
  const res = await api.get('/challenge/inquiry/individual-complete-list', { params, signal });
  return res.data;
};

// --------------------------------------
// 챌린지 생성
export const createChallenge = async (payload) => {
  const { data } = await api.post('/challenge/create', payload);
  return data;
};

// 챌린지 상세 조회
export const getChallengeDetail = async (challengeId) => {
  const res = await api.get(`/challenge/inquiry/challenge-detail/${challengeId}`);
  return res.data;
};

export const getChallengeList = async ({ page, pageSize }) => {
  const { data } = await api.get('/challenge/inquiry/challenge-list', {
    params: { page, pageSize },
  });
  return data;
};

// ✅ useChallenges 훅이 기대하는 형태로 변환
export const fetchChallenges = async (params = {}) => {
  const res = await getChallengeList(params);
  return {
    items: res?.data ?? [],
    pagination: res?.pagination ?? {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      totalCount: 0,
      totalPages: 1,
    },
  };
};

// --------------------------------------
// 관리자용 챌린지 목록
export const getAdminChallengeList = async ({ page, pageSize, searchKeyword, status, sort }) => {
  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (searchKeyword) qs.set('searchKeyword', searchKeyword);
  if (status) qs.set('status', status);
  if (sort) qs.set('sort', sort);

  const { data } = await api.get(`/challenge/admin/inquiry/challenge-list?${qs.toString()}`);
  return data;
};

// 관리자 챌린지 업데이트
export const updateChallenge = async ({ challengeId, payload }) => {
  const { data } = await api.patch(`/challenge/update/${challengeId}`, payload);
  return data;
};
