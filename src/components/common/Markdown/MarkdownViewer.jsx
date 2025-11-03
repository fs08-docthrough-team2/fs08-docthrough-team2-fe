'use client';

import MDEditor from '@uiw/react-md-editor';

const MarkdownViewer = ({ value }) => {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={value} />
    </div>
  );
};

export default MarkdownViewer;
