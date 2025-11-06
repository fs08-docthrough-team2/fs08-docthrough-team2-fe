'use client';

import { useParams } from 'next/navigation';
import Work from '@/components/templates/Work';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { useGetChallengeWorkDetail } from '@/hooks/queries/useChallengeWorkQueries';
import { useIsAdmin, useIsMine } from '@/hooks/useAuthStatus';

import styles from '@/styles/pages/work/WorkPage.module.scss';
import { useEffect, useState } from 'react';

const WorkPage = () => {
  const { challengeId, workId } = useParams();
  const isAdmin = useIsAdmin();
  const isMine = useIsMine();
  const [isMyWork, setIsMyWork] = useState(false);

  const { data: challengeDetail } = useGetChallengeDetail(challengeId);
  const { data: challengeWorkDetail, isSuccess: isWorkDetailLoaded } =
    useGetChallengeWorkDetail(workId);

  useEffect(() => {
    if (isWorkDetailLoaded && challengeWorkDetail?.data?.item?.userId) {
      const isMyWorkValue = isMine(challengeWorkDetail.data.item.userId);
      setIsMyWork(isMyWorkValue);
      console.log(isWorkDetailLoaded, challengeWorkDetail?.data?.item?.userId, isMyWorkValue);
    }
  }, [isWorkDetailLoaded, challengeWorkDetail]);

  return (
    <div className={styles.page}>
      <Work
        isAdmin={isAdmin}
        isMyWork={isMyWork}
        title={challengeDetail?.data?.title}
        type={challengeDetail?.data?.field}
        category={challengeDetail?.data?.type}
        nickName={challengeWorkDetail?.data?.item?.nickName}
        createdAt={challengeWorkDetail?.data?.item?.createdAt}
        likeCount={challengeWorkDetail?.data?.item?.likeCount}
        workItem={challengeWorkDetail?.data?.item?.workItem}
        attendId={workId}
      />
    </div>
  );
};

export default WorkPage;
