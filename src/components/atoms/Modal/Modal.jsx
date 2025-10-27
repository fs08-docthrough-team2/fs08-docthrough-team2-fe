import { useEffect } from 'react';
import clsx from 'clsx';
import styles from '@/styles/components/atoms/Modal/Modal.module.scss';

function Modal({ isOpen = false, children, contentClassName }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={clsx(styles.modal, contentClassName)}>{children}</div>
    </div>
  );
}

export default Modal;
