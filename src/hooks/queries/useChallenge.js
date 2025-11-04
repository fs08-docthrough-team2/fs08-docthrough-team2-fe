'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getIndividualParticipateChallengeList,
  getIndividualCompleteChallengeList,
} from '@/services/challenge.service.js';

export const useGetIndividualParticipateChallengeList = ({ searchValue = '' }) => {
  return useQuery({
    queryKey: ['individual-participate-challenge-list', searchValue],
    queryFn: ({ signal }) => getIndividualParticipateChallengeList({ searchValue, signal }),
  });
};

export const useGetIndividualCompleteChallengeList = ({ searchValue = '' }) => {
  return useQuery({
    queryKey: ['individual-complete-challenge-list', searchValue],
    queryFn: ({ signal }) => getIndividualCompleteChallengeList({ searchValue, signal }),
  });
};
