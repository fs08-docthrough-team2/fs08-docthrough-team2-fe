import api from '@/libs/api';

export const createFeedback = async ({ attendId, content }) => {
  const res = await api.post('/challenge/feedback/translated-detail/feedback-detail', {
    attend_id: attendId,
    content,
  });
  return res.data;
};

export const getFeedbackList = async (attendId) => {
  const res = await api.get(
    `/challenge/feedback/translated-detail/feedback-list?attend_id=${attendId}`,
  );
  return res.data;
};
