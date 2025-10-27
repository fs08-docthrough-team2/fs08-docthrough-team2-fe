import { useEffect, useId } from 'react';
import styles from '@/styles/components/molecules/Popup/BasicPopup.module.scss';

function BasicPopup({
  isOpen,
  onClose,
  onConfirm,
  confirmText = '확인',
  confirmDisabled = false,
  children,
}) {
  const messageId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow || '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose?.();
  };

  const handlePopupClick = (event) => {
    event.stopPropagation();
  };

  const handleConfirm = () => {
    if (confirmDisabled) return;
    onConfirm?.();
    onClose?.();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup} onClick={handlePopupClick}>
        <p id={messageId} className={styles.message}>
          {children}
        </p>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={confirmDisabled}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

export default BasicPopup;
