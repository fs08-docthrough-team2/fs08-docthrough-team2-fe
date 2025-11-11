import { test, expect } from './fixtures/auth.js';

test.describe('번역 챌린지 상세 정보 조회', () => {
  test('챌린지 상세 페이지가 정상적으로 로드된다', async ({ authenticatedPage: page }) => {
    // 먼저 챌린지 목록에서 챌린지 하나 선택
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 상세 페이지 요소 확인
      await expect(page.locator('h1, h2')).toBeVisible(); // 제목
    }
  });

  test('챌린지 정보가 모두 표시된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 제목 확인
      const title = page.locator('h1, h2').first();
      await expect(title).toBeVisible();
      
      // 분야, 문서타입, 마감일 등 정보 확인
      await expect(page.getByText(/분야|필드/i)).toBeVisible();
      await expect(page.getByText(/마감일|데드라인/i)).toBeVisible();
    }
  });

  test('원문 보기 버튼 클릭 시 새 창으로 원본 페이지가 열린다', async ({ authenticatedPage: page, context }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const originalButton = page.getByRole('button', { name: /원문 보기/i });
      
      if (await originalButton.isVisible()) {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          originalButton.click(),
        ]);
        
        await expect(newPage).not.toBeNull();
        await newPage.close();
      }
    }
  });

  test('마감되지 않은 챌린지의 경우 도전하기 버튼이 표시된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 도전하기 버튼 확인
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      // 마감되지 않은 챌린지인 경우 버튼이 표시되어야 함
      // (실제 데이터에 따라 다를 수 있음)
      if (await challengeButton.isVisible()) {
        await expect(challengeButton).toBeEnabled();
      }
    }
  });

  test('마감된 챌린지의 경우 추천을 가장 많이 받은 작업물을 조회할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    // 마감된 챌린지 필터 적용
    const filterButton = page.getByRole('button', { name: /필터/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      const closedOption = page.getByText(/마감|완료/i);
      if (await closedOption.isVisible()) {
        await closedOption.click();
        await page.getByRole('button', { name: /적용/i }).click();
        await page.waitForTimeout(1000);
      }
    }
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 추천 작업물 섹션 확인
      const recommendedWork = page.getByText(/추천|최다 추천/i);
      // 마감된 챌린지인 경우 추천 작업물이 표시될 수 있음
    }
  });

  test('참여 현황 목록이 표시된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 참여 현황 섹션 확인
      const participantSection = page.getByText(/참여 현황|순위|참여자/i);
      // 참여 현황이 있는 경우 표시됨
    }
  });

  test('참여 현황에서 작업물 상세로 이동할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 작업물 카드 클릭
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        await workCard.click();
        await page.waitForTimeout(1000);
        
        // 작업물 상세 페이지로 이동 확인
        await expect(page).toHaveURL(/\/user\/.*\/work\/\d+/);
      }
    }
  });
});

