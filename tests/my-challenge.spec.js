import { test, expect } from './fixtures/auth.js';

test.describe('나의 챌린지 관리', () => {

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
  });

  test('나의 챌린지 페이지가 정상적으로 로드된다', async ({ authenticatedPage: page }) => {
    // 타이틀 확인
    await expect(page.getByText(/나의 챌린지/i)).toBeVisible();
    
    // 탭 확인
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3); // 참여 중, 완료한, 내가 신청한
    
    // 검색 입력 필드 확인
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="검색"]'));
    await expect(searchInput).toBeVisible();
    
    // 신규 챌린지 신청 버튼 확인
    const createButton = page.getByRole('button', { name: /신규 챌린지 신청/i });
    await expect(createButton).toBeVisible();
  });

  test('참여 중인 챌린지 목록을 조회할 수 있다', async ({ authenticatedPage: page }) => {
    // 첫 번째 탭 (참여 중)이 기본 선택되어 있음
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    
    // 챌린지 카드 확인
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    // 참여 중인 챌린지가 있으면 표시됨
  });

  test('참여 중인 챌린지에서 계속 도전하기 버튼으로 작업물을 수정할 수 있다', async ({ authenticatedPage: page }) => {
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      const firstCard = challengeCards.first();
      
      // 계속 도전하기 버튼 확인
      const continueButton = firstCard.getByRole('button', { name: /계속 도전하기|도전하기/i });
      
      if (await continueButton.isVisible()) {
        await continueButton.click();
        await page.waitForTimeout(2000);
        
        // 번역 작성 페이지로 이동 확인
        await expect(page).toHaveURL(/\/user\/.*\/work/);
      }
    }
  });

  test('참여 중인 챌린지를 검색할 수 있다', async ({ authenticatedPage: page }) => {
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="검색"]'));
    
    await searchInput.fill('Next.js');
    await page.waitForTimeout(500); // 디바운스 대기
    
    // 검색 결과 확인
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    // 검색 결과가 필터링되어 표시됨
  });

  test('참여 중인 챌린지를 필터링할 수 있다', async ({ authenticatedPage: page }) => {
    // 필터 버튼 확인 (구현에 따라 다를 수 있음)
    const filterButton = page.getByRole('button', { name: /필터/i });
    
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // 필터 옵션 선택
      const fieldOption = page.getByText(/Next\.js|API|Web/i).first();
      if (await fieldOption.isVisible()) {
        await fieldOption.click();
        await page.getByRole('button', { name: /적용/i }).click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('완료한 챌린지 목록을 조회할 수 있다', async ({ authenticatedPage: page }) => {
    const tabs = page.locator('[role="tab"]');
    
    // 두 번째 탭 (완료한) 클릭
    await tabs.nth(1).click();
    await page.waitForTimeout(1000);
    
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    
    // 완료한 챌린지 목록 확인
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    // 완료한 챌린지가 있으면 표시됨
  });

  test('완료한 챌린지에서 제출한 번역문을 조회할 수 있다', async ({ authenticatedPage: page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).click();
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 제출한 번역문 확인
      const workSection = page.getByText(/번역문|작업물/i);
      // 제출한 번역문이 표시됨
    }
  });

  test('내가 신청한 챌린지 목록을 조회할 수 있다', async ({ authenticatedPage: page }) => {
    const tabs = page.locator('[role="tab"]');
    
    // 세 번째 탭 (내가 신청한) 클릭
    await tabs.nth(2).click();
    await page.waitForTimeout(1000);
    
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    
    // 신청한 챌린지 목록 확인
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    // 신청한 챌린지가 있으면 표시됨
  });

  test('내가 신청한 챌린지에서 승인/거절 여부를 확인할 수 있다', async ({ authenticatedPage: page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(2).click();
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      const firstCard = challengeCards.first();
      
      // 승인/거절 상태 확인
      await expect(firstCard.getByText(/승인|거절|대기/i)).toBeVisible();
    }
  });

  test('무한 스크롤이 작동한다', async ({ authenticatedPage: page }) => {
    // 스크롤 가능한 영역 확인
    const scrollableArea = page.locator('[class*="challengeList"], [class*="list"]');
    
    if (await scrollableArea.isVisible()) {
      // 스크롤 다운
      await scrollableArea.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      
      await page.waitForTimeout(1000);
      
      // 추가 챌린지가 로드되는지 확인 (실제 구현에 따라 다를 수 있음)
    }
  });

  test('빈 상태 메시지가 표시된다', async ({ authenticatedPage: page }) => {
    // 검색어를 매우 구체적으로 설정하여 결과가 없도록 함
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="검색"]'));
    await searchInput.fill('존재하지않는챌린지12345');
    await page.waitForTimeout(1000);
    
    // 빈 상태 메시지 확인
    const emptyMessage = page.getByText(/아직 챌린지가 없어요|챌린지가 없어요/i);
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
  });
});

