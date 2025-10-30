'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/pages/LandingPage.module.scss';
import Button from '@/components/atoms/Button/Button.jsx';
export default function LandingPage() {
  return (
    <main>
      {/* ── Hero ───────────────────────── */}
      <section className={styles.hero}>
        <Image src="/image/Bg.svg" alt="" fill priority sizes="100vw" className={styles.heroBg} />
        <div className={styles.heroInner}>
          <div className={styles.kicker}>• Docthru</div>
          <h1 className={styles.title}>
            함께 번역하며 성장하는
            <br />
            개발자의 새로운 영어 습관
          </h1>
          <Button variant="outline" size="pill"  onClick={() => router.push('/signup')}>
            번역 시작하기
          </Button>
        </div>
      </section>

      {/* ── Features ───────────────────── */}
      <section className={styles.features}>
        {/* 1 */}
        <div className={styles.feature}>
          <div className={styles.text}>
            <img src="/icons/trophy.svg" alt="" className={styles.icon} />
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
            <img src="/image/card1.svg" alt="번역 리스트 카드" />
          </div>
        </div>

        <div className={styles.divider} />

        {/* 2 */}
        <div className={styles.feature}>
          <div className={styles.text}>
            <img src="/icons/heart.svg" alt="" className={styles.icon} />
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
            <img src="/image/card2.svg" alt="기술/미션 UI" />
          </div>
        </div>

        <div className={styles.divider} />

        {/* 3 */}
        <div className={styles.feature}>
          <div className={styles.text}>
            <img src="/icons/message.svg" alt="" className={styles.icon} />
            <h3>피드백으로 함께 성장기</h3>
            <p>
              번역 작업물에 대해 피드백을 주고 받으며
              <br />
              영어 실력은 물론,개발 실력까지 키워 보세요
            </p>
          </div>
          <div className={styles.image}>
            <img src="/image/card3.svg" alt="피드백 UI" />
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────── */}
      <section className={styles.finalCTA}>
        <h2>함께 번역하고 성장하세요!</h2>
        <Link href="/signup" className={styles.finalButtons}>
          번역 시작하기
        </Link>
      </section>
    </main>
  );
}
