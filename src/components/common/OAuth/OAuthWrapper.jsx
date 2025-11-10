'use client';

import Image from 'next/image';
import { useGoogleLogin, useKakaoLogin } from '@/hooks/useAuth.js';

import ic_circle_google from '/public/icon/ic_circle_google.svg';
import ic_circle_kakao from '/public/icon/ic_circle_kakao.svg';
import styles from '@/styles/components/common/OAuth/OAuthWrapper.module.scss';

const OAuthWrapper = ({ disabled = false }) => {
  const { googleOAuth } = useGoogleLogin();
  const { kakaoOAuth } = useKakaoLogin();

  const handleGoogleOAuth = () => {
    googleOAuth();
  };
  const handleKakaoOAuth = () => {
    kakaoOAuth();
  };

  return (
    <div className={styles.OAuthWrapper}>
      <div className={styles.title}>간편 로그인하기</div>
      <div className={styles.iconWrapper}>
        <button className={styles.socialButton} onClick={handleGoogleOAuth} disabled={disabled}>
          <Image src={ic_circle_google} alt="google" width={42} height={42} />
        </button>
        <button className={styles.socialButton} onClick={handleKakaoOAuth} disabled={disabled}>
          <Image src={ic_circle_kakao} alt="kakao" width={42} height={42} />
        </button>
      </div>
    </div>
  );
};

export default OAuthWrapper;
