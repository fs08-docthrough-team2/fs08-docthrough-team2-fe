'use client';

import { useQuery } from '@tanstack/react-query';
import { getIndividualParticipateChallengeList } from '@/services/challenge.service.js';

export const useGetIndividualParticipateChallengeList = () => {
  return useQuery({
    queryKey: ['individual-participate-challenge-list'],
    queryFn: getIndividualParticipateChallengeList,
  });
};
