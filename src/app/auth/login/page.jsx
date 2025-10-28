'use client';

import styles from '@/styles/pages/auth/LoginPage.module.scss';
import Image from 'next/image';

import img_logo from '/public/image/img_logo.svg';
import EmailInput from '@/components/atoms/Input/EmailInput';
import PasswordInput from '@/components/atoms/Input/PasswordInput';
import Button from '@/components/atoms/Button/Button';
import AuthEntry from '@/components/atoms/AuthEntry/AuthEntry';
import GoogleButton from '@/components/atoms/Button/GoogleButton';
import { useEffect, useState } from 'react';
import { isValidateEmail, isValidatePassword } from '@/libs/validator.js';
import api from '@/libs/api.js';
import { useRouter } from 'next/navigation';
import { getAccessToken, setAccessToken } from '@/libs/token.js';

const LoginPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isValidate, setIsValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isValidateEmail(form.email) && isValidatePassword(form.password)) {
      setIsValidate(true);
    } else {
      setIsValidate(false);
    }
  }, [form.email, form.password]);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace('/');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    const { email, password } = form;

    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const token = response.data?.accessToken;

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
    console.log(form);
    handleLogin();
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.pageWrapper}>
        <Image src={img_logo} alt="logo" width={320} height={72} />
        <div className={styles.loginForm}>
          <EmailInput name="email" value={form.email} onChange={handleChange} />
          <PasswordInput name="password" value={form.password} onChange={handleChange} />
          <div className={styles.buttonWrapper}>
            <Button
              variant="solid"
              size="lg"
              children="로그인"
              disabled={!isValidate || isLoading}
              onClick={handleSubmit}
            />
            <GoogleButton disabled={isLoading} />
          </div>
          <AuthEntry type="signup" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
