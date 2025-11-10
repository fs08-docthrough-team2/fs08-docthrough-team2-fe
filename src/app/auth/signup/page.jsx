'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSignup } from '@/hooks/useAuth.js';
import { useState, useEffect } from 'react';
import {
  isValidateEmail,
  isValidateNickname,
  isValidatePassword,
  isValidateConfirmPassword,
} from '@/libs/validator.js';
import EmailInput from '@/components/atoms/Input/EmailInput.jsx';
import PasswordInput from '@/components/atoms/Input/PasswordInput.jsx';
import Button from '@/components/atoms/Button/Button.jsx';
import AuthEntry from '@/components/atoms/AuthEntry/AuthEntry.jsx';
import GoogleLoginButton from '@/components/atoms/Button/GoogleLoginButton.jsx';
import BaseInput from '@/components/atoms/Input/BaseInput.jsx';

import img_logo from '/public/image/img_logo.svg';
import styles from '@/styles/pages/auth/SignupPage.module.scss';

const SignupPage = () => {
  const { signup } = useSignup();

  const [form, setForm] = useState({
    email: '',
    nickName: '',
    password: '',
    confirmPassword: '',
  });
  const [isValidate, setIsValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      isValidateEmail(form.email) &&
      isValidateNickname(form.nickName) &&
      isValidatePassword(form.password) &&
      isValidateConfirmPassword(form.password, form.confirmPassword)
    ) {
      setIsValidate(true);
    } else {
      setIsValidate(false);
    }
  }, [form.email, form.nickName, form.password, form.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidate || isLoading) return;

    const { email, nickName, password } = form;
    try {
      setIsLoading(true);
      await signup({ email, nickName, password });
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <Link href="/" className={styles.logoLink}>
        <Image src={img_logo} alt="logo" width={320} height={72} />
      </Link>
      <form className={styles.pageWrapper}>
        <div className={styles.signupForm}>
          <EmailInput name="email" value={form.email} onChange={handleChange} />
          <BaseInput
            name="nickName"
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={form.nickName}
            onChange={handleChange}
          />
          <PasswordInput name="password" value={form.password} onChange={handleChange} />
          <PasswordInput
            name="confirmPassword"
            label="비밀번호 확인"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            value={form.confirmPassword}
            onChange={handleChange}
            confirmValue={form.password}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            variant="solid"
            size="lg"
            children="회원가입"
            onClick={handleSubmit}
            disabled={!isValidate || isLoading}
          />
          <GoogleLoginButton disabled={isLoading} />
        </div>
        <AuthEntry type="login" />
      </form>
    </div>
  );
};

export default SignupPage;
