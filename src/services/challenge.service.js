import api from '@/libs/api.js';

export const fetchChallenges = async (params = {}) => {
  const { data } = await api.get('/challenge/inquiry/challenge-list', {
    params,
    // (선택) 이 엔드포인트가 공개라면 굳이 쿠키 보낼 필요 없음
    withCredentials: false,
  });
  return {
    items: data?.data ?? [],
    pagination: data?.pagination ?? { page: 1, pageSize: 10, totalCount: 0, totalPages: 1 },
  };
};
