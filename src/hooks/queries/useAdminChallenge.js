'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/libs/api';

const ADMIN_LIST_ENDPOINT = '/challenge/admin/inquiry/challenge-list';

// 문서 그대로 쓰니 굳이 변환 안 해도 됨(남겨둠)
const STATUS_MAP = {
  신청승인: '신청승인',
  신청거절: '신청거절',
  신청취소: '신청취소',
  신청대기: '신청대기',
};

export function useAdminChallengeListQuery(params = {}) {
  const { page = 1, pageSize = 10, searchKeyword = '', status = '' } = params;

  const p = Math.max(1, Number(page) || 1); // ✅ 1-based
  const size = Math.max(1, Number(pageSize) || 10);
  const kw = (searchKeyword || '').trim();
  const st = STATUS_MAP[status] ?? status;

  return useQuery({
    queryKey: ['admin-challenge-list', p, size, kw, st],
    queryFn: async ({ signal }) => {
      const query = {
        page: p, // ✅ 1-based
        size, // ✅ key는 size
        ...(kw ? { searchKeyword: kw } : {}),
        ...(st ? { status: st } : {}),
      };
      const { data } = await api.get(ADMIN_LIST_ENDPOINT, { params: query, signal });
      return data; // { data/items, pagination{ page,totalPages,totalCount } }
    },
    keepPreviousData: true,
    staleTime: 30_000,
  });
}
