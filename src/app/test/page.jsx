'use client';

import ChallengeListToolbar from '@/components/organisms/ChallengeListToolbar';

export default function TestPage() {
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
      {/* ✅ User Version */}
      <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ChallengeListToolbar
          variant="user"
          onCreateRequest={() => alert('유저: 신규 챌린지 신청')}
        />
      </section>

      {/* ✅ Admin Version */}
      <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ChallengeListToolbar variant="admin" />
      </section>
    </main>
  );
}
