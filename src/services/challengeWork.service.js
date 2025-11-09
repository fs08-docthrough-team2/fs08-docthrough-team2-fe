import api from '@/libs/api.js';

export const createChallengeWork = async ({ challengeId, workItem }) => {
  const res = await api.post('/challenge/work/translated-detail', { challengeId, workItem });
  return res.data;
};

export const getChallengeWorkDetail = async (attendId) => {
  const res = await api.get(`/challenge/work/translated-detail/${attendId}`);
  return res.data;
};

export const getChallengeWorkDraftList = async () => {
  const res = await api.get('/challenge/work/translated-list/save');
  return res.data;
};

export const getChallengeWorkDraftDetail = async (attendId) => {
  const res = await api.get(`/challenge/work/translated-detail/save/${attendId}`);
  return res.data;
};

export const createChallengeWorkDraft = async ({ challengeId, workItem }) => {
  const res = await api.post('/challenge/work/translated-detail/save', { challengeId, workItem });
  return res.data;
};

export const updateChallengeWork = async ({ attendId, workItem }) => {
  const res = await api.patch(`/challenge/work/translated-detail/${attendId}`, { workItem });
  return res.data;
};

export const LikeToggle = async ({ attendId }) => {
  const res = await api.post(`/challenge/work/translated-detail/like/${attendId}`);
  return res.data;
};

export const deleteChallengeWorkWithReason = async ({ attendId, deleteReason }) => {
  const res = await api.delete(`/challenge/work/translated-detail/${attendId}`, {
    data: { deleteReason },
  });
  return res.data;
};
