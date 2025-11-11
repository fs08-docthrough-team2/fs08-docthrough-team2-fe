import api from '@/libs/api.js';

/* =========================
 * UI 라벨/내부키 → 서버 ENUM 매핑
 * ========================= */
const FIELD_MAP = {
  'Next.js': 'NEXT',
  nextjs: 'NEXT',
  'Modern JS': 'MODERN',
  modernjs: 'MODERN',
  API: 'API',
  api: 'API',
  Web: 'WEB',
  web: 'WEB',
  Career: 'CAREER',
  career: 'CAREER',
};
const TYPE_MAP = {
  공식문서: 'OFFICIAL',
  블로그: 'BLOG',
  official: 'OFFICIAL',
  blog: 'BLOG',
};
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
  APPROVED: 'APPROVED',
  approved: 'APPROVED',
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

/* 배열/객체 → 문자열(들) 뽑기 */
function extractMany(v) {
  if (v == null) return [];
  const one = (x) => {
    if (Array.isArray(x)) return x.flatMap(one);
    if (x && typeof x === 'object') {
      const s = x.value ?? x.label ?? x.name ?? x.key ?? x.id;
      return s != null ? [String(s).trim()] : [];
    }
    return [String(x).trim()];
  };
  return one(v).filter(Boolean);
}
function extractLabel(v) {
  const arr = extractMany(v);
  return arr[0] ?? '';
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

// GET /challenge/inquiry/challenge-status/:challengeId
export const getChallengeApprovalDetail = async (challengeId) => {
  const res = await api.get(`/challenge/inquiry/challenge-status/${challengeId}`);
  return res.data;
};

// PATCH /challenge/cancel/:challengeId
export const cancelChallenge = async ({ challengeId }) => {
  const res = await api.patch(`/challenge/cancel/${challengeId}`);
  return res.data;
};

// POST /challenge/create
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

/* =========================
 * 공개 챌린지 리스트(유저)
 *  - field: 다중/객체/배열 전부 허용
 *  - type/status: 단일(필요시 동일 패턴으로 다중 확장 가능)
 * ========================= */
export const getChallengeList = async ({
  title = '',
  field = '',
  type = '',
  status = '',
  page = 1,
  pageSize = 10,
} = {}) => {
  // 기본 페이지 파라미터
  const params = {
    page: Math.max(1, Number(page) || 1),
    pageSize: Math.max(1, Number(pageSize) || 10),
  };

  // 검색어
  const tTitle = String(title ?? '').trim();
  if (tTitle) params.title = tTitle;

  // field: 다중 허용 - 반복 키로 전달 (&field=MODERN&field=API)
  const fieldEnums = extractMany(field)
    .map((lbl) => mapValue(lbl, FIELD_MAP))
    .filter(Boolean);

  // type/status (단일 기준)
  const ty = mapValue(extractLabel(type), TYPE_MAP);
  const st = mapValue(extractLabel(status), STATUS_MAP);
  if (ty) params.type = ty;
  if (st) params.status = st;

  // field가 여러 개일 경우 URLSearchParams로 반복 키 생성
  if (fieldEnums.length > 1) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value));
    });
    fieldEnums.forEach((fieldEnum) => {
      searchParams.append('field', fieldEnum);
    });
    const { data } = await api.get(`/challenge/inquiry/challenge-list?${searchParams.toString()}`);
    return data;
  }

  // field가 1개이거나 없을 경우 기존 방식
  if (fieldEnums.length === 1) {
    params.field = fieldEnums[0];
  }

  const { data } = await api.get('/challenge/inquiry/challenge-list', { params });
  return data; // { success, data:[], pagination:{} }
};

// React Query 훅 호환용(아이템/페이지네이션만 추려서 반환)
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

// PATCH /challenge/delete/:challengeId (챌린지 논리적 삭제)
export const deleteChallenge = async ({ challengeId, reason }) => {
  const payload = { delete_reason: reason ?? '' };
  const { data } = await api.patch(`/challenge/delete/${challengeId}`, payload);
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

// GET /challenge/admin/inquiry/challenge/:challengeId
export const getAdminChallengeDetail = async (challengeId) => {
  const { data } = await api.get(`/challenge/admin/inquiry/challenge/${challengeId}`);
  return data;
};
