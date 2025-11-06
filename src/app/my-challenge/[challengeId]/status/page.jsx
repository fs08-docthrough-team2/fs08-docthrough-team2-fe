'use client';

import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import ChallengeApprovalStatus from '@/components/atoms/ChallengeApprovalStatus/ChallengeApprovalStatus';
import ChallengeCardDetail from '@/components/molecules/ChallengeCard/ChallengeCardDetail';
import LinkPreview from '@/components/common/LinkPreview/LinkPreview';

import ic_stroke from '/public/stroke.svg';
import styles from '@/styles/pages/my-challenge/ChallengeApprovalDetailPage.module.scss';

const ChallengeApprovalDetailPage = () => {
  const { challengeId } = useParams();
  const { data: challengeDetail } = useGetChallengeDetail(challengeId);

  return (
    <div className={styles.page}>
      <ChallengeApprovalStatus />
      <div className={styles.stroke}>
        <Image src={ic_stroke} alt="stroke" width={890} height={0} />
      </div>
      <div className={styles.content}>
        <ChallengeCardDetail
          isMyChallenge={true}
          challengeName={challengeDetail?.data?.title}
          type={challengeDetail?.data?.field}
          category={challengeDetail?.data?.type}
          description={challengeDetail?.data?.content}
          dueDate={challengeDetail?.data?.deadline}
          total={challengeDetail?.data?.maxParticipants}
        />
        <Image src={ic_stroke} alt="stroke" width={890} height={0} />
        <div className={styles.description}>
          <div className={styles.title}>원문 링크</div>
          <LinkPreview url={challengeDetail?.data?.source} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeApprovalDetailPage;
