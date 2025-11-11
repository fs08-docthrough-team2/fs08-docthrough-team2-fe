import { test, expect } from '@playwright/test';

test.describe('랜딩 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('로그인하지 않은 사용자에게 랜딩 페이지가 표시된다', async ({ page }) => {
    // 로고 확인
    await expect(page.locator('img[alt="Docthru Logo"]')).toBeVisible();
    
    // 메인 타이틀 확인
    await expect(page.getByText('함께 번역하며 성장하는')).toBeVisible();
    await expect(page.getByText('개발자의 새로운 영어 습관')).toBeVisible();
    
    // CTA 버튼 확인
    await expect(page.getByRole('button', { name: '번역 시작하기' })).toBeVisible();
  });

  test('랜딩 페이지의 주요 섹션이 모두 표시된다', async ({ page }) => {
    // Hero 섹션
    await expect(page.getByText('함께 번역하며 성장하는')).toBeVisible();
    
    // Features 섹션
    await expect(page.getByText('혼자서는 막막했던 번역')).toBeVisible();
    await expect(page.getByText('내가 좋아하는 기술 번역')).toBeVisible();
    await expect(page.getByText('피드백으로 함께 성장하기')).toBeVisible();
    
    // Final CTA 섹션
    await expect(page.getByText('함께 번역하고 성장하세요!')).toBeVisible();
  });

  test('번역 시작하기 버튼 클릭 시 로그인 페이지로 이동한다', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: '번역 시작하기' }).first();
    await loginButton.click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('로그인한 일반 유저는 랜딩 페이지 대신 챌린지 목록으로 리다이렉트된다', async ({ page, context }) => {
    // 로그인 상태 시뮬레이션 (쿠키 또는 localStorage 사용)
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    
    await page.goto('/');
    // 로그인된 경우 리다이렉트되므로 랜딩 페이지가 아닌 다른 페이지로 이동
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).not.toBe('http://localhost:3000/');
  });

  test('로그인한 어드민은 랜딩 페이지 대신 어드민 페이지로 리다이렉트된다', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-admin-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    
    await page.goto('/');
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toMatch(/\/admin/);
  });
});

