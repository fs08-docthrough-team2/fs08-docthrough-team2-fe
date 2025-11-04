'use client';

import { useRouter } from 'next/navigation';
import { useGetIndividualParticipateChallengeList } from '@/hooks/queries/useChallenge';
import Button from '@/components/atoms/Button/Button';
import Tabs from '@/components/molecules/Tabs/Tabs';
import SearchInput from '@/components/atoms/Input/SearchInput';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard';

import styles from '@/styles/pages/my-challenge/MyChallengePage.module.scss';

const MyChallengePage = () => {
  const router = useRouter();

  const { data } = useGetIndividualParticipateChallengeList();

  const challengeData = data?.data?.participates ?? [];

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    router.push('/challenge/post');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitleWrapper}>
            <div className={styles.title}>나의 챌린지</div>
            <Button
              variant="solid"
              size="pill"
              children="신규 챌린지 신청"
              icon="newChallenge"
              onClick={handleCreateChallenge}
            />
          </div>
          <Tabs />
        </div>
        <SearchInput />
      </div>
      <div className={styles.challengeListWrapper}>
        {challengeData.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challengeName={challenge.title}
            type={challenge.type}
            category={challenge.filed}
            status={challenge.status}
            dueDate={challenge.deadline}
            total={challenge.capacity}
            capacity={challenge.capacity}
          />
        ))}
      </div>
    </div>
  );
};

export default MyChallengePage;
