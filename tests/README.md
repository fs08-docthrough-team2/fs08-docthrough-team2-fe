# Playwright 테스트 가이드

이 디렉토리는 Docthrough 프로젝트의 E2E 테스트를 포함합니다. Playwright를 사용하여 작성되었습니다.

## 📁 폴더 구조

```
tests/
├── fixtures/           # 테스트 픽스처 (재사용 가능한 테스트 설정)
│   └── auth.js        # 인증 관련 픽스처 (로그인된 페이지)
├── helpers/           # 테스트 헬퍼 함수
│   ├── auth.js        # 로그인/로그아웃 헬퍼 함수
│   ├── api.js         # API 모킹 헬퍼 함수
│   └── selectors.js   # 공통 셀렉터 상수
├── landing.spec.js     # 랜딩 페이지 테스트
├── auth.spec.js       # 인증 테스트 (회원가입, 로그인, 로그아웃)
├── challenge-list.spec.js      # 챌린지 목록 조회 테스트
├── challenge-detail.spec.js    # 챌린지 상세 정보 조회 테스트
├── challenge-participate.spec.js # 챌린지 참여 테스트
├── challenge-apply.spec.js      # 챌린지 신청 관리 테스트
├── my-challenge.spec.js         # 나의 챌린지 관리 테스트
├── work.spec.js                 # 작업물 관리 테스트
└── admin.spec.js                # 어드민 기능 테스트
```

## 🚀 테스트 실행 방법

### 기본 명령어

```bash
# 모든 테스트 실행
npm test

# 또는
npx playwright test
```

### 다양한 실행 옵션

```bash
# UI 모드로 테스트 실행 (추천 - 시각적으로 테스트를 확인할 수 있음)
npm run test:ui

# 브라우저를 보면서 테스트 실행
npm run test:headed

# 디버그 모드 (테스트를 단계별로 실행)
npm run test:debug

# 테스트 리포트 보기
npm run test:report
```

### 특정 테스트만 실행

```bash
# 특정 테스트 파일만 실행
npx playwright test tests/auth.spec.js

# 특정 테스트 케이스만 실행
npx playwright test tests/auth.spec.js -g "로그인"

# 특정 브라우저만 실행
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### 필터링 옵션

```bash
# 태그로 필터링
npx playwright test --grep @smoke

# 제외할 테스트 지정
npx playwright test --grep-invert @slow
```

## 🛠️ 테스트 구조 설명

### 1. Fixtures (픽스처)

`fixtures/auth.js`는 인증된 상태의 페이지를 제공하는 재사용 가능한 픽스처입니다.

**사용 예시:**

```javascript
import { test, expect } from './fixtures/auth.js';

test('인증된 사용자만 접근 가능한 페이지', async ({ authenticatedPage: page }) => {
  // 이미 로그인된 상태의 page 객체 사용
  await page.goto('/user/challenge');
  // 테스트 코드...
});
```

**사용 가능한 픽스처:**
- `authenticatedPage`: 일반 유저로 로그인된 페이지
- `adminPage`: 어드민으로 로그인된 페이지
- `expertPage`: 전문가 유저로 로그인된 페이지

### 2. Helpers (헬퍼 함수)

#### `helpers/auth.js`
- `login(page, credentials)`: 로그인 수행
- `logout(page)`: 로그아웃 수행
- `testUsers`: 테스트용 사용자 자격증명 객체

**사용 예시:**

```javascript
import { login, testUsers } from '../helpers/auth.js';

test('로그인 테스트', async ({ page }) => {
  await login(page, testUsers.user);
  // 로그인 후 테스트...
});
```

#### `helpers/api.js`
- `mockApiResponse(page, url, response)`: API 응답 모킹
- `mockApiError(page, url, status, message)`: API 에러 응답 모킹
- `mockLogin(page, user)`: 로그인 API 모킹
- `mockChallenges(page, challenges)`: 챌린지 목록 API 모킹

**사용 예시:**

```javascript
import { mockApiResponse } from '../helpers/api.js';

test('API 모킹 테스트', async ({ page }) => {
  await mockApiResponse(page, '**/challenge*', {
    data: { items: [], pagination: { page: 1, totalPages: 1 } }
  });
  // 모킹된 API로 테스트...
});
```

#### `helpers/selectors.js`
공통으로 사용되는 셀렉터 상수를 정의합니다.

**사용 예시:**

```javascript
import { selectors } from '../helpers/selectors.js';

