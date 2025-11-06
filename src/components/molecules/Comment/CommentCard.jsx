'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import userIcon from '/public/image/img_profile_user.svg';
import styles from '@/styles/components/molecules/comment/CommentCard.module.scss';
import DropdownOption from '@/components/molecules/Dropdown/DropdownOption';

export default function CommentCard({
  variant = 'user', // 'admin' | 'user'
  name = '',
  date = '',
  text = '',
  className = '',
  feedbackId = '',
  onUpdate = () => {},
  onCancel = () => {},
  onDelete = () => {},
}) {
  const [editing, setEditing] = useState(false); // admin에서만 사용
  const [draft, setDraft] = useState(text);

  useEffect(() => setDraft(text), [text]);

  const wrapRef = useRef(null);

  const save = useCallback(() => {
    onUpdate(feedbackId, draft.trim());
    setEditing(false);
  }, [draft, feedbackId, onUpdate]);

  const cancel = useCallback(() => {
    setDraft(text);
    setEditing(false);
    onCancel();
  }, [text, onCancel]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      save();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  const isAdmin = variant === 'admin';
  // 유저는 리스트 카드에서 항상 읽기 전용, 어드민은 편집 중일 때만 입력 가능
  const readOnly = isAdmin ? !editing : true;

  return (
    <article ref={wrapRef} className={clsx(styles.card, editing && styles.editing, className)}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <Image src={userIcon} alt="" width={24} height={24} className={styles.avatar} />
          <div className={styles.nameDate}>
            <strong className={styles.name}>{name}</strong>
            <span className={styles.date}>{date}</span>
          </div>
        </div>

        {/* 우측 액션 */}
        <div className={styles.actions}>
          {/* 어드민 + 읽기 모드: 케밥 드롭다운(팀원 컴포넌트 재사용) */}
          {isAdmin && !editing && (
            <DropdownOption
              onEdit={() => setEditing(true)}
              onDelete={() => onDelete?.(feedbackId)}
            />
          )}

          {/* 어드민 + 편집 모드: [취소] [수정 완료] */}
          {isAdmin && editing && (
            <div className={styles.headerButtons}>
              <button type="button" className={styles.ghostBtn} onClick={cancel}>
                취소
              </button>
              <button type="button" className={styles.primaryBtn} onClick={save}>
                수정 완료
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 본문 */}
      <div className={styles.body} onKeyDown={!readOnly ? handleKeyDown : undefined}>
        {readOnly ? (
          <p className={styles.text}>{draft || text}</p>
        ) : (
          <textarea
            className={styles.editor}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="피드백을 남겨주세요"
            rows={3}
          />
        )}
      </div>
    </article>
  );
}
