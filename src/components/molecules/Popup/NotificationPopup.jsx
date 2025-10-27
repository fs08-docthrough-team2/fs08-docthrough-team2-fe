'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/styles/components/molecules/Popup/NotificationPopup.module.scss';

const sampleNotifications = [
  {
    id: 1,
    message: "'신청한 챌린지 이름' 제출물에 새로운 피드백이 등록되었어요.",
    date: '2024.04.01',
  },
  { id: 2, message: "'신청한 챌린지 이름' 챌린지 신청 결과가 도착했어요.", date: '2024.04.01' },
  { id: 3, message: "'신청한 챌린지 이름' 제출물이 업로드 완료되었어요.", date: '2024.04.01' },
  { id: 4, message: "'챌린지 이름' 기존 제출물에 추가 피드백이 등록되었어요.", date: '2024.04.01' },
  { id: 5, message: "'신청한 챌린지 이름' 마감일이 다가오고 있어요.", date: '2024.04.01' },
  { id: 6, message: "'신청한 챌린지 이름' 마감일이 다가오고 있어요.", date: '2024.04.01' },
  { id: 7, message: "'신청한 챌린지 이름' 마감일이 다가오고 있어요.", date: '2024.04.01' },
  { id: 8, message: "'신청한 챌린지 이름' 마감일이 다가오고 있어요.", date: '2024.04.01' },
];

const NotificationPopup = ({ notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const hasNotifications = notifications.length > 0;
  const iconSrc = hasNotifications
    ? '/icon/ic_notification_on.svg'
    : '/icon/ic_notification_off.svg';
  const iconAlt = hasNotifications ? '새 알림 있음' : '새 알림 없음';
  const dropdownClassName = [styles.dropdown, !hasNotifications && styles['dropdown_empty']]
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

  return (
    <div className={styles.notification} ref={popupRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles['bell-button']}
        aria-label="알림 확인"
      >
        <Image src={iconSrc} alt={iconAlt} width={24} height={24} priority />
      </button>

      {isOpen && (
        <div className={dropdownClassName}>
          <div className={styles.header}>
            <h3>알림</h3>
          </div>
          {hasNotifications && (
            <div className={styles.body}>
              <ul className={styles.list}>
                {notifications.map((notification) => (
                  <li key={notification.id} className={styles.item}>
                    <p className={styles.message}>{notification.message}</p>
                    <span className={styles.date}>{notification.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
