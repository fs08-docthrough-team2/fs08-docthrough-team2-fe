import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import userIcon from '/public/image/img_profile_user.svg';
import styles from '@/styles/components/molecules/comment/CommentCard.module.scss';

export default function CommentCard({
  variant = 'user', // 'admin' | 'user'
  name = '',
  date = '',
  text = '',
  className = '',
  onUpdate = () => {},
  onCancel = () => {},
  onDelete = () => {},
}) {
  const [editing, setEditing] = useState(false); // admin에서만 사용
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState(text);

  useEffect(() => setDraft(text), [text]);

  // 외부 클릭 시 드롭다운 닫기
  const wrapRef = useRef(null);
  useEffect(() => {
    const close = (e) =>
      wrapRef.current && !wrapRef.current.contains(e.target) && setMenuOpen(false);
    if (menuOpen) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const save = useCallback(() => {
    onUpdate(draft.trim());
    setEditing(false);
    setMenuOpen(false);
  }, [draft, onUpdate]);

  const cancel = useCallback(() => {
    setDraft(text);
    setEditing(false);
    setMenuOpen(false);
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
  const readOnly = isAdmin ? !editing : false; // user는 항상 읽기, admin은 편집 중일 때만 입력

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

        {/* 우측 액션 영역 */}
        <div className={styles.actions}>
          {/* admin + 읽기 모드: 케밥(세로 점3개) → 드롭다운 */}
          {isAdmin && !editing && (
            <>
              <button
                type="button"
                className={styles.kebab}
                aria-label="메뉴 열기"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </button>
              {menuOpen && (
                <div className={styles.menu} role="menu">
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    className={clsx(styles.menuItem, styles.danger)}
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </>
          )}

          {/* admin + 편집 모드: 헤더 오른쪽에 [취소] [수정 완료] */}
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
