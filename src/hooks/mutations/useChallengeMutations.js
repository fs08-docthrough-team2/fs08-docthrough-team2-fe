import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChallenge, updateChallenge } from '@/services/challenge.service.js';

const CHALLENGE_LIST_KEY = ['challenge-list'];
const challengeDetailKey = (challengeId) => ['challenge', challengeId];

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
