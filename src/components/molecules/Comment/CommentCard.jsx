import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import userIcon from '/public/image/img_profile_user.svg';
import styles from '@/styles/components/molecules/comment/CommentCard.module.scss';
import tb from '@/styles/components/atoms/input/TextBox.module.scss'; // 높이/패딩 톤 맞추려면 사용

export default function CommentCard({
  name, // 이름
  date, // "24/01/17 15:38" 같은 문자열
  text, // 본문
  onUpdate = () => {}, // 수정 완료 시 (draftText) 전달
  onCancel = () => {}, // 취소 시 콜백
  canEdit = true, // 점3개 노출 여부
  className = '',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const wrapRef = useRef(null);

  // 메뉴 바깥 클릭 닫기
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  // 편집 시작
  const startEdit = () => {
    setDraft(text);
    setEditing(true);
    setMenuOpen(false);
  };

  // 취소
  const handleCancel = () => {
    setEditing(false);
    setDraft(text);
    setMenuOpen(false);
    onCancel();
  };

  // 저장
  const handleSave = () => {
    const v = draft.trim();
    onUpdate(v);
    setMenuOpen(false);
    setEditing(false);
  };

  // 키보드: Esc 취소 / Ctrl|Cmd+Enter 저장
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    },
    [draft],
  );

  return (
    <article ref={wrapRef} className={clsx(styles.card, className)}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.meta}>
          <Image src={userIcon} alt="" width={24} height={24} className={styles.avatar} />
          <div className={styles.title}>
            <strong className={styles.name}>{name}</strong>
            <span className={styles.date}>{date}</span>
          </div>
        </div>

        {canEdit && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.kebab}
              aria-label="메뉴 열기"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {/* 점 3개 */}
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </button>

            {menuOpen && (
              <div className={styles.menu}>
                {!editing && (
                  <button type="button" className={styles.menuItem} onClick={startEdit}>
                    수정
                  </button>
                )}
                {editing ? (
                  <>
                    <button type="button" className={styles.menuItem} onClick={handleCancel}>
                      취소
                    </button>
                    <button
                      type="button"
                      className={clsx(styles.menuItem, styles.primary)}
                      onClick={handleSave}
                    >
                      수정 완료
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </header>

      {/* 본문 */}
      <div className={styles.body} onKeyDown={editing ? handleKeyDown : undefined}>
        {editing ? (
          // TextBox 톤에 맞춘 textarea (높이/패딩 동일)
          <label className={clsx(tb.textBox, styles.editBox)}>
            <textarea
              className={tb.field}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="내용을 입력하세요"
            />
          </label>
        ) : (
          <p className={styles.text}>{text}</p>
        )}
      </div>
    </article>
  );
}
