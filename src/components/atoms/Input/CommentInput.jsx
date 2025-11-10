import { useCallback } from 'react';
import clsx from 'clsx';
import TextBox from '@/components/atoms/Input/TextBox';
import FeedbackButton from '@/components/atoms/Button/FeedbackButton.jsx';
import styles from '@/styles/components/atoms/Input/CommentInput.module.scss';

export default function CommentInput({
  value = '',
  onChange = () => {},
  onSubmit = () => {},
  placeholder = '피드백을 남겨주세요',
  disabled = false,
  loading = false,
  className = '',
  ButtonComponent = FeedbackButton,
}) {
  const isActive = !!value?.trim();

  const handleSubmit = () => {
    if (disabled || loading || !isActive) return;
    onSubmit(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={clsx(styles.form, className)}>
      <div className={styles.row}>
        <div className={styles.left}>
          <TextBox
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 오른쪽: 팀원의 버튼 (겹치지 않음, 24px 아이콘) */}
        <ButtonComponent
          type="button"
          isActive={isActive}
          disabled={disabled || loading || !isActive}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
