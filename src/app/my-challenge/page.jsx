'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetIndividualCompleteChallengeList,
  useGetIndividualParticipateChallengeList,
} from '@/hooks/queries/useChallenge';
import Button from '@/components/atoms/Button/Button';
import Tabs from '@/components/molecules/Tabs/Tabs';
import SearchInput from '@/components/atoms/Input/SearchInput';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard';

import styles from '@/styles/pages/my-challenge/MyChallengePage.module.scss';

const MyChallengePage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const { data: participateChallenge } = useGetIndividualParticipateChallengeList({
    searchValue: debouncedSearch,
  });
  const participateChallengeData = participateChallenge?.data?.participates ?? [];

  const { data: completeChallenge } = useGetIndividualCompleteChallengeList({
    searchValue: debouncedSearch,
  });
  const completeChallengeData = completeChallenge?.data?.completes ?? [];

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    router.push('/challenge/post');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
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
        <SearchInput value={searchValue} onChange={handleSearchChange} />
      </div>
      <div className={styles.challengeListWrapper}>
        {participateChallengeData.map((challenge) => (
          <ChallengeCard
            key={challenge.challengeId}
            challengeId={challenge.challengeId}
            challengeName={challenge.title}
            type={challenge.field}
            category={challenge.type}
            status={challenge.status}
            dueDate={challenge.deadline}
            total={challenge.maxParticipants}
            capacity={challenge.currentParticipants}
          />
        ))}
      </div>
    </div>
  );
};

export default MyChallengePage;
