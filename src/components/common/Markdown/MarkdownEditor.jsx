'use client';

import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const MarkdownEditor = ({ value, onChange, placeholder }) => {
  return (
    <div
      data-color-mode="light"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <MDEditor
        value={value}
        onChange={onChange}
        preview="edit"
        height="100%"
        textareaProps={{
          placeholder: placeholder || '번역 내용을 적어주세요.',
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
