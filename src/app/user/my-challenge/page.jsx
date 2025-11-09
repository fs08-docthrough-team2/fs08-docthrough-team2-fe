'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetIndividualCompleteChallengeList,
  useGetIndividualParticipateChallengeList,
} from '@/hooks/queries/useChallengeQueries';
import Button from '@/components/atoms/Button/Button';
import Tabs from '@/components/molecules/Tabs/Tabs';
import SearchInput from '@/components/atoms/Input/SearchInput';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard';

import styles from '@/styles/pages/my-challenge/MyChallengePage.module.scss';

const MyChallengePage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState(0);
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
    router.push('/user/challenge/post');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (activeTab === 2) {
      router.push('/user/my-challenge/apply');
    }
  }, [activeTab, router]);

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
          <Tabs activeIndex={activeTab} onTabChange={handleTabChange} />
        </div>
        <SearchInput value={searchValue} onChange={handleSearchChange} />
      </div>
      <div className={styles.challengeListWrapper}>
        {activeTab === 0 && (
          <>
            {participateChallengeData.length === 0 ? (
              <div className={styles.empty}>아직 챌린지가 없어요.</div>
            ) : (
              participateChallengeData.map((challenge) => (
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
              ))
            )}
          </>
        )}
        {activeTab === 1 && (
          <>
            {completeChallengeData.length === 0 ? (
              <div className={styles.empty}>아직 챌린지가 없어요.</div>
            ) : (
              completeChallengeData.map((challenge) => (
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
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyChallengePage;
