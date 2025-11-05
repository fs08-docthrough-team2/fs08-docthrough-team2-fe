'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getIndividualParticipateChallengeList,
  getIndividualCompleteChallengeList,
  getChallengeDetail,
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

export const useGetChallengeDetail = (challengeId) => {
  return useQuery({
    queryKey: ['challenge-detail', challengeId],
    queryFn: () => getChallengeDetail(challengeId),
  });
};
