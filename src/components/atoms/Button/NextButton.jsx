import Image from 'next/image';
import arrowButton from '/public/button/arrowButton.svg';
import styles from '@/styles/components/atoms/Button/NextButton.module.scss';

const NextButton = ({ onClick = () => {} }) => {
  return (
    <button className={styles.nextButton} onClick={onClick}>
      <Image src={arrowButton} alt="arrowButton" />
    </button>
  );
};

export default NextButton;
