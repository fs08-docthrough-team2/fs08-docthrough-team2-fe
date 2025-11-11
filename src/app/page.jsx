'use client';

import Image from 'next/image';
import styles from '@/styles/pages/LandingPage.module.scss';
import Button from '@/components/atoms/Button/Button.jsx';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { user, isUserLoaded } = useAuthStore();

  useEffect(() => {
    if (isUserLoaded && user?.role === 'USER') {
      router.replace('/user/challenge');
    } else if (isUserLoaded && user?.role === 'ADMIN') {
      router.replace('/admin');
    }
  }, [isUserLoaded, user, router]);

  return (
    <main>
      {/* ── Hero ───────────────────────── */}
      <section className={styles.hero}>
        <Image src="/image/Bg.svg" alt="" fill priority sizes="100vw" className={styles.heroBg} draggable={false} />
        <div className={styles.heroInner}>
          {/* 로고 이미지 */}
          <div className={styles.logoWrap}>
            <Image
              src="/image/img_logo.svg"
              alt="Docthru Logo"
              width={126}
              height={28.35}
              priority
              draggable={false}
            />
          </div>

          <h1 className={styles.title}>
            함께 번역하며 성장하는
            <br />
            개발자의 새로운 영어 습관
          </h1>
          {/* tonal | outline | transparent | solid | filled */}
          {/* CTA 버튼 */}
          <Button variant="outline" size="pill" onClick={() => router.push('/auth/login')}>
            번역 시작하기
          </Button>
        </div>
      </section>

      {/* ── Features ───────────────────── */}
      <section className={styles.features}>
        {/* 1 */}
        <div className={styles.feature}>
          <div className={styles.text}>
            <img src="/icons/trophy.svg" alt="" className={styles.icon} draggable={false} />
            <h3>
              혼자서는 막막했던 번역,
              <br />
              챌린지로 함께 완성하기
            </h3>
            <p>
              중요한 건 꺾이지 않는 마음! 동료들과 함께
              <br />
              기술 문서를 번역해 보세요.
            </p>
          </div>
          <div className={styles.image}>
            <img src="/image/card1.png" alt="번역 리스트 카드" width={570} height={411} draggable={false} />
          </div>
        </div>

        <div className={styles.divider} />

        {/* 2 */}
        <div className={styles.feature}>
          <div className={styles.text}>
            <img src="/icons/heart.svg" alt="" className={styles.icon} draggable={false} />
            <h3>
              내가 좋아하는 기술 번역,
              <br />
              내가 필요한 기술 번역
            </h3>
            <p>
              이미 진행 중인 번역 챌린지에 참여하거나,
              <br />
              새로운 번역 챌린지를 시작해 보세요.
            </p>
          </div>
          <div className={styles.image}>
            <img src="/image/card2.png" alt="기술/미션 UI" className={styles.card} draggable={false} />
          </div>
        </div>

        <div className={styles.divider} />

        {/* 3 */}
        <div className={styles.feature}>
          <div className={styles.text}>
            <img src="/icons/message.svg" alt="" className={styles.icon} draggable={false} />
            <h3>피드백으로 함께 성장하기</h3>
            <p>
              번역 작업물에 대해 피드백을 주고 받으며
              <br />
              영어 실력은 물론, 개발 실력까지 키워 보세요
            </p>
          </div>
          <div className={styles.image}>
            <img src="/image/card3.png" alt="피드백 UI" className={styles.card} draggable={false} />
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────── */}
      <section className={styles.finalCTA}>
        <h2>함께 번역하고 성장하세요!</h2>
        <Button variant="solid" size="lg" onClick={() => router.push('/user/challenge')}>
          번역 시작하기
        </Button>
      </section>
    </main>
  );
}
