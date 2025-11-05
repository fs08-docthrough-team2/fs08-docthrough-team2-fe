'use client';

import { useState } from 'react';
import WorkPost from '@/components/templates/WorkPost';

import styles from '@/styles/pages/work/WorkEditPage.module.scss';

const WorkEditPage = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (value) => {
    setContent(value);
  };

  return (
    <div className={styles.page}>
      <WorkPost content={content} onContentChange={handleContentChange} />
    </div>
  );
};

export default WorkEditPage;
