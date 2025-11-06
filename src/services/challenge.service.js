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

// --------------------------------------
// ✅ 유저용 챌린지 목록 조회 (공개) — 400 방지 버전
export const getChallengeList = async ({
  title = '',
  field = '',
  type = '',
  status = '',
  sort, // 사용자가 실제로 선택한 경우에만 보냄
  page = 1,
  pageSize = 10,
} = {}) => {
  // 필수(page/pageSize)는 숫자 보장, 나머지는 값 있을 때만 전송
  const params = {
    page: Math.max(1, Number(page) || 1),
    pageSize: Math.max(1, Number(pageSize) || 10),
  };
  if (typeof title === 'string' && title.trim()) params.title = title.trim();
  if (field) params.field = field;
  if (type) params.type = type;
  if (status) params.status = status;
  if (sort) params.sort = sort;

  const { data } = await api.get('/challenge/inquiry/challenge-list', {
    params,
    withCredentials: false, // 공개면 쿠키 X
    skipAuth: true, // 공개 호출 → Authorization 스킵
  });

  return data; // { success, data:[], pagination:{} }
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
