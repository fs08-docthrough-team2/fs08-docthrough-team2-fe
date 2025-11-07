import { useQuery } from '@tanstack/react-query';
import { fetchChallenges } from '@/services/challenge.service';

export function useChallenges(params) {
  const { title = '', field = '', type = '', status = '', page = 1, pageSize = 10 } = params || {};

  return useQuery({
    // ✅ 모든 파라미터를 queryKey에 넣기
    queryKey: [
      'challenge-list',
      title || '',
      field || '',
      type || '',
      status || '',
      Number(page) || 1,
      Number(pageSize) || 10,
    ],
    queryFn: () => fetchChallenges({ title, field, type, status, page, pageSize }),
    keepPreviousData: true,
    staleTime: 30_000,
  });
}