const emailInput = page.locator(selectors.login.emailInput);
```

## 📝 테스트 파일별 설명

### `landing.spec.js`
- 랜딩 페이지 표시 확인
- 로그인하지 않은 사용자에게 랜딩 페이지 표시
- 로그인한 사용자는 자동 리다이렉트

### `auth.spec.js`
- 회원가입 기능 테스트
- 로그인 기능 테스트 (일반 유저, 어드민)
- 로그아웃 기능 테스트
- OAuth 로그인 버튼 확인

### `challenge-list.spec.js`
- 챌린지 목록 페이지 로드
- 챌린지 카드 정보 표시
- 검색 기능
- 필터 기능 (분야, 문서타입, 상태)
- 페이지네이션
- 챌린지 상세 페이지 이동

### `challenge-detail.spec.js`
- 챌린지 상세 정보 표시
- 원문 보기 기능 (새 창 열기)
- 도전하기 버튼 표시
- 마감된 챌린지의 추천 작업물 조회
- 참여 현황 목록

### `challenge-participate.spec.js`
- 챌린지 도전하기 (즉시 참여 카운트)
- 번역 작성 페이지 이동
- 에디터를 사용한 번역 작성
- 임시 저장 기능
- 임시 저장된 작업물 불러오기
- 원문 확인
- 번역 제출
- 챌린지 포기하기

### `challenge-apply.spec.js`
- 신규 챌린지 신청 페이지
- 폼 작성 및 유효성 검사
- 신청 성공/실패
- 내가 신청한 챌린지 목록 조회
- 승인 상태 확인
- 신청 취소

### `my-challenge.spec.js`
- 나의 챌린지 페이지
- 참여 중인 챌린지 목록
- 완료한 챌린지 목록
- 내가 신청한 챌린지 목록
- 검색 및 필터링
- 무한 스크롤
- 계속 도전하기 버튼

### `work.spec.js`
- 작업물 상세 페이지
- 피드백 조회 및 작성
- 피드백 페이지네이션
- 하트 기능
- 작업물 수정/삭제
- 완료된 챌린지의 작업물 수정 불가 확인

### `admin.spec.js`
- 어드민 페이지 로드
- 신청한 챌린지 목록 조회
- 챌린지 승인/거절
- 챌린지 수정/삭제
- 작업물 수정/삭제
- 피드백 수정/삭제
- 완료된 챌린지의 수정 불가 확인

## ⚙️ 설정

### 테스트 사용자 자격증명

`helpers/auth.js`의 `testUsers` 객체에서 테스트용 사용자 정보를 관리합니다:

```javascript
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    role: 'ADMIN',
  },
  user: {
    email: 'user@test.com',
    password: 'password123',
    role: 'USER',
  },
  expert: {
    email: 'expert@test.com',
    password: 'password123',
    role: 'USER',
    grade: 'EXPERT',
  },
};
```

**⚠️ 중요:** 실제 환경에 맞게 이메일과 비밀번호를 수정해야 합니다.

### Playwright 설정

`playwright.config.js`에서 다음 설정을 확인할 수 있습니다:

- **브라우저**: Chromium, Firefox, WebKit
- **타임아웃**: 30초
- **재시도**: CI 환경에서 2회, 로컬에서 1회
- **리포트**: HTML, List, JSON
- **웹서버**: 자동으로 `npm run dev` 실행

## 🐛 문제 해결

### 테스트가 실패하는 경우

1. **서버가 실행 중인지 확인**
   ```bash
   npm run dev
   ```

2. **브라우저가 설치되어 있는지 확인**
   ```bash
   npx playwright install
   ```

3. **테스트 사용자 계정이 실제로 존재하는지 확인**
   - `helpers/auth.js`의 `testUsers` 객체의 자격증명이 실제 데이터베이스에 존재해야 합니다.

4. **디버그 모드로 실행**
   ```bash
   npm run test:debug
   ```

### 특정 테스트만 실행하여 디버깅

```bash
# 특정 테스트 파일만 실행
npx playwright test tests/auth.spec.js --headed

# 특정 테스트 케이스만 실행
npx playwright test tests/auth.spec.js -g "로그인" --headed
```

## 📊 테스트 리포트

테스트 실행 후 다음 명령어로 리포트를 확인할 수 있습니다:

```bash
npm run test:report
```

또는 `test-results/` 폴더에서 HTML 리포트를 직접 열 수 있습니다.

## 🔄 CI/CD 통합

CI 환경에서는 다음 명령어를 사용하세요:

```bash
# CI 환경에서 테스트 실행
CI=true npm test
```

CI 환경에서는:
- 재시도 횟수가 2회로 증가
- 워커가 1개로 제한 (안정성 향상)
- 기존 서버를 재사용하지 않음

## 📚 추가 리소스

- [Playwright 공식 문서](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-test)

## 💡 팁

1. **UI 모드 사용**: `npm run test:ui`를 사용하면 테스트를 시각적으로 확인하고 디버깅하기 쉽습니다.

2. **헤드리스 모드**: 기본적으로 테스트는 헤드리스 모드로 실행됩니다. 브라우저를 보려면 `--headed` 플래그를 사용하세요.

3. **병렬 실행**: 기본적으로 테스트는 병렬로 실행됩니다. 순차 실행이 필요한 경우 `--workers=1`을 사용하세요.

4. **스크린샷/비디오**: 실패한 테스트의 스크린샷과 비디오는 자동으로 저장됩니다. `test-results/` 폴더에서 확인할 수 있습니다.

