'use client';

import { useParams } from 'next/navigation';
import Work from '@/components/templates/Work';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { useGetChallengeWorkDetail } from '@/hooks/queries/useChallengeWorkQueries';

import styles from '@/styles/pages/admin/AdminWorkPage.module.scss';

const AdminWorkPage = () => {
  const { challengeId, workId } = useParams();
  const { data: challengeDetail } = useGetChallengeDetail(challengeId);
  const { data: challengeWorkDetail } = useGetChallengeWorkDetail(workId);

  return (
    <div className={styles.page}>
      <Work
        isAdmin={true}
        title={challengeDetail?.data?.title}
        type={challengeDetail?.data?.field}
        category={challengeDetail?.data?.type}
        nickName={challengeWorkDetail?.data?.item?.nickName}
        createdAt={challengeWorkDetail?.data?.item?.createdAt}
        likeCount={challengeWorkDetail?.data?.item?.likeCount}
        workItem={challengeWorkDetail?.data?.item?.workItem}
        attendId={workId}
        likeByMe={challengeWorkDetail?.data?.item?.likeByMe}
      />
    </div>
  );
};

export default AdminWorkPage;
