import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNoticeAsRead } from '@/services/notification.service';

// 유저 알림 읽음 처리
export const useMarkNoticeAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId) => markNoticeAsRead(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });
};
