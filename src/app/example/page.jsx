'use client';
import { useState } from 'react';
import EmailInput from '@/components/atoms/input/EmailInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import SearchInput from '@/components/atoms/input/SearchInput';
import TextBox from '@/components/atoms/input/TextBox';
import TypeChip from '@/components/atoms/chips/TypeChip';
import CategoryChip from '@/components/atoms/chips/CategoryChip';
import StatusChip from '@/components/atoms/chips/StatusChip';
import DateInput from '@/components/atoms/input/DateInput';
import CommentInput from '@/components/atoms/input/CommentInput.jsx';
import CommentCard from '@/components/molecules/comment/CommentCard';

export default function ExamplePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [expire, setExpire] = useState('');
  const [keyword, setKeyword] = useState('');
  const [text, setText] = useState('');
  const [comment, setComment] = useState('');
  const [content, setContent] = useState('');

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
          gridTemplateColumns: '1fr 1fr', // 2열
          gap: '40px',
          background: '#2f2f2f',
          padding: '40px',
          width: '900px',
        }}
      >
        {/* 이메일 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <EmailInput
            label="이메일"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <DateInput label="마감 기한" value={expire} onChange={(e) => setExpire(e.target.value)} />
        </div>

        {/* 비밀번호 , 서치 */}
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

        {/* TextBox: 그리드 전체 폭 */}
        <div style={{ gridColumn: '1 / -1', width: '100%' }}>
          <TextBox
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="피드백을 남겨주세요"
          />
        </div>

        {/* 칩 테스트 (원래대로) */}
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

        {/* ✅ 댓글 인풋: 그리드 '직계 자식' + 전체 폭 스팬 */}
        <section style={{ gridColumn: '1 / -1', width: '100%' }}>
          <h2>댓글 인풋</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <CommentInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onSubmit={(t) => {
                console.log('댓글 전송:', t);
                setComment('');
              }}
            />
          </div>
        </section>

        <CommentCard
          name="홍길동"
          date="24/01/17 15:38"
          text={content}
          onUpdate={(v) => setContent(v)}
          onCancel={() => console.log('수정 취소')}
          canEdit
        />
      </div>
    </main>
  );
}
