import Image from 'next/image';
import arrowButton from '/public/button/arrowButton.svg';
import styles from '@/styles/components/atoms/Button/NextButton.module.scss';

const NextButton = () => {
  return (
    <button className={styles.nextButton}>
      <Image src={arrowButton} alt="arrowButton" fill sizes="100%" />
    </button>
  );
};

export default NextButton;
