import styles from '@/styles/components/atoms/input/TextBox.module.scss';

export default function TextBox({
  value,
  onChange,
  maxLength = 300,
  placeholder = '피드백을 남겨주세요',
}) {
  return (
    <div className={styles.tbWrap}>
      <textarea
        className={styles.tbArea}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <span className={styles.tbCount}>
        {value.length}/{maxLength}
      </span>
    </div>
  );
}
