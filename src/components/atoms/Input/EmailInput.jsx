'use client';

import { useState } from 'react';
import BaseInput from './BaseInput';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function EmailInput({
  label = '이메일',
  placeholder = '이메일을 입력해주세요',
  value,
  onChange,
  required = true,
}) {
  const [touched, setTouched] = useState(false);

  const showError = touched && value && !emailRegex.test(value);
  const error = showError ? '잘못된 이메일입니다.' : null;

  return (
    <BaseInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        if (!touched) setTouched(true);
      }}
      type="email"
      error={error} // 🔴 형식 틀리면 빨간글씨
      inputProps={{
        inputMode: 'email',
        autoComplete: 'email',
        onBlur: () => setTouched(true),
        required,
      }}
    />
  );
}
