'use client';

import clsx from 'clsx';
import { formatYYMMDD } from '@/libs/day';
import StatusChip from '@/components/atoms/Chips/StatusChip';
import styles from '@/styles/components/atoms/List/ChallengeList.module.scss';

const STATUS_META = {
  PENDING: { label: '승인 대기', type: 'pending' },
  APPROVED: { label: '신청 승인', type: 'approved' },
  INPROGRESS: { label: '진행 중', type: 'approved' },
  REJECTED: { label: '신청 거절', type: 'rejected' },
  CANCELLED: { label: '신청 취소', type: 'deleted' },
  DEADLINE: { label: '마감', type: 'deleted' },
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

function ChallengeList({
  items = [],
  onClickTitle,
  emptyMessage = '현재 검토 중인 챌린지가 없습니다.',
}) {
  if (items.length === 0) {
    return (
      <ul className={styles.list}>
        <li className={clsx(styles.row, styles.emptyRow)}>{emptyMessage}</li>
      </ul>
    );
  }

  return (
    <ul className={styles.list}>
      {items.map(
        ({ no, challengeId, type, field, title, participants, appliedDate, deadline, status }) => {
          const statusKey = String(status ?? '').toUpperCase();
          const statusInfo = STATUS_META[statusKey] ?? {
            label: statusKey || '-',
            type: 'pending',
          };
          const fieldLabel = FIELD_LABEL[type] ?? type ?? '-';
          const categoryLabel = CATEGORY_LABEL[field] ?? field ?? '-';
          const appliedLabel = formatYYMMDD(appliedDate) || '-';
          const deadlineLabel = formatYYMMDD(deadline) || '-';
          const capacityLabel = extractTotalParticipants(participants);

          return (
            <li key={no ?? title} className={styles.row}>
              <span className={clsx(styles.cell, styles.cellNo)}>{no}</span>
              <span className={clsx(styles.cell, styles.cellField)}>{fieldLabel}</span>
              <span className={clsx(styles.cell, styles.cellCategory)}>{categoryLabel}</span>
              <button
                type="button"
                className={clsx(styles.cell, styles.cellTitleInteractive)}
                onClick={() => onClickTitle?.(challengeId)}
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
        },
      )}
    </ul>
  );
}

export default ChallengeList;
