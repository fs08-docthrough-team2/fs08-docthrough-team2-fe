'use client';

import clsx from 'clsx';
import StatusChip from '@/components/atoms/Chips/StatusChip';
import styles from '@/styles/components/atoms/List/ChallengeList.module.scss';

const STATUS_META = {
  pending: { label: '검토 대기', type: 'pending' },
  rejected: { label: '승인 거절', type: 'rejected' },
  approved: { label: '승인 완료', type: 'approved' },
  deleted: { label: '챌린지 삭제', type: 'deleted' },
};

const FIELD_LABEL = {
  OFFICIAL: '공식문서',
  BLOG: '블로그',
};

const CATEGORY_LABEL = {
  NEXTJS: 'Next.js',
  API: 'API',
  CAREER: 'Career',
  MODERN: 'Modern JS',
  WEB: 'Web',
};

function extractTotalParticipants(participants) {
  if (participants == null) return '-';

  if (typeof participants === 'number') {
    return String(participants);
  }

  if (typeof participants === 'object') {
    const { total, totalParticipants, capacity, max, limit, target } = participants;

    const resolvedTotal = total ?? totalParticipants ?? capacity ?? max ?? limit ?? target;

    return resolvedTotal != null ? String(resolvedTotal) : '-';
  }

  const text = String(participants);
  if (!text.includes('/')) {
    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed : '-';
  }

  const [, totalPart] = text.split('/');
  const total = totalPart?.trim();

  return total && total.length > 0 ? total : '-';
}

function formatISODate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yy}/${mm}/${dd}`;
}

function ChallengeList({
  items = [],
  onClickTitle,
  emptyMessage = '현재 검토 중인 챌린지가 없습니다.',
}) {
  if (items.length === 0) {
    return (
      <ul>
        <li className={clsx(styles.row, styles.emptyRow)}>{emptyMessage}</li>
      </ul>
    );
  }

  return (
    <ul>
      {items.map(({ no, type, field, title, participants, appliedDate, deadline, status }) => {
        const statusInfo = STATUS_META[status?.toLowerCase()] ?? {
          label: status ?? '-',
          type: 'pending',
        };
        const fieldLabel = FIELD_LABEL[type] ?? type ?? '-';
        const categoryLabel = CATEGORY_LABEL[field] ?? field ?? '-';
        const appliedLabel = formatISODate(appliedDate);
        const deadlineLabel = formatISODate(deadline);
        const capacityLabel = extractTotalParticipants(participants);

        return (
          <li key={no ?? title} className={styles.row}>
            <span className={clsx(styles.cell, styles.cellNo)}>{no}</span>
            <span className={clsx(styles.cell, styles.cellField)}>{fieldLabel}</span>
            <span className={clsx(styles.cell, styles.cellCategory)}>{categoryLabel}</span>
            <button
              type="button"
              className={clsx(styles.cell, styles.cellTitleInteractive)}
              onClick={() => onClickTitle?.(no)}
            >
              {title}
            </button>
            <span className={clsx(styles.cell, styles.cellCapacity)}>{capacityLabel}</span>
            <span className={clsx(styles.cell, styles.cellApplied)}>{appliedLabel}</span>
            <span className={clsx(styles.cell, styles.cellDeadline)}>{deadlineLabel}</span>
            <span className={clsx(styles.cell, styles.cellStatus)}>
              <StatusChip label={statusInfo.label} type={statusInfo.type} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default ChallengeList;
