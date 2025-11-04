import { useMemo } from 'react';
import Image from 'next/image';
import Modal from '@/components/atoms/Modal/Modal';
import { formatYYMMDD } from '@/libs/day';
import icOut from '@/../public/icon/ic_out.svg';
import styles from '@/styles/components/molecules/Modal/DraftModal.module.scss';

export default function DraftModal({ isOpen, drafts = [], onClose, onLoadDraft }) {
  const sortedDrafts = useMemo(
    () => [...drafts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [drafts],
  );

  const formatDate = (isoString) => formatYYMMDD(isoString) || new Date(isoString).toLocaleString();

  return (
    <Modal isOpen={isOpen} contentClassName={styles.modalContainer}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>임시저장 글</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            <Image src={icOut} alt="닫기" width={24} height={24} />
          </button>
        </div>

        <p className={styles.count}>총 {sortedDrafts.length}개</p>

        <ul className={styles.list}>
          {sortedDrafts.map((draft) => (
            <li key={draft.id} className={styles.listItem}>
              <button type="button" className={styles.entry} onClick={() => onLoadDraft?.(draft)}>
                <span className={styles.draftTitle}>{draft.title || '제목 없음'}</span>
                <time className={styles.timestamp}>{formatDate(draft.updatedAt)}</time>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
