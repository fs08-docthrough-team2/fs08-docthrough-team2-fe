import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeedbackListInfinite } from '@/services/feedback.service';

export const useGetFeedbackListInfinite = (attendId, pageSize = 15) => {
  return useInfiniteQuery({
    queryKey: ['feedback-list-infinite', attendId],
    queryFn: ({ pageParam = 1 }) => getFeedbackListInfinite({ attendId, pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      const page = lastPage?.data?.pagination?.page;
      const totalPage = lastPage?.data?.pagination?.totalPage;
      if (!page || !totalPage) return undefined;
      const next = page + 1;
      return next <= totalPage ? next : undefined;
    },
    initialPageParam: 1,
  });
};
