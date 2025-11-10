import api from '@/libs/api';
import { formatKoreanDate } from '@/libs/day';

// GET /notice/get-list
export const getMyNoticeList = async ({ page = 1, pageSize = 10, signal } = {}) => {
  const params = { page, pageSize };
  const { data } = await api.get('/notice/get-list', { params, signal });

  const rows = data?.data ?? data ?? [];
  const pagination = data?.pagination ?? {};

  const notifications = rows
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

  return { notifications, pagination };
};

// POST /notice/add-mark-read/{noticeId}
export const markNoticeAsRead = async (noticeId) => {
  if (!noticeId) throw new Error('noticeId is required');
  const { data } = await api.post(`/notice/add-mark-read/${noticeId}`);
  return data;
};
