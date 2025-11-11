# 📘 독스루 (Docthrough)

> **개발 문서 번역 챌린지 서비스**  
> 영어로 된 개발 문서를 함께 번역하고, 번역문에 대한 피드백을 주고받는 협업형 플랫폼

---

## 📖 프로젝트 소개

대다수의 개발 관련 콘텐츠는 영어로 작성되어 있습니다.  
이에 따라 영어에 익숙하지 않은 개발자들은 최신 기술을 습득하는 데 어려움을 겪고 있습니다.

**독스루(Docthrough)는**  
✅ 개발 관련 영어 문서를 함께 번역하고,  
✅ 번역문에 대해 피드백을 주고받으며,  
✅ 번역 실력을 성장시킬 수 있는 **번역 챌린지형 플랫폼**입니다.

- **프로젝트 기간**: 25.10.17 - 25.11.12 ( 27일 )

---

## ⚙️ 기술 스택

Frontend: Next.js (App Router), SCSS, Tanstack-Query
Backend: Express, Prisma ORM
Database: Postgresql,
Deploy: Vercel, Render, Neon DB

---

## 📂 폴더 구조

**FE**

```bash
src
├── app/                  # Next.js App Router
├── components/           # UI 컴포넌트
├── hooks/                # TanStack Query 훅
├── libs/
│   ├── api/              # Axios 인스턴스
│   └── utils/            # 유틸 함수
├── stores/               # Zustand 등 전역 상태
├── styles/               # SCSS Modules, 변수/믹스인
└── ...
```

**BE**

```bash
src
├── app/                  # Next.js App Router
├── components/           # UI 컴포넌트
├── hooks/                # TanStack Query 훅
├── libs/
│   ├── api/              # Axios 인스턴스
│   └── utils/            # 유틸 함수
├── stores/               # Zustand 등 전역 상태
├── styles/               # SCSS Modules, 변수/믹스인
└── ...
```

---

## 👥 팀 구성

| 이름                                | 역할                                           |
| ----------------------------------- | ---------------------------------------------- |
| 🧭 **신민준 (Team Lead / FE Lead)** | 프론트엔드 리드 · PM · 백엔드·프론트 배포 담당 |
| 💻 **장수인 (FE)**                  | 프론트엔드 개발                                |
| 🧩 **민기범 (FE)**                  | 프론트엔드 개발                                |
| ⚙️ **김동영 (BE Lead)**             | 백엔드 리드 · 백엔드 개발                      |
| 📡 **김연만 (BE)**                  | 백엔드 개발                                    |

---

## 🚀 배포

FE:
https://fs08-docthrough-team2-fe.vercel.app

BE (Swagger API Docs):
https://fs08-docthrough.onrender.com/api-docs

---

## 🏁 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/fs08-docthrough-team2/fs08-docthrough-team2-fe.git
cd fs08-docthrough-team2-fe
```

### 2. 환경 변수 설정

```bash
cp .example.env .env
```

`.example.env` 파일을 참고해 실제 환경 변수 값을 입력하세요.

### 3. 패키지 설치

```bash
npm install
```

---

© 2025 Docthrough Team 2
