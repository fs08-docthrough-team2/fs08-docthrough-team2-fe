import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { getMyNoticeList } from '@/services/notification.service';

// 유저 알림 조회
export const useMyNotifications = ({ page = 1, pageSize = 100 } = {}) => {
  const userId = useAuthStore((state) => state.user?.userId);
  const isUserLoaded = useAuthStore((state) => state.isUserLoaded);

  return useQuery({
    queryKey: ['my-notifications', userId, page, pageSize],
    queryFn: ({ signal }) => getMyNoticeList({ page, pageSize, signal }),
    select: (res) => res?.notifications ?? [],
    enabled: Boolean(isUserLoaded && userId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
};
