import { useQuery } from '@tanstack/react-query';
import { fetchChallenges } from '@/services/challenge.service';

const keyify = (v) => (Array.isArray(v) || typeof v === 'object' ? JSON.stringify(v) : (v ?? ''));

export function useChallenges(params) {
  const { title = '', field = '', type = '', status = '', page = 1, pageSize = 10 } = params || {};

  return useQuery({
    queryKey: [
      'challenge-list',
      keyify(title),
      keyify(field),
      keyify(type),
      keyify(status),
      Number(page) || 1,
      Number(pageSize) || 10,
    ],
    queryFn: () => fetchChallenges({ title, field, type, status, page, pageSize }),
    keepPreviousData: true,
    staleTime: 30_000,
  });
}
