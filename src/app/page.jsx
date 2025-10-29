'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/pages/LandingPage.module.scss';

export default function LandingPage() {
  return (
    <main>
      {/* ── Hero ───────────────────────── */}
      <section className="hero">
        <Image
          src="/image/Bg.svg" // public/image/Bg.svg
          alt=""
          fill
          priority
          sizes="100vw"
          className="heroBg"
        />
        <div className="heroInner">
          <div className="kicker">• Docthru</div>
          <h1 className="title">
            함께 번역하며 성장하는
            <br />
            개발자의 새로운 영어 습관
          </h1>
          <Link href="/signup" className="cta">
            <Image src="/image/img_logo.svg" alt="Docthru Logo" width={18} height={18} />
            번역 시작하기
          </Link>
        </div>
      </section>

      {/* ── Features ───────────────────── */}
      <section className="features">
        {/* 1 */}
        <div className="feature">
          <div className="text">
            <img src="/icons/trophy.svg" alt="" className="icon" />
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
          <div className="image">
            <img src="/image/card1.svg" alt="번역 리스트 카드" />
          </div>
        </div>

        <div className="divider" />

        {/* 2 */}
        <div className="feature">
          <div className="text">
            <img src="/icons/heart.svg" alt="" className="icon" />
            <h3>
              내가 좋아하는 기술 번역,
              <br />
              내가 필요한 기술 번역
            </h3>
            <p>이미 진행 중인 번역 챌린지에 참여하거나,</p>
            <p>새로운 번역 챌린지를 시작해 보세요.</p>
          </div>
          <div className="image">
            <img src="/image/card2.svg" alt="기술/미션 UI" />
          </div>
        </div>

        <div className="divider" />

        {/* 3 */}
        <div className="feature">
          <div className="text">
            <img src="/icons/message.svg" alt="" className="icon" />
            <h3>번역 작업물에 대해 피드백을 주고 받으며</h3>
            <p>영어 실력은 물론, 개발 시력까지 키워 보세요</p>
          </div>
          <div className="image">
            <img src="/image/card3.svg" alt="피드백 UI" />
          </div>
        </div>
      </section>

      <section className="finalCTA">
        <h2>함께 번역하고 성장하세요!</h2>
        <Link href="/signup" className={styles.finalButtons}>
          번역 시작하기
        </Link>
      </section>

      {/* ── Styles ─────────────────────── */}
      <style jsx>{`
        .hero {
          position: relative;
          width: 100%;
          height: 260px;
          background: #1f1f1f;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .heroBg {
          object-fit: cover;
          opacity: 0.35;
          z-index: 0;
        }
        .heroInner {
          position: relative;
          z-index: 1;
          text-align: center;
          color: #f5f5f5;
        }
        .kicker {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        .title {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          line-height: 1.25;
        }
        .cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          padding: 10px 16px;
          border-radius: 999px;
          background: #fff;
          color: #1f1f1f;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .features {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 80px;
          padding: 100px 16px;
          box-sizing: border-box;
        }
        .feature {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }
        .text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .text h3 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          line-height: 1.4;
          color: #414141;
        }
        .text p {
          margin: 0;
          font-size: 15px;
          color: #555;
          line-height: 1.6;
        }
        .icon {
          width: 20px;
          height: 20px;
          margin-bottom: 6px;
        }
        .image {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .image img {
          width: 100%;
          max-width: 480px;
          height: auto;
          display: block;
        }
        .divider {
          width: 100%;
          border-bottom: 1px dashed #ddd;
        }

        .finalCTA {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 120px 16px;
          background: #fff;
          color: #414141;
        }

        .finalCTA h2 {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }

        .finalButton {
          display: inline-flex;
          padding: 10px 22px;
          background: #222;
          color: #fff;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 744px) {
          .hero {
            height: 220px;
          }
          .title {
            font-size: 24px;
          }
          .features {
            max-width: 744px;
            gap: 64px;
            padding: 72px 16px;
          }
          .feature {
            gap: 32px;
          }
          .image img {
            max-width: 420px;
          }
        }
        @media (max-width: 480px) {
          .hero {
            height: 190px;
          }
          .title {
            font-size: 20px;
          }
          .cta {
            padding: 8px 14px;
            font-size: 13px;
          }
          .features {
            max-width: 100%;
            gap: 48px;
            padding: 56px 16px;
          }
          .feature {
            flex-direction: column;
            text-align: left;
          }
          .image img {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
