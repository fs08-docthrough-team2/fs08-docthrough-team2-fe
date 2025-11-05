import api from '@/libs/api.js';

export const createChallengeWork = async ({ challengeId, workItem }) => {
  const res = await api.post('/challenge/work/translated-detail', { challengeId, workItem });
  return res.data;
};
