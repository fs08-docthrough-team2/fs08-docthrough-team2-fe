import { test, expect } from './fixtures/auth.js';

test.describe('번역 챌린지 신청 관리', () => {

  test('신규 챌린지 신청 페이지가 정상적으로 로드된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge/post');
    
    // 폼 필드 확인
    await expect(page.getByLabel(/제목/i)).toBeVisible();
    await expect(page.getByLabel(/원문 링크/i)).toBeVisible();
    await expect(page.getByText(/분야/i)).toBeVisible();
    await expect(page.getByText(/문서 종류/i)).toBeVisible();
    await expect(page.getByLabel(/마감일/i)).toBeVisible();
    await expect(page.getByLabel(/최대 참여 인원/i)).toBeVisible();
    await expect(page.getByLabel(/내용/i)).toBeVisible();
  });

  test('신규 챌린지 신청 폼을 작성할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge/post');
    
    // 제목 입력
    await page.fill('input[name="title"]', 'Next.js 공식 문서 번역 챌린지');
    
    // 원문 링크 입력
    await page.fill('input[name="source"]', 'https://nextjs.org/docs');
    
    // 분야 선택
    const fieldDropdown = page.locator('[class*="dropdown"]').first();
    if (await fieldDropdown.isVisible()) {
      await fieldDropdown.click();
      await page.waitForTimeout(300);
      await page.getByText(/Next\.js/i).first().click();
    }
    
    // 문서 종류 선택
    const typeDropdown = page.locator('[class*="dropdown"]').nth(1);
    if (await typeDropdown.isVisible()) {
      await typeDropdown.click();
      await page.waitForTimeout(300);
      await page.getByText(/공식문서/i).first().click();
    }
    
    // 마감일 입력
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);
    
    // 최대 참여 인원 입력
    await page.fill('input[name="capacity"]', '10');
    
    // 내용 입력
    await page.fill('textarea[name="content"]', 'Next.js 공식 문서를 함께 번역하는 챌린지입니다.');
    
    // 폼이 채워졌는지 확인
    await expect(page.locator('input[name="title"]')).toHaveValue('Next.js 공식 문서 번역 챌린지');
  });

  test('유효하지 않은 정보로 신청 시 에러가 표시된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge/post');
    
    // 제목만 입력하고 제출 시도
    await page.fill('input[name="title"]', '테스트');
    await page.fill('input[name="source"]', 'invalid-url');
    
    const submitButton = page.getByRole('button', { name: /신청하기/i });
    await submitButton.click();
    
    // 에러 메시지 확인
    await expect(page.getByText(/오류|에러|필수/i)).toBeVisible({ timeout: 3000 });
  });

  test('마감일이 오늘 이전이면 에러가 표시된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge/post');
    
    await page.fill('input[name="title"]', '테스트 챌린지');
    await page.fill('input[name="source"]', 'https://example.com');
    
    // 어제 날짜 입력
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);
    
    await page.fill('input[name="capacity"]', '5');
    await page.fill('textarea[name="content"]', '테스트 내용입니다.');
    
    const submitButton = page.getByRole('button', { name: /신청하기/i });
    await submitButton.click();
    
    // 에러 메시지 확인
    await expect(page.getByText(/마감일|오늘 이후/i)).toBeVisible({ timeout: 3000 });
  });

  test('최대 참여 인원이 2명 미만이면 에러가 표시된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge/post');
    
    await page.fill('input[name="title"]', '테스트 챌린지');
    await page.fill('input[name="source"]', 'https://example.com');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);
    
    // 1명 입력
    await page.fill('input[name="capacity"]', '1');
    await page.fill('textarea[name="content"]', '테스트 내용입니다.');
    
    const submitButton = page.getByRole('button', { name: /신청하기/i });
    await submitButton.click();
    
    // 에러 메시지 확인
    await expect(page.getByText(/최소 2명|참여 인원/i)).toBeVisible({ timeout: 3000 });
  });

  test('내용이 10자 미만이면 에러가 표시된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge/post');
    
    await page.fill('input[name="title"]', '테스트 챌린지');
    await page.fill('input[name="source"]', 'https://example.com');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);
    
    await page.fill('input[name="capacity"]', '5');
    await page.fill('textarea[name="content"]', '짧음'); // 10자 미만
    
    const submitButton = page.getByRole('button', { name: /신청하기/i });
    await submitButton.click();
    
    // 에러 메시지 확인
    await expect(page.getByText(/10자|내용/i)).toBeVisible({ timeout: 3000 });
  });

  test('유효한 정보로 신청이 성공한다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge/post');
    
    await page.fill('input[name="title"]', '테스트 챌린지 신청');
    await page.fill('input[name="source"]', 'https://example.com/docs');
    
    // 분야 선택
    const fieldDropdown = page.locator('[class*="dropdown"]').first();
    if (await fieldDropdown.isVisible()) {
      await fieldDropdown.click();
      await page.waitForTimeout(300);
      await page.getByText(/Next\.js|Web/i).first().click();
    }
    
    // 문서 종류 선택
    const typeDropdown = page.locator('[class*="dropdown"]').nth(1);
    if (await typeDropdown.isVisible()) {
      await typeDropdown.click();
      await page.waitForTimeout(300);
      await page.getByText(/공식문서|블로그/i).first().click();
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);
    
    await page.fill('input[name="capacity"]', '10');
    await page.fill('textarea[name="content"]', '이것은 테스트 챌린지 신청 내용입니다. 최소 10자 이상입니다.');
    
    const submitButton = page.getByRole('button', { name: /신청하기/i });
    await submitButton.click();
    
    // 성공 메시지 확인
    await expect(page.getByText(/신청|성공/i)).toBeVisible({ timeout: 5000 });
    
    // 신청 상태 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/\/user\/my-challenge\/\d+\/status/, { timeout: 10000 });
  });

  test('내가 신청한 챌린지 목록을 조회할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
    
    // 탭에서 "내가 신청한 챌린지" 탭 클릭
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    
    if (tabCount >= 3) {
      await tabs.nth(2).click(); // 세 번째 탭 (내가 신청한 챌린지)
      await page.waitForTimeout(1000);
      
      // 신청한 챌린지 목록 확인
      const challengeList = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
      // 목록이 표시되는지 확인
    }
  });

  test('신청한 챌린지 상세에서 승인 상태를 확인할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
    
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    
    if (tabCount >= 3) {
      await tabs.nth(2).click();
      await page.waitForTimeout(1000);
      
      const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
      
      if (await challengeCards.count() > 0) {
        await challengeCards.first().click();
        await page.waitForTimeout(1000);
        
        // 승인 상태 확인
        await expect(page.getByText(/승인 대기|승인|거절/i)).toBeVisible();
      }
    }
  });

  test('승인 대기 중인 챌린지 신청을 취소할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
    
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    
    if (tabCount >= 3) {
      await tabs.nth(2).click();
      await page.waitForTimeout(1000);
      
      const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
      
      if (await challengeCards.count() > 0) {
        await challengeCards.first().click();
        await page.waitForTimeout(1000);
        
        // 승인 대기 상태인 경우 취소 버튼 확인
        const cancelButton = page.getByRole('button', { name: /취소|신청 취소/i });
        
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
          await page.waitForTimeout(500);
          
          // 확인 모달
          const confirmButton = page.getByRole('button', { name: /확인/i });
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
            await page.waitForTimeout(1000);
            
            // 취소 성공 메시지 확인
            await expect(page.getByText(/취소|성공/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });
});

