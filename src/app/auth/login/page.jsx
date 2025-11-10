'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLogin } from '@/hooks/useAuth.js';
import { isValidateEmail, isValidatePassword } from '@/libs/validator.js';
import EmailInput from '@/components/atoms/Input/EmailInput';
import PasswordInput from '@/components/atoms/Input/PasswordInput';
import Button from '@/components/atoms/Button/Button';
import AuthEntry from '@/components/atoms/AuthEntry/AuthEntry';
import OAuthWrapper from '@/components/common/OAuth/OAuthWrapper.jsx';

import img_logo from '/public/image/img_logo.svg';
import styles from '@/styles/pages/auth/LoginPage.module.scss';

const LoginPage = () => {
  const { login } = useLogin();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidate || isLoading) return;

    const { email, password } = form;
    try {
      setIsLoading(true);
      await login({ email, password });
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.pageWrapper}>
        <Link href="/" className={styles.logoLink}>
          <Image src={img_logo} alt="logo" width={320} height={72} />
        </Link>
        <form className={styles.loginForm}>
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
            <OAuthWrapper disabled={isLoading} />
          </div>
          <AuthEntry type="signup" />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
