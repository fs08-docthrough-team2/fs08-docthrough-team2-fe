'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/atoms/Button/Button.jsx';
import styles from '@/styles/pages/NotFoundPage.module.scss';

const NotFound = () => {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <div className={styles.imageWrapper}>
          <Image
            src="/image/img_empty.svg"
            alt="빈 페이지"
            width={320}
            height={168}
            className={styles.emptyImage}
          />
        </div>
        <h1 className={styles.title}>페이지를 찾을 수 없어요</h1>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나
          <br />
          이동되었을 수 있습니다.
        </p>
        <div className={styles.buttonWrapper}>
          <Button variant="solid" size="lg" onClick={() => router.push('/')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
