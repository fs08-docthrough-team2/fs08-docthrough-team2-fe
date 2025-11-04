import api from '@/libs/api.js';

export const getIndividualParticipateChallengeList = async () => {
  const res = await api.get('/challenge/inquiry/individual-participate-list');
  return res.data;
};
