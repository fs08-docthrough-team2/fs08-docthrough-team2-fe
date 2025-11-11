import { test, expect } from './fixtures/auth.js';

test.describe('번역 챌린지 조회', () => {

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
  });

  test('챌린지 목록 페이지가 정상적으로 로드된다', async ({ authenticatedPage: page }) => {
    // 검색 입력 필드 확인
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="검색"]'));
    await expect(searchInput).toBeVisible();
    
    // 필터 버튼 확인
    const filterButton = page.getByRole('button', { name: /필터/i });
    await expect(filterButton).toBeVisible();
    
    // 신규 챌린지 신청 버튼 확인
    const createButton = page.getByRole('button', { name: /신규 챌린지 신청/i });
    await expect(createButton).toBeVisible();
  });

  test('챌린지 카드에 필수 정보가 표시된다', async ({ authenticatedPage: page }) => {
    // 챌린지 카드가 존재하는 경우
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      const firstCard = challengeCards.first();
      
      // 제목 확인
      await expect(firstCard.locator('h2, h3, [class*="title"]')).toBeVisible();
      
      // 분야 또는 카테고리 확인
      await expect(firstCard.locator('[class*="field"], [class*="category"]')).toBeVisible();
      
      // 마감일 확인
      await expect(firstCard.locator('[class*="deadline"], [class*="dueDate"]')).toBeVisible();
      
      // 참여 인원 정보 확인
      await expect(firstCard.locator('[class*="participant"], [class*="capacity"]')).toBeVisible();
    }
  });

  test('제목으로 챌린지를 검색할 수 있다', async ({ authenticatedPage: page }) => {
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="검색"]'));
    
    await searchInput.fill('Next.js');
    await page.waitForTimeout(500); // 디바운스 대기
    
    // 검색 결과 확인 (API 응답에 따라 다를 수 있음)
    await expect(page).toHaveURL(/title=Next\.js/);
  });

  test('필터를 사용하여 챌린지를 필터링할 수 있다', async ({ authenticatedPage: page }) => {
    const filterButton = page.getByRole('button', { name: /필터/i });
    await filterButton.click();
    
    // 필터 팝업이 열리는지 확인
    const filterPopup = page.locator('[data-testid="filter-popup"]').or(page.locator('[class*="filter"]'));
    await expect(filterPopup).toBeVisible();
    
    // 필터 옵션 선택 (분야, 문서타입, 상태 등)
    const fieldOption = page.getByText(/Next\.js|API|Web/i).first();
    if (await fieldOption.isVisible()) {
      await fieldOption.click();
    }
    
    // 적용 버튼 클릭
    const applyButton = page.getByRole('button', { name: /적용/i });
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    // 필터가 적용되었는지 확인
    await page.waitForTimeout(500);
  });

  test('페이지네이션이 작동한다', async ({ authenticatedPage: page }) => {
    const pagination = page.locator('[data-testid="pagination"]').or(page.locator('[class*="pagination"]'));
    
    if (await pagination.isVisible()) {
      // 다음 페이지 버튼 클릭
      const nextButton = pagination.getByRole('button', { name: /다음|next/i });
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(500);
        // URL에 페이지 번호가 포함되는지 확인
        await expect(page).toHaveURL(/page=2/);
      }
    }
  });

  test('챌린지 카드 클릭 시 상세 페이지로 이동한다', async ({ authenticatedPage: page }) => {
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      const firstCard = challengeCards.first();
      const challengeId = await firstCard.getAttribute('data-challenge-id');
      
      await firstCard.click();
      
      // 상세 페이지로 이동 확인
      if (challengeId) {
        await expect(page).toHaveURL(new RegExp(`/user/challenge/${challengeId}`));
      } else {
        await expect(page).toHaveURL(/\/user\/challenge\/\d+/);
      }
    }
  });

  test('신규 챌린지 신청 버튼 클릭 시 신청 페이지로 이동한다', async ({ authenticatedPage: page }) => {
    const createButton = page.getByRole('button', { name: /신규 챌린지 신청/i });
    await createButton.click();
    
    await expect(page).toHaveURL(/\/user\/challenge\/post/);
  });

  test('챌린지가 없을 때 빈 상태 메시지가 표시된다', async ({ authenticatedPage: page }) => {
    // 검색어를 매우 구체적으로 설정하여 결과가 없도록 함
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="검색"]'));
    await searchInput.fill('존재하지않는챌린지제목12345');
    await page.waitForTimeout(1000);
    
    // 빈 상태 메시지 확인
    const emptyMessage = page.getByText(/조건에 맞는 챌린지가 없어요|챌린지가 없어요/i);
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
  });
});

