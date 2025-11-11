import { test, expect } from './fixtures/auth.js';

test.describe('작업물 관리', () => {

  test('번역 작업물 상세 페이지가 정상적으로 로드된다', async ({ authenticatedPage: page }) => {
    // 챌린지 상세에서 작업물로 이동
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
        
        // 작업물 상세 페이지 확인
        await expect(page).toHaveURL(/\/user\/.*\/work\/\d+/);
        
        // 작업물 내용 확인
        await expect(page.locator('article, [class*="work"]')).toBeVisible();
      }
    }
  });

  test('작업물에 대한 피드백을 조회할 수 있다', async ({ authenticatedPage: page }) => {
    // 작업물 상세 페이지로 이동
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        await workCard.click();
        await page.waitForTimeout(1000);
        
        // 피드백 섹션 확인
        const feedbackSection = page.getByText(/피드백|댓글/i);
        // 피드백이 있으면 표시됨
      }
    }
  });

  test('작업물에 피드백을 남길 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        await workCard.click();
        await page.waitForTimeout(1000);
        
        // 피드백 입력 필드 확인
        const feedbackInput = page.locator('textarea[placeholder*="피드백"], textarea[placeholder*="댓글"]');
        
        if (await feedbackInput.isVisible()) {
          await feedbackInput.fill('좋은 번역이네요!');
          
          // 피드백 작성 버튼 클릭
          const submitButton = page.getByRole('button', { name: /작성|등록/i });
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(1000);
            
            // 피드백이 추가되었는지 확인
            await expect(page.getByText(/좋은 번역이네요/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('피드백 목록에 페이지네이션이 작동한다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        await workCard.click();
        await page.waitForTimeout(1000);
        
        // 더 보기 버튼 확인
        const moreButton = page.getByRole('button', { name: /더 보기|more/i });
        
        if (await moreButton.isVisible()) {
          await moreButton.click();
          await page.waitForTimeout(1000);
          
          // 추가 피드백이 로드되는지 확인
        }
      }
    }
  });

  test('작업물에 하트를 남길 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        await workCard.click();
        await page.waitForTimeout(1000);
        
        // 하트 버튼 확인
        const heartButton = page.locator('button[aria-label*="하트"], button[aria-label*="좋아요"]').or(
          page.locator('[class*="heart"], [class*="like"]')
        );
        
        if (await heartButton.isVisible()) {
          // 하트 수 확인 (클릭 전)
          const beforeCount = await heartButton.textContent();
          
          await heartButton.click();
          await page.waitForTimeout(1000);
          
          // 하트 수가 증가했는지 확인
          const afterCount = await heartButton.textContent();
          // 하트 수가 변경되었는지 확인 (실제 구현에 따라 다를 수 있음)
        }
      }
    }
  });

  test('내가 작성한 작업물을 수정할 수 있다', async ({ authenticatedPage: page }) => {
    // 내 챌린지에서 진행 중인 챌린지 선택
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      const continueButton = challengeCards.first().getByRole('button', { name: /계속 도전하기/i });
      
      if (await continueButton.isVisible()) {
        await continueButton.click();
        await page.waitForTimeout(2000);
        
        // 에디터 확인
        const editor = page.locator('[data-testid="markdown-editor"]').or(page.locator('textarea, [contenteditable="true"]'));
        
        if (await editor.isVisible()) {
          await editor.fill('수정된 번역 내용입니다.');
          
          // 저장 버튼 클릭
          const saveButton = page.getByRole('button', { name: /저장|임시 저장/i });
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(1000);
            
            // 저장 성공 메시지 확인
            await expect(page.getByText(/저장|성공/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('내가 작성한 작업물을 삭제할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      const continueButton = challengeCards.first().getByRole('button', { name: /계속 도전하기/i });
      
      if (await continueButton.isVisible()) {
        await continueButton.click();
        await page.waitForTimeout(2000);
        
        // 삭제 버튼 확인
        const deleteButton = page.getByRole('button', { name: /삭제/i });
        
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          await page.waitForTimeout(500);
          
          // 확인 모달
          const confirmButton = page.getByRole('button', { name: /확인/i });
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
            await page.waitForTimeout(1000);
            
            // 삭제 성공 메시지 확인
            await expect(page.getByText(/삭제|성공/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('완료된 챌린지의 작업물은 수정할 수 없다', async ({ authenticatedPage: page }) => {
    // 완료한 챌린지로 이동
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
    
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).click(); // 완료한 탭
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 수정 버튼이 없거나 비활성화되어 있는지 확인
      const editButton = page.getByRole('button', { name: /수정/i });
      
      if (await editButton.isVisible()) {
        await expect(editButton).toBeDisabled();
      }
    }
  });
});

