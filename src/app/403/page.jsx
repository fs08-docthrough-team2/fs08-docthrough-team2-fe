'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/atoms/Button/Button.jsx';
import styles from '@/styles/pages/NotFoundPage.module.scss';

const Forbidden = () => {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>403</div>
        <div className={styles.imageWrapper}>
          <Image
            src="/image/img_empty.svg"
            alt="접근 제한"
            width={320}
            height={168}
            className={styles.emptyImage}
          />
        </div>
        <h1 className={styles.title}>접근 권한이 없어요</h1>
        <p className={styles.description}>
          이 페이지에 접근할 수 있는 권한이 없습니다.
          <br />
          관리자에게 문의해 주세요.
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

export default Forbidden;
