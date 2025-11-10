'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getChallengeList,
  getAdminChallengeList,
  getIndividualParticipateChallengeList,
  getIndividualCompleteChallengeList,
  getChallengeDetail,
  getChallengeParticipants,
  getMyAppliedChallenges,
  getChallengeApprovalDetail,
  getAdminChallengeDetail,
} from '@/services/challenge.service.js';

const challengeDetailKey = (challengeId) => ['challenge-detail', challengeId];

export const useGetIndividualParticipateChallengeList = ({ searchValue = '', enabled = true }) => {
  return useQuery({
    queryKey: ['individual-participate-challenge-list', searchValue],
    queryFn: ({ signal }) => getIndividualParticipateChallengeList({ searchValue, signal }),
    enabled,
  });
};

export const useGetIndividualCompleteChallengeList = ({ searchValue = '', enabled = true }) => {
  return useQuery({
    queryKey: ['individual-complete-challenge-list', searchValue],
    queryFn: ({ signal }) => getIndividualCompleteChallengeList({ searchValue, signal }),
    enabled,
  });
};

export const useGetChallengeDetail = (challengeId) => {
  return useQuery({
    queryKey: ['challenge-detail', challengeId],
    queryFn: () => getChallengeDetail(challengeId),
  });
};

export const useGetChallengeApprovalDetail = (challengeId) => {
  return useQuery({
    queryKey: ['challenge-approval-detail', challengeId],
    queryFn: () => getChallengeApprovalDetail(challengeId),
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

// 내가 신청한 챌린지 조회 (정렬 옵션)
export const useMyAppliedChallengeListQuery = ({
  page,
  pageSize = 10,
  searchKeyword,
  status,
  sort,
}) =>
  useQuery({
    queryKey: [
      'my-applied-challenge-list',
      page,
      pageSize,
      searchKeyword ?? '',
      status ?? '',
      sort ?? '',
    ],
    queryFn: ({ signal }) =>
      getMyAppliedChallenges({ page, pageSize, searchKeyword, status, sort, signal }),
    keepPreviousData: true,
  });

// 챌린지 상세 조회 (어드민)
export const useAdminChallengeDetailQuery = (challengeId, options = {}) =>
  useQuery({
    queryKey: ['admin-challenge-detail', challengeId],
    enabled: Boolean(challengeId),
    queryFn: () => getAdminChallengeDetail(challengeId),
    ...options,
  });
