import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createChallenge,
  updateChallenge,
  approveAdminChallenge,
  deleteChallenge,
} from '@/services/challenge.service.js';

const CHALLENGE_LIST_KEY = ['challenge-list'];
const ADMIN_CHALLENGE_LIST_KEY = ['admin-challenge-list'];
const challengeDetailKey = (challengeId) => ['challenge-detail', challengeId];

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

// 챌린지 승인 (어드민)
export const useApproveChallengeMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn: (challengeId) => approveAdminChallenge(challengeId),
    onSuccess: (data, challengeId, context) => {
      if (challengeId) {
        queryClient.invalidateQueries({ queryKey: challengeDetailKey(challengeId) });
      }
      queryClient.invalidateQueries({ queryKey: CHALLENGE_LIST_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_CHALLENGE_LIST_KEY });

      onSuccess?.(data, challengeId, context);
    },
    ...restOptions,
  });
};

// 챌린지 논리적 삭제
export const useDeleteChallengeMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn: (challengeId) => deleteChallenge(challengeId),
    onSuccess: (data, challengeId, context) => {
      queryClient.invalidateQueries({ queryKey: CHALLENGE_LIST_KEY });
      if (challengeId) {
        queryClient.removeQueries({ queryKey: challengeDetailKey(challengeId) });
      }
      onSuccess?.(data, challengeId, context);
    },
    ...restOptions,
  });
};
