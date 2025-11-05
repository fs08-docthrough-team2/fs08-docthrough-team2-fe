import { useMutation } from '@tanstack/react-query';
import { createChallengeWork } from '@/services/challengeWork.service.js';

export const useCreateChallengeWorkMutation = () => {
  return useMutation({
    mutationFn: createChallengeWork,
  });
};
