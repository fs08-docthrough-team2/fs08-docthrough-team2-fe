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

// ------------------------------------------------------
// ✅ UI 라벨 → 서버 ENUM 매핑 (UI에서는 ENUM 안 쓰지만 여기서만 변환)
const FIELD_MAP = {
  'Next.js': 'NEXT',
  'Modern JS': 'MODERN',
  API: 'API',
  Web: 'WEB',
  Career: 'CAREER',
};
const TYPE_MAP = { 공식문서: 'OFFICIAL', 블로그: 'BLOG' };
const STATUS_MAP = { 진행중: 'INPROGRESS', 마감: 'DEADLINE' };

function mapValue(value, map) {
  if (!value) return undefined;
  return map[value] ?? value; // 한글이면 변환, 이미 ENUM이면 그대로, 빈 문자열이면 undefined
}

// GET /challenge/inquiry/challenge-list (User)
export const getChallengeList = async ({
  title = '',
  field = '',
  type = '',
  status = '',
  page = 1,
  pageSize = 10,
} = {}) => {
  const params = {
    page: Math.max(1, Number(page) || 1),
    pageSize: Math.max(1, Number(pageSize) || 10),
  };

  if (title?.trim()) params.title = title.trim();

  const f = mapValue(field, FIELD_MAP);
  const t = mapValue(type, TYPE_MAP);
  const s = mapValue(status, STATUS_MAP);

  if (f) params.field = f;
  if (t) params.type = t;
  if (s) params.status = s;

  const { data } = await api.get('/challenge/inquiry/challenge-list', { params });
  return data; // { success, data:[], pagination:{} }
};
// ------------------------------------------------------

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

// 호환용 래퍼: 훅(useChallenges)에서 기대하는 형태로 변환
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

// PATCH /challenge/admin/new-challenge/approve/:challengeId
export const approveAdminChallenge = async (challengeId) => {
  const { data } = await api.patch(`/challenge/admin/new-challenge/approve/${challengeId}`);
  return data;
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

// GET /challenge/inquiry/individual-participate-list (pagination + search/sort)
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
    `/challenge/inquiry/individual-participate-list?${params.toString()}`,
    { signal },
  );
  return data;
};
