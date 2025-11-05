// mutation을 위한 api
import api from '@/libs/api.js';

// POST /challenge/create
export const createChallenge = async (payload) => {
  const { data } = await api.post('/challenge/create', payload);
  return data;
};

// GET /challenge/inquiry/challenge-detail/:challengeId
export const getChallengeDetail = async (challengeId) => {
  const { data } = await api.get(`/challenge/inquiry/challenge-detail/${challengeId}`);
  return data?.data ?? null;
};

// GET /challenge/inquiry/challenge-list (User)
export const getChallengeList = async ({ page, pageSize }) => {
  const { data } = await api.get('/challenge/inquiry/challenge-list', {
    params: { page, pageSize },
  });
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
