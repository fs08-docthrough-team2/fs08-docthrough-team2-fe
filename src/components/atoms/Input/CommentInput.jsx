import { useCallback } from 'react';
import clsx from 'clsx';
import TextBox from '@/components/atoms/input/TextBox';
import FeedbackButton from '@/components/atoms/Button/FeedbackButton.jsx';
import styles from '@/styles/components/atoms/input/CommentInput.module.scss';

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  placeholder = '피드백을 남겨주세요',
  disabled = false,
  loading = false,
  className = '',
  ButtonComponent = FeedbackButton,
}) {
  const isActive = !!value?.trim();

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (disabled || loading || !isActive) return;
      onSubmit?.(value.trim());
    },
    [disabled, loading, isActive, onSubmit, value],
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={clsx(styles.form, className)}
    >
      <div className={styles.row}>
        <div className={styles.left}>
          <TextBox
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || loading}
          />
        </div>

        {/* 오른쪽: 팀원의 버튼 (겹치지 않음, 24px 아이콘) */}
        <ButtonComponent
          type="submit"
          isActive={isActive}
          disabled={disabled || loading || !isActive}
        />
      </div>
    </form>
  );
}
