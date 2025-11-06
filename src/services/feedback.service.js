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
    `/challenge/feedback/translated-detail/feedback-list?attendId=${attendId}&page=${pageParam}&size=${pageSize}`,
  );
  return res.data;
};

export const updateFeedback = async ({ feedbackId, content }) => {
  const res = await api.patch(`/challenge/feedback/translated-detail/feedback-detail`, {
    feedbackId,
    content,
  });
  return res.data;
};

export const deleteFeedback = async ({ feedbackId }) => {
  const res = await api.delete(`/challenge/feedback/translated-detail/feedback-detail`, {
    feedbackId,
  });
  return res.data;
};
