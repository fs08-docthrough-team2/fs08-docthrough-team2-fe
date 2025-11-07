import api from '@/libs/api.js';

/* =========================
 * UI 라벨/내부키 → 서버 ENUM 매핑
 * ========================= */
const FIELD_MAP = {
  'Next.js': 'NEXT',
  'Modern JS': 'MODERN',
  API: 'API',
  Web: 'WEB',
  Career: 'CAREER',
};
const TYPE_MAP = { 공식문서: 'OFFICIAL', 블로그: 'BLOG' };
const STATUS_MAP = {
  진행중: 'INPROGRESS',
  '진행 중': 'INPROGRESS',
  inProgress: 'INPROGRESS',
  마감: 'DEADLINE',
  마감됨: 'DEADLINE',
  마감완료: 'DEADLINE',
  closed: 'DEADLINE',
  deadline: 'DEADLINE',
  완료: 'DEADLINE',
};

const CANONICALS = new Set([
  'NEXT',
  'MODERN',
  'API',
  'WEB',
  'CAREER',
  'OFFICIAL',
  'BLOG',
  'INPROGRESS',
  'DEADLINE',
  'CLOSED', // 들어오면 DEADLINE으로 보정
]);

function normalizeEnumLike(v) {
  if (!v || typeof v !== 'string') return undefined;
  const canon = v.replace(/\s|-/g, '').toUpperCase();
  if (canon === 'CLOSED') return 'DEADLINE';
  return CANONICALS.has(canon) ? canon : undefined;
}

function mapValue(value, map) {
  if (value == null) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  if (map[raw] != null) return map[raw];
  if (map[raw.toLowerCase()] != null) return map[raw.toLowerCase()];
  if (map[raw.toUpperCase()] != null) return map[raw.toUpperCase()];
  return normalizeEnumLike(raw);
}

/* =========================
 * 개별/완료 챌린지 목록(내 것)
 * ========================= */
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

/* =========================
 * 생성/상세/수정/승인/삭제
 * ========================= */
export const createChallenge = async (payload) => {
  const { data } = await api.post('/challenge/create', payload);
  return data;
};

export const getChallengeDetail = async (challengeId) => {
  const res = await api.get(`/challenge/inquiry/challenge-detail/${challengeId}`);
  return res.data;
};

export const updateChallenge = async ({ challengeId, payload }) => {
  const { data } = await api.patch(`/challenge/update/${challengeId}`, payload);
  return data;
};

export const deleteChallenge = async (challengeId) => {
  const { data } = await api.patch(`/challenge/delete/${challengeId}`);
  return data;
};

export const approveAdminChallenge = async (challengeId) => {
  const { data } = await api.patch(`/challenge/admin/new-challenge/approve/${challengeId}`);
  return data;
};

export const rejectAdminChallenge = async ({ challengeId, reason }) => {
  const payload = { reject_comment: reason };
  const { data } = await api.patch(`/challenge/admin/new-challenge/reject/${challengeId}`, payload);
  return data;
};

/* =========================
 * 공개 챌린지 리스트(유저)
 * ========================= */
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
  // 서버 형식: { success, data: [...], pagination: {...} }
  return data;
};

// React Query 훅 호환용(아이템/페이지네이션만 추려서 반환)
export const fetchChallenges = async (params = {}) => {
  // console.debug('[fetchChallenges] incoming params =', params);
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

/* =========================
 * 공개 챌린지 참가자 목록
 * ========================= */
export const getChallengeParticipants = async ({ challengeId, page = 1, pageSize = 5, signal }) => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  const res = await api.get(`/challenge/inquiry/participate-list/${challengeId}?${qs.toString()}`, {
    signal,
  });
  return res.data;
};

/* =========================
 * 어드민 챌린지 리스트
 * ========================= */
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

/* =========================
 * 어드민: 내가 신청한 챌린지 목록(페이지네이션/검색/정렬)
 * ========================= */
export const getMyAppliedChallenges = async ({
  page,
  pageSize,
  searchKeyword,
  status,
  sort,
  signal,
}) => {
  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (searchKeyword) qs.set('title', searchKeyword);
  if (status) qs.set('status', status);
  if (sort) qs.set('sort', sort);

  const { data } = await api.get(
    `/challenge/inquiry/individual-challenge-detail?${qs.toString()}`,
    { signal },
  );
  return data;
};
