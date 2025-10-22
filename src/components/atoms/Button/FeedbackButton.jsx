import styles from '@/styles/components/atoms/Button/FeedbackButton.module.scss';

import feedbackButton from '/public/button/feedbackButton.svg';
import feedbackButtonActive from '/public/button/feedbackButtonActive.svg';
import Image from 'next/image';

const FeedbackButton = ({ isActive = false, onClick = () => {} }) => {
  return (
    <button className={styles.feedbackButton} onClick={onClick}>
      {isActive ? (
        <Image src={feedbackButtonActive} alt="feedback" />
      ) : (
        <Image src={feedbackButton} alt="feedback" />
      )}
    </button>
  );
};

export default FeedbackButton;
