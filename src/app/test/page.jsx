'use client';

import { useState } from 'react';
import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';
import FilterPopup from '@/components/molecules/Popup/FilterPopup';

export default function TestPage() {
  const [userFilters, setUserFilters] = useState(null);
  const [adminFilters, setAdminFilters] = useState(null);

  return (
    <main
      style={{
        width: '100%',
        padding: '40px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
      }}
    >
      {/* USER */}
      <section style={{ display: 'flex', justifyContent: 'center' }}>
        <ChallengeListToolbar
          variant="user"
          onCreateRequest={() => alert('유저: 신규 챌린지 신청')}
          // ✅ 툴바 트리거 비활성화 + FilterPopup 자체 트리거 사용
          filterSlot={
            <FilterPopup
              onApply={(f) => setUserFilters(f)}
              onReset={(f) => setUserFilters(f)}
              onClose={() => {}}
            />
          }
        />
      </section>

      {/* ADMIN */}
      <section style={{ display: 'flex', justifyContent: 'center' }}>
        <ChallengeListToolbar
          variant="admin"
          filterSlot={
            <FilterPopup
              onApply={(f) => setAdminFilters(f)}
              onReset={(f) => setAdminFilters(f)}
              onClose={() => {}}
            />
          }
        />
      </section>
    </main>
  );
}
