'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Split from 'react-split';
import PostHeader from '@/components/organisms/PostHeader/PostHeader';
import MarkdownEditor from '@/components/common/Markdown/MarkdownEditor';

import styles from '@/styles/pages/work/WorkPostPage.module.scss';
import stroke_gray from '/public/stroke.svg';
import ic_list from '/public/icon/ic_list.svg';

const WorkPostPage = () => {
  const [content, setContent] = useState('');
  const [isSplit, setIsSplit] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [splitSizes, setSplitSizes] = useState([60, 40]);
  const [minSize, setMinSize] = useState(200);
  const [direction, setDirection] = useState('horizontal');
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleListButtonClick = (prev) => {
    setIsSplit(!prev);
  };

  const websiteUrl = 'http://localhost:3000';

  // 반응형 split sizes, minSize, direction 설정
  useEffect(() => {
    const updateSplitSizes = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        // 모바일: 위 아래 30:70 (vertical)
        setSplitSizes([30, 70]);
        setMinSize(100);
        setDirection('vertical');
      } else if (width <= 768) {
        // 태블릿: 50:50 (horizontal)
        setSplitSizes([50, 50]);
        setMinSize(150);
        setDirection('horizontal');
      } else {
        // 데스크톱: 60:40 (horizontal)
        setSplitSizes([60, 40]);
        setMinSize(200);
        setDirection('horizontal');
      }
    };

    updateSplitSizes();
    window.addEventListener('resize', updateSplitSizes);

    return () => {
      window.removeEventListener('resize', updateSplitSizes);
    };
  }, []);

  // iframe 로드 체크
  useEffect(() => {
    setIframeError(false);

    // 일정 시간 후에도 로드되지 않으면 에러로 간주 (보안 정책으로 차단될 수 있음)
    timeoutRef.current = setTimeout(() => {
      // iframe이 있지만 내용이 비어있거나 에러가 있는지 확인
      const iframe = iframeRef.current;
      if (iframe) {
        try {
          // cross-origin 정책으로 인해 접근 불가할 수 있음
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          // 접근 가능하면 정상적으로 로드된 것으로 간주
        } catch (e) {
          // 접근 불가능하면 cross-origin이거나 로드 실패일 수 있음
          // 하지만 이것만으로는 에러 판단이 어려움
        }
      }
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [websiteUrl]);

  const pageContent = (
    <div className={styles.page}>
      <PostHeader />
      <div className={styles.contentWrapper}>
        <div className={styles.contentHeader}>
          <div className={styles.title}>개발자로써 자신만의 브랜드를 구축하는 방법(dailydev)</div>
          <button className={styles.listButton} onClick={() => handleListButtonClick(isSplit)}>
            <Image src={ic_list} alt="list" width={24} height={24} />
            <span className={styles.listButtonText}>원문 보기</span>
          </button>
        </div>
        <Image src={stroke_gray} alt="stroke" width={890} height={0} />
        <MarkdownEditor value={content} onChange={handleContentChange} />
      </div>
    </div>
  );

  return (
    <>
      {isSplit ? (
        <Split
          sizes={splitSizes}
          minSize={minSize}
          gutterSize={10}
          direction={direction}
          className={styles.split}
          gutterStyle={() => ({
            backgroundColor: '#ccc',
            cursor: direction === 'vertical' ? 'row-resize' : 'col-resize',
            [direction === 'vertical' ? 'height' : 'width']: '10px',
          })}
          onDragEnd={(sizes) => setSplitSizes(sizes)}
        >
          {pageContent}
          <div className={styles.panel}>
            <div className={styles.websiteViewer}>
              {iframeError ? (
                <div className={styles.errorMessage}>
                  <p>이 웹사이트는 보안 정책으로 인해 iframe에서 로드할 수 없습니다.</p>
                  <p className={styles.errorSubtext}>
                    일부 사이트(Google, Facebook, Twitter 등)는 X-Frame-Options 정책으로 iframe
                    로드가 차단됩니다.
                  </p>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  key={websiteUrl}
                  src={websiteUrl}
                  className={styles.iframe}
                  title="Website Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                  onLoad={() => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setIframeError(false);
                  }}
                />
              )}
            </div>
          </div>
        </Split>
      ) : (
        pageContent
      )}
    </>
  );
};

export default WorkPostPage;
