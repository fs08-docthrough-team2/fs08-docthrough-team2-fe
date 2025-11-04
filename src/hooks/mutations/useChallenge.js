import { useMutation } from '@tanstack/react-query';
import { createChallenge } from '@/services/challenge.service.js';

export const useCreateChallengeMutation = () => {
  return useMutation({
    mutationFn: createChallenge,
    // onSuccess: (data) => {},
    // onError: (error) => {},
  });
};
