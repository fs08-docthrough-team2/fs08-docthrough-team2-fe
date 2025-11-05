import api from '@/libs/api.js';

export const createChallengeWork = async ({ challengeId, workItem }) => {
  const res = await api.post('/challenge/work/translated-detail', { challengeId, workItem });
  return res.data;
};

export const getChallengeWorkDetail = async (attendId) => {
  const res = await api.get(`/challenge/work/translated-detail/${attendId}`);
  return res.data;
};
