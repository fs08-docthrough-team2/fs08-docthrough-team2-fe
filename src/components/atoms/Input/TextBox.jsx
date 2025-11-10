import clsx from 'clsx';
import styles from '@/styles/components/atoms/Input/TextBox.module.scss';

export default function TextBox({
  value,
  onChange,
  placeholder = '피드백을 남겨주세요',
  className,
  disabled = false,
  readOnly = false,
  name,
  id,
}) {
  return (
    <label className={clsx(styles.textBox, className)}>
      <textarea
        id={id}
        name={name}
        className={styles.field}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        rows={3}
      />
    </label>
  );
}
