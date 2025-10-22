import styles from '@/styles/components/atoms/Button/FeedbackButton.module.scss';

import feedbackButton from '/public/button/feedbackButton.svg';
import feedbackButtonActive from '/public/button/feedbackButtonActive.svg';
import Image from 'next/image';

const FeedbackButton = ({ isActive = false }) => {
  return (
    <button className={styles.feedbackButton}>
      {isActive ? (
        <Image src={feedbackButtonActive} alt="feedback" fill sizes="100%" />
      ) : (
        <Image src={feedbackButton} alt="feedback" fill sizes="100%" />
      )}
    </button>
  );
};

export default FeedbackButton;
