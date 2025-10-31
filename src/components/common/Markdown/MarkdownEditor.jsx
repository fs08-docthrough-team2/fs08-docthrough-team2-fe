'use client';

import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const MarkdownEditor = ({ value, onChange }) => {
  return (
    <div data-color-mode="light">
      <MDEditor value={value} onChange={onChange} preview="edit" />
    </div>
  );
};

export default MarkdownEditor;
