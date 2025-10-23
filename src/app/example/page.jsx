'use client';
import { useState } from 'react';
import EmailInput from '@/components/atoms/input/EmailInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import BaseInput from '@/components/atoms/input/BaseInput';
import SearchInput from '@/components/atoms/input/SearchInput';
import TextBox from '@/components/atoms/input/TextBox';
import TypeChip from '@/components/atoms/chips/TypeChip';
import CategoryChip from '@/components/atoms/chips/CategoryChip';
import StatusChip from '@/components/atoms/chips/StatusChip';

export default function ExamplePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [expire, setExpire] = useState('');
  const [keyword, setKeyword] = useState('');
  const [text, setText] = useState('');

  return (
    <main
      style={{
        background: '#2f2f2f',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', // ✅ 2열
          gap: '40px',
          background: '#2f2f2f',
          padding: '40px',
          width: '900px',
        }}
      >
        {/*  왼쪽 열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <EmailInput
            label="이메일"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <BaseInput
            label="마감 기한"
            placeholder="YY/MM/DD"
            value={expire}
            onChange={(e) => setExpire(e.target.value)}
            type="date"
            rightNode={<img src="/icons/calendar.svg" alt="" width={32} height={32} />}
          />
        </div>

        {/*  오른쪽 열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PasswordInput
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showHelper
            minLength={8}
          />

          <PasswordInput
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            confirmValue={password}
          />

          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={(v) => console.log('검색:', v)}
          />
        </div>

        <div style={{ gridColumn: '1 / -1', width: '100%' }}>
          <TextBox
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="피드백을 남겨주세요"
          />
        </div>

        {/*  칩 테스트  */}
        <section>
          <h2>Chip Components</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <TypeChip label="Next.js" color="green" />
            <TypeChip label="API" color="orange" />
            <TypeChip label="Career" color="blue" />
            <TypeChip label="Modern JS" color="red" />
            <TypeChip label="Web" color="yellow" />
          </div>

          <h2>Category Chip</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <CategoryChip label="블로그" />
            <CategoryChip label="공식문서" />
          </div>

          <h2>Status Chip</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <StatusChip label="승인 대기" type="pending" />
            <StatusChip label="신청 거절" type="rejected" />
            <StatusChip label="신청 승인" type="approved" />
            <StatusChip label="챌린지 삭제" type="deleted" />
          </div>
        </section>
      </div>
    </main>
  );
}
