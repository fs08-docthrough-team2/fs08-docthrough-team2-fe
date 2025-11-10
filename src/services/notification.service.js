import api from '@/libs/api';
import { formatKoreanDate } from '@/libs/day';

// GET /notice/get-list
export const getMyNoticeList = async ({ signal } = {}) => {
  const { data } = await api.get('/notice/get-list', { signal });
  const rows = data?.data ?? data ?? [];

  return rows
    .filter((item) => item.isRead === false)
    .map((item) => ({
      id: item.notice_id,
      message: item.content,
      type: item.type,
      isRead: item.isRead,
      date: formatKoreanDate(item.created_at),
      createdAt: item.created_at,
      raw: item,
    }));
};

// POST /notice/add-mark-read/{noticeId}
export const markNoticeAsRead = async (noticeId) => {
  if (!noticeId) throw new Error('noticeId is required');
  const { data } = await api.post(`/notice/add-mark-read/${noticeId}`);
  return data;
};
