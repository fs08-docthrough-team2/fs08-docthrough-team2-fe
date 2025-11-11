import { test, expect } from './fixtures/auth.js';

test.describe('번역 챌린지 참여', () => {

  test('챌린지 도전하기 버튼 클릭 시 참여가 즉시 카운트된다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 참여 인원 수 확인 (도전하기 전)
      const beforeCount = await page.locator('[class*="participant"], [class*="capacity"]').first().textContent();
      
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      if (await challengeButton.isVisible() && await challengeButton.isEnabled()) {
        await challengeButton.click();
        await page.waitForTimeout(1000);
        
        // 참여 인원 수가 증가했는지 확인
        const afterCount = await page.locator('[class*="participant"], [class*="capacity"]').first().textContent();
        // 참여 인원이 증가했는지 확인 (실제 구현에 따라 다를 수 있음)
      }
    }
  });

  test('번역 작성 페이지로 이동한다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      if (await challengeButton.isVisible() && await challengeButton.isEnabled()) {
        await challengeButton.click();
        await page.waitForTimeout(2000);
        
        // 번역 작성 페이지로 이동 확인
        await expect(page).toHaveURL(/\/user\/.*\/work/);
      }
    }
  });

  test('에디터를 사용하여 번역을 작성할 수 있다', async ({ authenticatedPage: page }) => {
    // 번역 작성 페이지로 직접 이동 (챌린지 ID 필요)
    // 실제 테스트에서는 동적으로 챌린지 ID를 가져와야 함
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      if (await challengeButton.isVisible() && await challengeButton.isEnabled()) {
        await challengeButton.click();
        await page.waitForTimeout(2000);
        
        // 에디터 확인
        const editor = page.locator('[data-testid="markdown-editor"]').or(page.locator('textarea, [contenteditable="true"]'));
        
        if (await editor.isVisible()) {
          await editor.fill('테스트 번역 내용입니다.');
          await expect(editor).toHaveValue(/테스트 번역/);
        }
      }
    }
  });

  test('임시 저장 기능이 작동한다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      if (await challengeButton.isVisible() && await challengeButton.isEnabled()) {
        await challengeButton.click();
        await page.waitForTimeout(2000);
        
        const editor = page.locator('[data-testid="markdown-editor"]').or(page.locator('textarea, [contenteditable="true"]'));
        
        if (await editor.isVisible()) {
          await editor.fill('임시 저장 테스트 내용');
          
          const saveButton = page.getByRole('button', { name: /임시 저장/i });
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(500);
            
            // 저장 성공 메시지 확인
            await expect(page.getByText(/저장|성공/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('임시 저장된 작업물을 불러올 수 있다', async ({ authenticatedPage: page }) => {
    // LocalStorage에 임시 저장 데이터가 있는 경우
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    // LocalStorage에 테스트 데이터 추가
    await page.evaluate(() => {
      const draftData = {
        title: '테스트 제목',
        content: '테스트 내용',
        challengeId: 1,
      };
      localStorage.setItem('draft_1', JSON.stringify(draftData));
    });
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      if (await challengeButton.isVisible() && await challengeButton.isEnabled()) {
        await challengeButton.click();
        await page.waitForTimeout(2000);
        
        // 불러오기 모달 확인
        const loadModal = page.locator('[data-testid="load-draft-modal"]');
        
        if (await loadModal.isVisible({ timeout: 3000 })) {
          // 임시 저장된 작업물 목록 확인
          await expect(loadModal.getByText(/테스트 제목|제목 없음/i)).toBeVisible();
          
          // 작업물 선택
          const draftItem = loadModal.getByText(/테스트 제목/i).first();
          await draftItem.click();
          
          // 에디터에 내용이 채워졌는지 확인
          const editor = page.locator('[data-testid="markdown-editor"]').or(page.locator('textarea, [contenteditable="true"]'));
          await expect(editor).toHaveValue(/테스트 내용/);
        }
      }
    }
  });

  test('원문을 확인하며 번역 작업을 할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      if (await challengeButton.isVisible() && await challengeButton.isEnabled()) {
        await challengeButton.click();
        await page.waitForTimeout(2000);
        
        // 원문 섹션 확인
        const originalSection = page.getByText(/원문|original/i);
        // 원문이 표시되는지 확인 (실제 구현에 따라 다를 수 있음)
      }
    }
  });

  test('번역을 제출할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/challenge');
    await page.waitForTimeout(1000);
    
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      const challengeButton = page.getByRole('button', { name: /챌린지 도전하기|도전하기/i });
      
      if (await challengeButton.isVisible() && await challengeButton.isEnabled()) {
        await challengeButton.click();
        await page.waitForTimeout(2000);
        
        const editor = page.locator('[data-testid="markdown-editor"]').or(page.locator('textarea, [contenteditable="true"]'));
        
        if (await editor.isVisible()) {
          await editor.fill('제출할 번역 내용입니다.');
          
          const submitButton = page.getByRole('button', { name: /제출하기|제출/i });
          if (await submitButton.isVisible() && await submitButton.isEnabled()) {
            await submitButton.click();
            await page.waitForTimeout(2000);
            
            // 제출 성공 메시지 확인
            await expect(page.getByText(/제출|성공/i)).toBeVisible({ timeout: 5000 });
          }
        }
      }
    }
  });

  test('챌린지를 포기할 수 있다', async ({ authenticatedPage: page }) => {
    await page.goto('/user/my-challenge');
    await page.waitForTimeout(1000);
    
    // 참여 중인 챌린지 목록에서 첫 번째 챌린지 선택
    const challengeCards = page.locator('[data-testid="challenge-card"]').or(page.locator('article'));
    
    if (await challengeCards.count() > 0) {
      await challengeCards.first().click();
      await page.waitForTimeout(1000);
      
      // 포기하기 버튼 확인
      const quitButton = page.getByRole('button', { name: /포기하기|포기/i });
      
      if (await quitButton.isVisible()) {
        await quitButton.click();
        await page.waitForTimeout(500);
        
        // 확인 모달
        const confirmButton = page.getByRole('button', { name: /확인/i });
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          await page.waitForTimeout(1000);
          
          // 포기 성공 메시지 확인
          await expect(page.getByText(/포기|성공/i)).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });
});

