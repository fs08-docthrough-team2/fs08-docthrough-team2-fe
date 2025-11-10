'use client';

import { useState } from 'react';
import clsx from 'clsx';
import BaseInput from './BaseInput';
import styles from '@/styles/components/atoms/Input/BaseInput.module.scss';
import Image from 'next/image';

import ic_eye from '/public/icons/eye.svg';
import ic_eye_off from '/public/icons/eye-off.svg';

export default function PasswordInput({
  name = 'password',
  label = '비밀번호',
  placeholder = '비밀번호를 입력해주세요',
  value = '',
  onChange,
  confirmValue,
  minLength = 8,
}) {
  const [show, setShow] = useState(false);

  // 길이 확인
  const tooShort = value.length > 0 && value.length < minLength;

  // 비밀번호 불일치 확인
  const mismatch =
    typeof confirmValue === 'string' &&
    confirmValue.length > 0 &&
    value.length > 0 &&
    confirmValue !== value;

  // 에러 메시지
  let error = null;
  if (mismatch) error = '비밀번호가 일치하지 않습니다';
  else if (tooShort) error = `${minLength}자 이상 입력해주세요`;

  const right = (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => setShow((s) => !s)}
      aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
    >
      <Image
        src={show ? ic_eye : ic_eye_off}
        alt="eye"
        width={24}
        height={24}
        className={styles.icon}
      />
    </button>
  );

  return (
    <div className={styles.passwordInputWrap}>
      <BaseInput
        name={name}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={show ? 'text' : 'password'}
        rightNode={right}
        error={error}
        inputProps={{
          autoComplete: 'new-password',
          // 👇 보이기 상태일 때 입력 글자색을 #171717로
          style: show ? { color: '#171717' } : undefined,
        }}
      />
    </div>
  );
}
