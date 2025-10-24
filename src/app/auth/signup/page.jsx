'use client';

import styles from '@/styles/pages/auth/SignupPage.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import {
  isValidateEmail,
  isValidateNickname,
  isValidatePassword,
  isValidateConfirmPassword,
} from '@/libs/validator.js';
import { useRouter } from 'next/navigation';

import img_logo from '/public/image/img_logo.svg';
import EmailInput from '@/components/atoms/Input/EmailInput.jsx';
import PasswordInput from '@/components/atoms/Input/PasswordInput.jsx';
import Button from '@/components/atoms/Button/Button.jsx';
import AuthEntry from '@/components/atoms/AuthEntry/AuthEntry.jsx';
import GoogleButton from '@/components/atoms/Button/GoogleButton.jsx';
import BaseInput from '@/components/atoms/Input/BaseInput.jsx';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, nickname, password, confirmPassword } = form;
    if (
      !isValidateEmail(email) ||
      !isValidateNickname(nickname) ||
      !isValidatePassword(password) ||
      !isValidateConfirmPassword(password, confirmPassword)
    ) {
      alert('유효하지 않은 입력입니다.');
      return;
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.pageWrapper}>
        <Image src={img_logo} alt="logo" width={320} height={72} />
        <div className={styles.signupForm}>
          <EmailInput name="email" value={form.email} onChange={handleChange} />
          <BaseInput
            name="nickname"
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={form.nickname}
            onChange={handleChange}
          />
          <PasswordInput name="password" value={form.password} onChange={handleChange} />
          <PasswordInput
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            confirmValue={form.password}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button variant="solid" size="lg" children="회원가입" onClick={handleSubmit} />
          <GoogleButton />
        </div>
        <AuthEntry type="login" />
      </div>
    </div>
  );
}
