import api from '@/libs/api';

export const createFeedback = async ({ attendId, content }) => {
  const res = await api.post('/challenge/feedback/translated-detail/feedback-detail', {
    attendId,
    content,
  });
  return res.data;
};

export const getFeedbackListInfinite = async ({ attendId, pageParam, pageSize = 3 }) => {
  const res = await api.get(
    `/challenge/feedback/translated-detail/feedback-list?attend_id=${attendId}&page=${pageParam}&size=${pageSize}`,
  );
  return res.data;
};
