import styles from '@/styles/components/atoms/ChallengeApprovalStatus/ChallengeApprovalStatus.module.scss';
import clsx from 'clsx';

const statusMap = {
  deleted: {
    title: '삭제된 챌린지입니다.',
    description: '삭제 사유',
  },
  pending: {
    title: '승인 대기중입니다.',
  },
  rejected: {
    title: '신청이 거절되었습니다.',
    description: '신청 거절 사유',
  },
};

/*
status: deleted | pending | rejected
*/
const ChallengeApprovalStatus = ({
  status = 'deleted',
  userName = '독스루 운영진',
  reason = '독스루는 개발 문서 번역 플랫폼으로, 다른 종류의 번역 챌린지를 개최할 수 없음을 알려드립니다. 감사합니다.',
  createdAt = '2025-01-01',
}) => {
  const className = clsx(styles.statusBar, styles[status]);

  return (
    <div className={styles.statusWrapper}>
      <div className={className}>{statusMap[status].title}</div>
      {status === 'deleted' || status === 'rejected' ? (
        <div className={styles.description}>
          <div className={styles.title}>{statusMap[status].description}</div>
          <div className={styles.reason}>{reason}</div>
          <div className={styles.footer}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.separator}>|</div>
            <div className={styles.createdAt}>{createdAt}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChallengeApprovalStatus;
