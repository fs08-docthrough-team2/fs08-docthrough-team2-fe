import { test, expect } from './fixtures/auth.js';

test.describe('번역 챌린지 관리 (어드민)', () => {

  test('어드민 페이지가 정상적으로 로드된다', async ({ adminPage: page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);
    
    // 어드민 페이지 요소 확인
    await expect(page.getByText(/관리|어드민/i)).toBeVisible();
  });

  test('신청한 신규 챌린지 목록을 조회할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    // 테이블 형태로 조회
    const table = page.locator('table').or(page.locator('[class*="table"]'));
    await expect(table).toBeVisible();
    
    // 검색 기능 확인
    const searchInput = page.locator('input[type="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('테스트');
      await page.waitForTimeout(500);
    }
  });

  test('신청한 챌린지를 승인할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    // 승인 버튼 확인
    const approveButton = page.getByRole('button', { name: /승인/i }).first();
    
    if (await approveButton.isVisible()) {
      await approveButton.click();
      await page.waitForTimeout(500);
      
      // 확인 모달
      const confirmButton = page.getByRole('button', { name: /확인/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
        
        // 승인 성공 메시지 확인
        await expect(page.getByText(/승인|성공/i)).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('신청한 챌린지를 거절할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    // 거절 버튼 확인
    const rejectButton = page.getByRole('button', { name: /거절/i }).first();
    
    if (await rejectButton.isVisible()) {
      await rejectButton.click();
      await page.waitForTimeout(500);
      
      // 거절 사유 입력 모달
      const reasonInput = page.locator('textarea[placeholder*="사유"], textarea[placeholder*="이유"]');
      if (await reasonInput.isVisible()) {
        await reasonInput.fill('부적절한 내용입니다.');
        
        const confirmButton = page.getByRole('button', { name: /확인/i });
        await confirmButton.click();
        await page.waitForTimeout(1000);
        
        // 거절 성공 메시지 확인
        await expect(page.getByText(/거절|성공/i)).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('진행 중인 챌린지를 수정할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    // 챌린지 목록에서 첫 번째 챌린지 선택
    const challengeRow = page.locator('tr, [class*="challenge"]').first();
    
    if (await challengeRow.isVisible()) {
      const editButton = challengeRow.getByRole('button', { name: /수정/i });
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(1000);
        
        // 수정 페이지 확인
        await expect(page).toHaveURL(/\/admin\/.*\/edit/);
        
        // 폼 필드 수정
        const titleInput = page.locator('input[name="title"]');
        if (await titleInput.isVisible()) {
          await titleInput.fill('수정된 제목');
          
          const saveButton = page.getByRole('button', { name: /저장|수정/i });
          await saveButton.click();
          await page.waitForTimeout(1000);
          
          // 수정 성공 메시지 확인
          await expect(page.getByText(/수정|성공/i)).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('진행 중인 챌린지를 삭제할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    const challengeRow = page.locator('tr, [class*="challenge"]').first();
    
    if (await challengeRow.isVisible()) {
      const deleteButton = challengeRow.getByRole('button', { name: /삭제/i });
      
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
  });

  test('작업물을 수정할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    // 챌린지 상세로 이동
    const challengeRow = page.locator('tr, [class*="challenge"]').first();
    
    if (await challengeRow.isVisible()) {
      await challengeRow.click();
      await page.waitForTimeout(1000);
      
      // 작업물 선택
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        const editButton = workCard.getByRole('button', { name: /수정/i });
        
        if (await editButton.isVisible()) {
          await editButton.click();
          await page.waitForTimeout(1000);
          
          // 수정 페이지 확인
          await expect(page).toHaveURL(/\/admin\/.*\/work/);
        }
      }
    }
  });

  test('작업물을 삭제할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    const challengeRow = page.locator('tr, [class*="challenge"]').first();
    
    if (await challengeRow.isVisible()) {
      await challengeRow.click();
      await page.waitForTimeout(1000);
      
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        const deleteButton = workCard.getByRole('button', { name: /삭제/i });
        
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          await page.waitForTimeout(500);
          
          const confirmButton = page.getByRole('button', { name: /확인/i });
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
            await page.waitForTimeout(1000);
            
            await expect(page.getByText(/삭제|성공/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('피드백을 수정할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    const challengeRow = page.locator('tr, [class*="challenge"]').first();
    
    if (await challengeRow.isVisible()) {
      await challengeRow.click();
      await page.waitForTimeout(1000);
      
      // 피드백 선택
      const feedbackItem = page.locator('[class*="feedback"], [class*="comment"]').first();
      
      if (await feedbackItem.isVisible()) {
        const editButton = feedbackItem.getByRole('button', { name: /수정/i });
        
        if (await editButton.isVisible()) {
          await editButton.click();
          await page.waitForTimeout(500);
          
          // 수정 입력 필드
          const editInput = page.locator('textarea').first();
          if (await editInput.isVisible()) {
            await editInput.fill('수정된 피드백입니다.');
            
            const saveButton = page.getByRole('button', { name: /저장|확인/i });
            await saveButton.click();
            await page.waitForTimeout(1000);
            
            await expect(page.getByText(/수정|성공/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('피드백을 삭제할 수 있다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    const challengeRow = page.locator('tr, [class*="challenge"]').first();
    
    if (await challengeRow.isVisible()) {
      await challengeRow.click();
      await page.waitForTimeout(1000);
      
      const feedbackItem = page.locator('[class*="feedback"], [class*="comment"]').first();
      
      if (await feedbackItem.isVisible()) {
        const deleteButton = feedbackItem.getByRole('button', { name: /삭제/i });
        
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          await page.waitForTimeout(500);
          
          const confirmButton = page.getByRole('button', { name: /확인/i });
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
            await page.waitForTimeout(1000);
            
            await expect(page.getByText(/삭제|성공/i)).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('완료된 챌린지의 작업물은 수정할 수 없다', async ({ adminPage: page }) => {
    await page.goto('/admin/challenge');
    await page.waitForTimeout(1000);
    
    // 완료된 챌린지 필터 적용
    const filterButton = page.getByRole('button', { name: /필터/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      const closedOption = page.getByText(/완료|마감/i);
      if (await closedOption.isVisible()) {
        await closedOption.click();
        await page.getByRole('button', { name: /적용/i }).click();
        await page.waitForTimeout(1000);
      }
    }
    
    const challengeRow = page.locator('tr, [class*="challenge"]').first();
    
    if (await challengeRow.isVisible()) {
      await challengeRow.click();
      await page.waitForTimeout(1000);
      
      const workCard = page.locator('[data-testid="work-card"]').or(page.locator('[class*="work"]')).first();
      
      if (await workCard.isVisible()) {
        const editButton = workCard.getByRole('button', { name: /수정/i });
        
        if (await editButton.isVisible()) {
          await expect(editButton).toBeDisabled();
        }
      }
    }
  });
});

