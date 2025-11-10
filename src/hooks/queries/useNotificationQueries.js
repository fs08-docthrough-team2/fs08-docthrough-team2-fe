import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { getMyNoticeList } from '@/services/notification.service';

// 유저 알림 조회
export const useMyNotifications = () => {
  const userId = useAuthStore((state) => state.user?.userId);
  const isUserLoaded = useAuthStore((state) => state.isUserLoaded);

  return useQuery({
    queryKey: ['my-notifications', userId],
    queryFn: ({ signal }) => getMyNoticeList({ signal }),
    select: (notifications) => notifications ?? [],
    enabled: Boolean(isUserLoaded && userId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
};
