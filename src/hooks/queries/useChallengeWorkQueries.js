import { useQuery } from '@tanstack/react-query';
import { getChallengeWorkDetail } from '@/services/challengeWork.service.js';

export const useGetChallengeWorkDetail = (attendId) => {
  return useQuery({
    queryKey: ['challenge-work-detail', attendId],
    queryFn: () => getChallengeWorkDetail(attendId),
  });
};
