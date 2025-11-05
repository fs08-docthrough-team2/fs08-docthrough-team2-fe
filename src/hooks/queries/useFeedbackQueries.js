import { useQuery } from '@tanstack/react-query';
import { getFeedbackList } from '@/services/feedback.service';

export const useGetFeedbackList = (attendId) => {
  return useQuery({
    queryKey: ['feedback-list', attendId],
    queryFn: () => getFeedbackList(attendId),
  });
};
