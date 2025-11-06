'use client';

import { useParams } from 'next/navigation';
import Work from '@/components/templates/Work';
import { useGetChallengeDetail } from '@/hooks/queries/useChallengeQueries';
import { useGetChallengeWorkDetail } from '@/hooks/queries/useChallengeWorkQueries';
import { useIsAdmin, useIsMine } from '@/hooks/useAuthStatus';

import styles from '@/styles/pages/work/WorkPage.module.scss';

const WorkPage = () => {
  const { challengeId, workId } = useParams();
  const isAdmin = useIsAdmin();
  // const isMine = useIsMine();

  const { data: challengeDetail } = useGetChallengeDetail(challengeId);
  const { data: challengeWorkDetail } = useGetChallengeWorkDetail(workId);

  // TODO: userId 넘겨주기
  // const isMyWork = isMine();
  const isMyWork = true;

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
