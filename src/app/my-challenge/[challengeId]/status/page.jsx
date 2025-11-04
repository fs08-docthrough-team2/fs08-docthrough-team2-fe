import styles from '@/styles/pages/my-challenge/ChallengeApprovalDetailPage.module.scss';

import ChallengeApprovalStatus from '@/components/atoms/ChallengeApprovalStatus/ChallengeApprovalStatus';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import LinkPreview from '@/components/common/LinkPreview/LinkPreview';

const ChallengeApprovalDetailPage = () => {
  const stroke = (
    <svg xmlns="http://www.w3.org/2000/svg" width="891" height="1" viewBox="0 0 891 1" fill="none">
      <path d="M0.5 0.5H890.5" stroke="#E5E5E5" strokeLinecap="round" />
    </svg>
  );
  return (
    <div className={styles.page}>
      <ChallengeApprovalStatus />
      <div className={styles.stroke}>{stroke}</div>
      <div className={styles.content}>
        <ChallengeCardDetail isMyChallenge={true} />
        {stroke}
        <div className={styles.description}>
          <div className={styles.title}>원문 링크</div>
          <LinkPreview url="https://github.com/fs08-docthrough-team2/fs08-docthrough-team2-fe" />
        </div>
      </div>
    </div>
  );
};

export default ChallengeApprovalDetailPage;
