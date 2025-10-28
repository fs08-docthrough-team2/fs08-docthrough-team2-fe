'use client';

import styles from '@/styles/pages/auth/SignupPage.module.scss';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  isValidateEmail,
  isValidateNickname,
  isValidatePassword,
  isValidateConfirmPassword,
} from '@/libs/validator.js';
import { useRouter } from 'next/navigation';
import api from '@/libs/api.js';
import { setAccessToken } from '@/libs/token.js';

import img_logo from '/public/image/img_logo.svg';
import EmailInput from '@/components/atoms/Input/EmailInput.jsx';
import PasswordInput from '@/components/atoms/Input/PasswordInput.jsx';
import Button from '@/components/atoms/Button/Button.jsx';
import AuthEntry from '@/components/atoms/AuthEntry/AuthEntry.jsx';
import GoogleButton from '@/components/atoms/Button/GoogleButton.jsx';
import BaseInput from '@/components/atoms/Input/BaseInput.jsx';

const SignupPage = () => {
  const router = useRouter();

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

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const { email, nickName, password } = form;

      const response = await api.post('/auth/signup', { email, nickName, password });
      const token = response.data?.user?.accessToken;

      if (token) {
        setAccessToken(token);
        router.push('/');
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSignup();
  };

  return (
    <div className={styles.signupPage}>
      <Image src={img_logo} alt="logo" width={320} height={72} />
      <div className={styles.pageWrapper}>
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
          <GoogleButton disabled={isLoading} />
        </div>
        <AuthEntry type="login" />
      </div>
    </div>
  );
};

export default SignupPage;
