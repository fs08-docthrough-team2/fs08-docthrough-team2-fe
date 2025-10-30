import styles from '@/styles/pages/my-challenge/MyChallengePage.module.scss';
import Button from '@/components/atoms/Button/Button';
import Tabs from '@/components/molecules/Tabs/Tabs';
import SearchInput from '@/components/atoms/Input/SearchInput';
import ChallengeCard from '@/components/molecules/ChallengeCard/ChallengeCard';

const CHALLENGE_DATA = {
  success: true,
  data: {
    participates: [
      {
        id: 1,
        title: 'React - Hooks & Best Practices',
        content:
          'React Hooks 핵심 개념과 실무 베스트 프랙티스를 함께 학습하고 정리하는 챌린지입니다.',
        type: 'React',
        status: 'ISCOMPLETED',
        filed: 'WEB',
        source: 'https://react.dev/learn',
        deadline: '2025-11-10T09:00:00.000Z',
        capacity: 20,
      },
      {
        id: 2,
        title: 'Node.js - Async Patterns & Performance',
        content: 'Node.js 비동기 패턴과 퍼포먼스 최적화를 주제로 심화 학습하는 챌린지입니다.',
        type: 'Node.js',
        status: 'INPROGRESS',
        filed: 'WEB',
        source: 'https://nodejs.org/en/learn',
        deadline: '2025-11-20T12:00:00.000Z',
        capacity: 12,
      },
      {
        id: 3,
        title: 'TypeScript - Advanced Types & Utility Types',
        content: 'TypeScript 고급 타입과 유틸리티 타입을 활용한 안전한 코드 작성을 연습합니다.',
        type: 'TypeScript',
        status: 'INPROGRESS',
        filed: 'WEB',
        source: 'https://www.typescriptlang.org/docs/handbook/intro.html',
        deadline: '2025-12-01T18:00:00.000Z',
        capacity: 25,
      },
    ],
  },
  pagination: {
    page: 1,
    pageSize: 10,
  },
};

const MyChallengePage = () => {
  const challengeData = CHALLENGE_DATA.data.participates;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitleWrapper}>
            <div className={styles.title}>나의 챌린지</div>
            <Button variant="solid" size="pill" children="신규 챌린지 신청" icon="newChallenge" />
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
