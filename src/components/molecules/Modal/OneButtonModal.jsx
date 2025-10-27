import Modal from '@/components/atoms/Modal/Modal';
import Button from '@/components/atoms/Button/Button';
import Image from 'next/image';
import checkIcon from '@/../public/icon/ic_check.svg';
import styles from '@/styles/components/molecules/Modal/OneButtonModal.module.scss';

function OneButtonModal({ isOpen, onConfirm, buttonText = '확인', disabled, children }) {
  return (
    <Modal isOpen={isOpen} contentClassName={styles.modalContainer}>
      <div className={styles.icon}>
        <Image src={checkIcon} alt="체크 아이콘" width={24} height={24} />
      </div>
      <p className={styles.message}>{children}</p>
      <Button
        variant="solid"
        size="lg"
        onClick={onConfirm}
        disabled={disabled}
        className={styles.confirmButton}
      >
        {buttonText}
      </Button>
    </Modal>
  );
}

export default OneButtonModal;
