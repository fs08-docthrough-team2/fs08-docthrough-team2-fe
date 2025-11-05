import { useMutation } from '@tanstack/react-query';
import { createChallengeWork, createChallengeWorkDraft } from '@/services/challengeWork.service.js';

export const useCreateChallengeWorkMutation = () => {
  return useMutation({
    mutationFn: createChallengeWork,
  });
};

export const useCreateChallengeWorkDraftMutation = () => {
  return useMutation({
    mutationFn: createChallengeWorkDraft,
  });
};
