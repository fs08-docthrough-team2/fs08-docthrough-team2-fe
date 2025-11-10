'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/styles/components/molecules/Popup/NotificationPopup.module.scss';

const NotificationPopup = ({
  notifications = [],
  isLoading = false,
  onRefresh,
  onClickNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const hasNotifications = notifications.length > 0;
  const iconSrc = hasNotifications
    ? '/icon/ic_notification_on.svg'
    : '/icon/ic_notification_off.svg';
  const iconAlt = hasNotifications ? '알림 있음' : '알림 없음';
  const dropdownClassName = [styles.dropdown, !hasNotifications && styles.dropdown_empty]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closePopup = () => setIsOpen(false);

  const togglePopup = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && typeof onRefresh === 'function') {
      onRefresh();
    }
  };

  const handleItemClick = (notification) => {
    onClickNotification?.(notification);
  };

  return (
    <div className={styles.notification} ref={popupRef}>
      <button
        type="button"
        onClick={togglePopup}
        className={styles['bell-button']}
        aria-label="알림 확인"
      >
        <Image src={iconSrc} alt={iconAlt} width={24} height={24} priority />
      </button>

      {isOpen && (
        <div className={dropdownClassName}>
          <div className={styles.header}>
            <h3>알림</h3>
            <button type="button" className={styles.closeButton} onClick={closePopup}>
              <Image src="/icon/ic_out.svg" alt="닫기" width={24} height={24} />
            </button>
          </div>

          {isLoading ? (
            <div className={styles.body}>
              <p className={styles.loading}>알림을 불러오는 중...</p>
            </div>
          ) : hasNotifications ? (
            <div className={styles.body}>
              <ul className={styles.list}>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={styles.item}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleItemClick(notification)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        handleItemClick(notification);
                      }
                    }}
                  >
                    <p className={styles.message}>{notification.message}</p>
                    <span className={styles.date}>{notification.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={styles.empty}>읽지 않은 알림이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
