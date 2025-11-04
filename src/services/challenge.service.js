import api from '@/libs/api.js';

export const getIndividualParticipateChallengeList = async () => {
  const res = await api.get('/challenge/inquiry/individual-participate-list');
  return res.data;
};

export const createChallenge = async (payload) => {
  const response = await api.post('/challenge/create', payload);
  return response.data;
};
