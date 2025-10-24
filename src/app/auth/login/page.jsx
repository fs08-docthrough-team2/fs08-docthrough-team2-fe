import styles from '@/styles/pages/auth/LoginPage.module.scss';
import Image from 'next/image';

import img_logo from '/public/image/img_logo.svg';
import EmailInput from '@/components/atoms/Input/EmailInput';
import PasswordInput from '@/components/atoms/Input/PasswordInput';
import Button from '@/components/atoms/Button/Button';
import AuthEntry from '@/components/atoms/AuthEntry/AuthEntry';
import GoogleButton from '@/components/atoms/Button/GoogleButton';

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.pageWrapper}>
        <Image src={img_logo} alt="logo" width={320} height={72} />
        <div className={styles.loginForm}>
          <EmailInput />
          <PasswordInput />
          <div className={styles.buttonWrapper}>
            <Button variant="solid" size="lg" children="로그인" />
            <GoogleButton />
          </div>
          <AuthEntry type="signup" />
        </div>
      </div>
    </div>
  );
}
