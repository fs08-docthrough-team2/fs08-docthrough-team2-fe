'use client';

import Modal from '@/components/atoms/Modal/Modal';
import TextBox from '@/components/atoms/Input/TextBox';
import Button from '@/components/atoms/Button/Button';
import Image from 'next/image';
import styles from '@/styles/components/molecules/Modal/TextModal.module.scss';
import closeIcon from '/public/icon/ic_out.svg';

export default function TextModal({
  isOpen,
  title,
  value,
  placeholder,
  onChange,
  onSubmit,
  onClose,
  isSubmitting = false,
}) {
  const trimmed = value?.trim() ?? '';
  const submitDisabled = isSubmitting || trimmed.length === 0;

  return (
    <Modal isOpen={isOpen} contentClassName={styles.modal}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="�ݱ�">
            <Image src={closeIcon} alt="�ݱ�" width={24} height={24} priority />
          </button>
        </header>

        <div className={styles.body}>
          <label className={styles.fieldLabel} htmlFor="text-modal-textarea">
            내용
          </label>
          <TextBox
            id="text-modal-textarea"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={styles.textBox}
          />
        </div>

        <footer className={styles.footer}>
          <Button
            variant="solid"
            size="lg"
            onClick={() => {
              if (!submitDisabled) onSubmit(trimmed);
            }}
            disabled={submitDisabled}
          >
            {isSubmitting ? '전송 중' : '전송'}
          </Button>
        </footer>
      </div>
    </Modal>
  );
}
