import Modal from '@/components/atoms/Modal/Modal';
import Button from '@/components/atoms/Button/Button';
import Image from 'next/image';
import checkIcon from '@/../public/icon/ic_check.svg';
import styles from '@/styles/components/molecules/Modal/TwoButtonModal.module.scss';

function TwoButtonModal({
  isOpen,
  onClose,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  disabledConfirm,
  disabledCancel,
  children,
}) {
  return (
    <Modal isOpen={isOpen} contentClassName={styles.modalContainer}>
      <div className={styles.icon}>
        <Image src={checkIcon} alt="체크 아이콘" width={24} height={24} />
      </div>
      <p className={styles.message}>{children}</p>
      <div className={styles.buttonGroup}>
        <Button variant="outline" size="md" onClick={onClose} disabled={disabledCancel}>
          {cancelText}
        </Button>
        <Button variant="solid" size="md" onClick={onConfirm} disabled={disabledConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default TwoButtonModal;
