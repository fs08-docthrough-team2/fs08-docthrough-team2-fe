'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Work from '@/components/templates/Work';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { useGetChallengeWorkDetail } from '@/hooks/queries/useChallengeWorkQueries';
import { useIsAdmin, useIsMine } from '@/hooks/useAuthStatus';
import Spinner from '@/components/common/Spinner';

import styles from '@/styles/pages/work/WorkPage.module.scss';

const WorkPage = () => {
  const { challengeId, workId } = useParams();
  const isAdmin = useIsAdmin();
  const isMine = useIsMine();
  const [isMyWork, setIsMyWork] = useState(false);

  const { data: challengeDetail, isLoading: isChallengeDetailLoading } =
    useGetChallengeDetail(challengeId);

  const {
    data: challengeWorkDetail,
    isSuccess: isWorkDetailLoaded,
    isLoading: isChallengeWorkDetailLoading,
  } = useGetChallengeWorkDetail(workId);

  useEffect(() => {
    if (isWorkDetailLoaded && challengeWorkDetail?.data?.item?.userId) {
      const isMyWorkValue = isMine(challengeWorkDetail.data.item.userId);
      setIsMyWork(isMyWorkValue);
    }
  }, [isWorkDetailLoaded, challengeWorkDetail]);

  return (
    <>
      {<Spinner isLoading={isChallengeDetailLoading || isChallengeWorkDetailLoading} />}
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
          likeByMe={challengeWorkDetail?.data?.item?.likeByMe}
        />
      </div>
    </>
  );
};

export default WorkPage;
