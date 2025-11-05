const STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

const STATUS_SORTERS = {
  'status-pending': (status) => (status === STATUS.PENDING ? 0 : 1),
  'status-approved': (status) => (status === STATUS.APPROVED ? 0 : 1),
  'status-rejected': (status) => (status === STATUS.REJECTED ? 0 : 1),
};

const toTimestamp = (value) => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

const compareDateAsc = (a, b) => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
};

const compareDateDesc = (a, b) => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
};

export function sortChallenges(items, sortKey) {
  if (!Array.isArray(items) || items.length === 0 || !sortKey) {
    return items;
  }

  const sorted = [...items];

  if (sortKey in STATUS_SORTERS) {
    const getPriority = STATUS_SORTERS[sortKey];
    return sorted.sort((a, b) => getPriority(a?.status) - getPriority(b?.status));
  }

  switch (sortKey) {
    case 'applied-asc':
      return sorted.sort((a, b) =>
        compareDateAsc(
          toTimestamp(a?.appliedDate ?? a?.createdAt),
          toTimestamp(b?.appliedDate ?? b?.createdAt),
        ),
      );

    case 'applied-desc':
      return sorted.sort((a, b) =>
        compareDateDesc(
          toTimestamp(a?.appliedDate ?? a?.createdAt),
          toTimestamp(b?.appliedDate ?? b?.createdAt),
        ),
      );

    case 'deadline-asc':
      return sorted.sort((a, b) =>
        compareDateAsc(toTimestamp(a?.deadline), toTimestamp(b?.deadline)),
      );

    case 'deadline-desc':
      return sorted.sort((a, b) =>
        compareDateDesc(toTimestamp(a?.deadline), toTimestamp(b?.deadline)),
      );

    default:
      return items;
  }
}
