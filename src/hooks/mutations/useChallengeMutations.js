import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createChallenge,
  getChallengeList,
  getChallengeDetail,
  getAdminChallengeList,
  updateChallenge,
} from '@/services/challenge.service.js';

const CHALLENGE_LIST_KEY = ['challenge-list'];
const challengeDetailKey = (challengeId) => ['challenge', challengeId];

// 챌린지 상세 조회
export const useChallengeDetailQuery = (challengeId, options = {}) =>
  useQuery({
    queryKey: challengeDetailKey(challengeId),
    enabled: Boolean(challengeId),
    queryFn: () => getChallengeDetail(challengeId),
    ...options,
  });

// 챌린지 리스트 조회 (유저)
export const useChallengeListQuery = ({ page, pageSize = 10 }, options = {}) =>
  useQuery({
    queryKey: ['challenge-list', page, pageSize],
    queryFn: () => getChallengeList({ page, pageSize }),
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

// 챌린지 생성
export const useCreateChallengeMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CHALLENGE_LIST_KEY });
      if (typeof onSuccess === 'function') {
        onSuccess(data, variables, context);
      }
    },
    ...restOptions,
  });
};

// 챌린지 수정
export const useUpdateChallengeMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn: ({ challengeId, payload }) => updateChallenge({ challengeId, payload }),
    onSuccess: (data, variables, context) => {
      if (variables?.challengeId) {
        queryClient.invalidateQueries({ queryKey: challengeDetailKey(variables.challengeId) });
      }
      queryClient.invalidateQueries({ queryKey: CHALLENGE_LIST_KEY });

      if (typeof onSuccess === 'function') {
        onSuccess(data, variables, context);
      }
    },
    ...restOptions,
  });
};
