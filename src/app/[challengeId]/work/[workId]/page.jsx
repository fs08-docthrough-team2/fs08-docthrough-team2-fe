'use client';

import { useParams } from 'next/navigation';
import Work from '@/components/templates/Work';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { useGetChallengeWorkDetail } from '@/hooks/queries/useChallengeWorkQueries';

import styles from '@/styles/pages/work/WorkPage.module.scss';

const WorkPage = () => {
  const { challengeId, workId } = useParams();

  const { data: challengeDetail } = useGetChallengeDetail(challengeId);
  const { data: challengeWorkDetail } = useGetChallengeWorkDetail(workId);

  const userRole = challengeWorkDetail?.data?.item?.role;
  const isAdmin = userRole === 'ADMIN' ? true : false;

  return (
    <div className={styles.page}>
      <Work
        isAdmin={isAdmin}
        title={challengeDetail?.data?.title}
        type={challengeDetail?.data?.field}
        category={challengeDetail?.data?.type}
        nickName={challengeWorkDetail?.data?.item?.nickName}
        createdAt={challengeWorkDetail?.data?.item?.createdAt}
        likeCount={challengeWorkDetail?.data?.item?.likeCount}
        workItem={challengeWorkDetail?.data?.item?.workItem}
      />
    </div>
  );
};

export default WorkPage;
