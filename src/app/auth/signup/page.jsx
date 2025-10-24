import styles from '@/styles/pages/auth/SignupPage.module.scss';
import Image from 'next/image';

import img_logo from '/public/image/img_logo.svg';
import EmailInput from '@/components/atoms/Input/EmailInput';
import PasswordInput from '@/components/atoms/Input/PasswordInput';
import Button from '@/components/atoms/Button/Button';
import AuthEntry from '@/components/atoms/AuthEntry/AuthEntry';
import GoogleButton from '@/components/atoms/Button/GoogleButton';
import BaseInput from '@/components/atoms/Input/BaseInput';

export default function SignupPage() {
  return (
    <div className={styles.signupPage}>
      <div className={styles.pageWrapper}>
        <Image src={img_logo} alt="logo" width={320} height={72} />
        <div className={styles.signupForm}>
          <EmailInput />
          <BaseInput label="닉네임" placeholder="닉네임을 입력해주세요" />
          <PasswordInput />
          <PasswordInput label="비밀번호 확인" placeholder="비밀번호를 한번 더 입력해주세요" />
        </div>
        <div className={styles.buttonWrapper}>
          <Button variant="solid" size="lg" children="회원가입" />
          <GoogleButton />
        </div>
        <AuthEntry type="login" />
      </div>
    </div>
  );
}
