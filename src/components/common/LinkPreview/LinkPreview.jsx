'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/components/common/LinkPreview/LinkPreview.module.scss';

const LinkPreview = ({ url }) => {
  const [metaData, setMetaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !url) return;

    const fetchMetaData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch link preview');
        }

        const data = await response.json();
        setMetaData(data);
      } catch (err) {
        console.error('Link preview error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetaData();
  }, [url, mounted]);

  if (!mounted || loading) {
    return <div className={styles.loading}>링크 미리보기 로딩 중...</div>;
  }

  if (error || !metaData) {
    return (
      <div className={styles.linkPreview}>
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>
          {url}
        </a>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
      {metaData.image && (
        <div className={styles.imageWrapper}>
          <img src={metaData.image} alt={metaData.title || ''} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        {metaData.siteName && <div className={styles.siteName}>{metaData.siteName}</div>}
        {metaData.title && <div className={styles.title}>{metaData.title}</div>}
        {metaData.description && <div className={styles.description}>{metaData.description}</div>}
      </div>
    </a>
  );
};

export default LinkPreview;
