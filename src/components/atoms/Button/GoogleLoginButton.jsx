'use client';

import Image from 'next/image';
import { useGoogleLogin } from '@/hooks/useAuth.js';

import ic_google from '/public/icon/ic_google.svg';
import styles from '@/styles/components/atoms/Button/GoogleButton.module.scss';

const GoogleLoginButton = ({ disabled = false }) => {
  const { googleOAuth } = useGoogleLogin();

  const handleOAuth = () => {
    googleOAuth();
  };

  return (
    <button className={styles.googleButton} onClick={handleOAuth} disabled={disabled}>
      <Image src={ic_google} alt="google" />
      <div className={styles.buttonText}>Google로 시작하기</div>
    </button>
  );
};

export default GoogleLoginButton;
