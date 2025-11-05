'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchChallenges } from '@/services/challenge.service';

export function useChallenges(params, options = {}) {
  return useQuery({
    queryKey: ['challenges-user', params],
    queryFn: () => fetchChallenges(params),
    retry: false, // ❗ 실패 즉시 isError로
    refetchOnWindowFocus: false, // 포커스 시 재요청 X
    ...options,
  });
}
