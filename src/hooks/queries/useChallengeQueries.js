'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getChallengeList,
  getAdminChallengeList,
  getIndividualParticipateChallengeList,
  getIndividualCompleteChallengeList,
  getChallengeDetail,
  getChallengeParticipants,
} from '@/services/challenge.service.js';

const challengeDetailKey = (challengeId) => ['challenge-detail', challengeId];

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

// 챌린지 상세 조회 (유저)
export const useChallengeDetailQuery = (challengeId, options = {}) =>
  useQuery({
    queryKey: challengeDetailKey(challengeId),
    enabled: Boolean(challengeId),
    queryFn: () => getChallengeDetail(challengeId),
    ...options,
  });

// 챌린지 리스트 조회 (유저)
export const useChallengeListQuery = (
  { page, pageSize = 10, searchKeyword, status, sort },
  options = {},
) =>
  useQuery({
    queryKey: ['challenge-list', page, pageSize, searchKeyword ?? '', status ?? '', sort ?? ''],
    queryFn: () => getChallengeList({ page, pageSize, searchKeyword, status, sort }),
    keepPreviousData: true,
    ...options,
  });

// 챌린지 리스트 조회 (어드민)
export const useAdminChallengeListQuery = (
  { page, pageSize = 10, searchKeyword, status, sort },
  options = {},
) =>
  useQuery({
    queryKey: [
      'admin-challenge-list',
      page,
      pageSize,
      searchKeyword ?? '',
      status ?? '',
      sort ?? '',
    ],
    queryFn: () => getAdminChallengeList({ page, pageSize, searchKeyword, status, sort }),
    keepPreviousData: true,
    ...options,
  });

// 챌린지 참여자 조회
export const useChallengeParticipantsQuery = ({ challengeId, page, pageSize }, options = {}) =>
  useQuery({
    queryKey: ['challenge-participants', challengeId, page, pageSize],
    enabled: Boolean(challengeId),
    keepPreviousData: true,
    queryFn: ({ signal }) =>
      getChallengeParticipants({
        challengeId,
        page,
        pageSize,
        signal,
      }),
    ...options,
  });
