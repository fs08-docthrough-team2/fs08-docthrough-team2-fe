import { useState } from 'react';
import BaseInput from './BaseInput';
import styles from '@/styles/components/atoms/Input/BaseInput.module.scss';

export default function PasswordInput({
  label = '비밀번호',
  placeholder = '비밀번호를 입력해주세요',
  value,
  onChange,
  confirmValue, // 확인 입력값(비번 확인 칸에서 원본을 넘겨받을 때)
  minLength = 8,
}) {
  const [show, setShow] = useState(false);

  // 🔴 에러: 비밀번호 불일치만 에러로 (빨간 글씨)
  const mismatch =
    typeof confirmValue === 'string' &&
    confirmValue.length > 0 &&
    value.length > 0 &&
    confirmValue !== value;

  const error = mismatch ? '비밀번호가 일치하지 않습니다' : null;

  // ⚫ 안내문: 8자 미만은 "검은 글씨"로 안내만
  const needMore = value && value.length > 0 && value.length < minLength;
  const helper = !error && needMore ? '8자 이상 입력해주세요' : null;

  const right = (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => setShow((s) => !s)}
      aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
    >
      <img
        src={show ? '/icons/eye-off.svg' : '/icons/eye.svg'}
        alt=""
        width={20}
        height={20}
        draggable="false"
      />
    </button>
  );

  return (
    <BaseInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={show ? 'text' : 'password'}
      rightNode={right}
      error={error} // 🔴 불일치만 빨간글씨
      helper={helper} // ⚫ 8자 미만은 검은 안내문
      inputProps={{ autoComplete: 'new-password' }}
    />
  );
}
