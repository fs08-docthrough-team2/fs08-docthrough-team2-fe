import { useMutation } from '@tanstack/react-query';
import { createFeedback } from '@/services/feedback.service';

export const useCreateFeedbackMutation = () => {
  return useMutation({
    mutationFn: createFeedback,
  });
};
