import { useMutation } from '@tanstack/react-query';
import { createFeedback, updateFeedback, deleteFeedback } from '@/services/feedback.service';

export const useCreateFeedbackMutation = () => {
  return useMutation({
    mutationFn: createFeedback,
  });
};

export const useUpdateFeedbackMutation = () => {
  return useMutation({
    mutationFn: updateFeedback,
  });
};

export const useDeleteFeedbackMutation = () => {
  return useMutation({
    mutationFn: deleteFeedback,
  });
};
