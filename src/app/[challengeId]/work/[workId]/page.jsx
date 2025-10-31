'use client';

import { useState } from 'react';
import styles from '@/styles/pages/work/WorkPage.module.scss';

import MarkdownEditor from '@/components/common/Markdown/MarkdownEditor';
import MarkdownViewer from '@/components/common/Markdown/MarkdownViewer';

const WorkPage = () => {
  const [value, setValue] = useState('');

  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <div>
      <MarkdownEditor value={value} onChange={handleChange} />
    </div>
  );
};

export default WorkPage;
