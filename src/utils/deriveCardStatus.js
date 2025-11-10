const CLOSED_STATUSES = new Set(['DEADLINE', 'CLOSED', 'ISCLOSED', 'CANCELLED']);
const COMPLETED_STATUSES = new Set(['ISCOMPLETED', 'COMPLETED']);

const normalizeStatus = (value) => {
  if (!value) return '';
  return String(value).replace(/\s|-/g, '').toUpperCase();
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export const deriveCardStatus = ({
  status,
  dueDate,
  deadline,
  total,
  maxParticipants,
  capacity,
  currentParticipants,
} = {}) => {
  const canonicalStatus = normalizeStatus(status);
  const dueValue = dueDate ?? deadline;
  const dueTime = dueValue ? new Date(dueValue).getTime() : NaN;

  const isClosedByStatus = canonicalStatus && CLOSED_STATUSES.has(canonicalStatus);
  const isClosedByDeadline = Number.isFinite(dueTime) && dueTime < Date.now();
  if (isClosedByStatus || isClosedByDeadline) {
    return 'ISCLOSED';
  }

  const totalCount =
    toNumber(total) ??
    toNumber(maxParticipants);
  const currentCount = toNumber(capacity) ?? toNumber(currentParticipants);
  const isFull =
    totalCount != null && currentCount != null && currentCount >= totalCount;
  const isCompletedByStatus = canonicalStatus && COMPLETED_STATUSES.has(canonicalStatus);

  if (isCompletedByStatus || isFull) {
    return 'ISCOMPLETED';
  }

  return null;
};
