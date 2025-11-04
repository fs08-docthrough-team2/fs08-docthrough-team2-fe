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

// PATCH /challenge/update/:challengeId
export const updateChallenge = async ({ challengeId, payload }) => {
  const { data } = await api.patch(`/challenge/update/${challengeId}`, payload);
  return data;
};
