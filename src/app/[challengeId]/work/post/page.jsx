'use client';

import { useState } from 'react';
import Image from 'next/image';
import MarkdownEditor from '@/components/common/Markdown/MarkdownEditor';

import styles from '@/styles/pages/work/WorkPostPage.module.scss';
import stroke_gray from '/public/stroke.svg';

const WorkPostPage = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (value) => {
    setContent(value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.contentWrapper}>
        <div className={styles.title}>개발자로써 자신만의 브랜드를 구축하는 방법(dailydev)</div>
        <Image src={stroke_gray} alt="stroke" width={890} height={0} />
        <MarkdownEditor value={content} onChange={handleContentChange} />
      </div>
    </div>
  );
};

export default WorkPostPage;
