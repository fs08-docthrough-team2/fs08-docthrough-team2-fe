import { useId } from 'react';
import styles from '@/styles/components/atoms/input/BaseInput.module.scss';

export default function BaseInput({
  name,
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  leftNode = null,
  rightNode = null,
  error = null, // 🔴 빨간 에러 메시지
  helper = null, // ⚫ 검은 안내 문구
  disabled = false,
  inputProps = {},
}) {
  const uid = useId();
  const describedBy = [];
  if (error) describedBy.push(`${uid}-error`);
  if (helper) describedBy.push(`${uid}-helper`);

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={uid} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={[
          styles.inputWrap,
          error ? styles.hasError : '',
          disabled ? styles.isDisabled : '',
          leftNode ? styles.hasLeft : '',
          rightNode ? styles.hasRight : '',
        ].join(' ')}
      >
        {leftNode && <div className={styles.leftNode}>{leftNode}</div>}

        <input
          id={uid}
          name={name}
          className={styles.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy.join(' ') || undefined}
          {...inputProps}
        />

        {rightNode && <div className={styles.rightNode}>{rightNode}</div>}
      </div>

      {error ? (
        <p id={`${uid}-error`} className={styles.errorText}>
          {error}
        </p>
      ) : helper ? (
        <p id={`${uid}-helper`} className={styles.helperText}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}
