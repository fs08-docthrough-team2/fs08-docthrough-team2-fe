'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchChallenges } from '@/services/challenge.service';

export function useChallenges(params, options = {}) {
  return useQuery({
    queryKey: ['challenges-user'], // 고정 키 (우리가 수동 refetch)
    queryFn: () => fetchChallenges(params), // ✅ 여기서 params를 써서 API 호출
    enabled: false, // 수동 실행
    keepPreviousData: true,
    staleTime: 30_000,
    retry: false,
    ...options,
  });
}
