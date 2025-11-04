'use client';

import { useState } from 'react';
import Image from 'next/image';
import WorkPost from '@/components/templates/WorkPost';
import Button from '@/components/atoms/Button/Button';

import styles from '@/styles/pages/work/WorkPostPage.module.scss';
import ic_cancel from '/public/icon/ic_cancel.svg';

const WorkPostPage = () => {
  const [content, setContent] = useState('');
  const [isDraftOpen, setIsDraftOpen] = useState(true);

  const isHasDraft = true;

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleDraftOpen = () => {
    setIsDraftOpen((prev) => !prev);
  };

  return (
    <div className={styles.page}>
      <WorkPost content={content} onContentChange={handleContentChange} />
      {isHasDraft && isDraftOpen && (
        <div className={styles.draft}>
          <div className={styles.left}>
            <button className={styles.cancelButton} onClick={handleDraftOpen}>
              <Image src={ic_cancel} alt="cancel" width={24} height={24} />
            </button>
            <div className={styles.description}>
              임시 저장된 작업물이 있어요. 저장된 작업물을 불러오시겠어요??
            </div>
          </div>
          <Button variant="solid" size="sm" children="불러오기" />
        </div>
      )}
    </div>
  );
};

export default WorkPostPage;
