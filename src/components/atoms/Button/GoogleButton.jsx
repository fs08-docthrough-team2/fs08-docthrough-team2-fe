'use client';

import styles from '@/styles/components/atoms/Button/GoogleButton.module.scss';
import Image from 'next/image';

import ic_google from '/public/icon/ic_google.svg';

const GoogleButton = ({ onClick = () => {} }) => {
  return (
    <button className={styles.googleButton} onClick={onClick}>
      <Image src={ic_google} alt="google" />
      <div className={styles.buttonText}>Google로 시작하기</div>
    </button>
  );
};

export default GoogleButton;
