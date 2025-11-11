import { test, expect } from '@playwright/test';
import { testUsers } from '../helpers/auth.js';

test.describe('유저 인증', () => {
  test.describe('회원가입', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/signup');
    });

    test('회원가입 페이지가 정상적으로 로드된다', async ({ page }) => {
      await expect(page.getByText('회원가입')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="passwordConfirm"]')).toBeVisible();
    });

    test('유효하지 않은 이메일로 회원가입 시도 시 에러가 표시된다', async ({ page }) => {
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="passwordConfirm"]', 'password123');
      
      const submitButton = page.getByRole('button', { name: /회원가입|가입하기/ });
      await submitButton.click();
      
      // 이메일 유효성 검사 에러 메시지 확인
      await expect(page.getByText(/이메일|email/i)).toBeVisible();
    });

    test('비밀번호가 일치하지 않으면 에러가 표시된다', async ({ page }) => {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="passwordConfirm"]', 'password456');
      
      const submitButton = page.getByRole('button', { name: /회원가입|가입하기/ });
      await submitButton.click();
      
      // 비밀번호 불일치 에러 메시지 확인
      await expect(page.getByText(/비밀번호|일치/i)).toBeVisible();
    });

    test('유효한 정보로 회원가입이 성공한다', async ({ page }) => {
      await page.fill('input[name="email"]', 'newuser@test.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="passwordConfirm"]', 'password123');
      
      const submitButton = page.getByRole('button', { name: /회원가입|가입하기/ });
      await submitButton.click();
      
      // 성공 시 로그인 페이지 또는 홈으로 리다이렉트
      await page.waitForTimeout(2000);
      const url = page.url();
      expect(url).toMatch(/\/auth\/login|\/user\/challenge/);
    });
  });

  test.describe('로그인', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/login');
    });

    test('로그인 페이지가 정상적으로 로드된다', async ({ page }) => {
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();
    });

    test('유효하지 않은 자격증명으로 로그인 시도 시 에러가 표시된다', async ({ page }) => {
      await page.fill('input[name="email"]', 'wrong@test.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button:has-text("로그인")');
      
      // 에러 토스트 메시지 확인
      await expect(page.getByText(/로그인 실패|인증/i)).toBeVisible({ timeout: 5000 });
    });

    test('유효한 자격증명으로 일반 유저 로그인이 성공한다', async ({ page }) => {
      await page.fill('input[name="email"]', testUsers.user.email);
      await page.fill('input[name="password"]', testUsers.user.password);
      await page.click('button:has-text("로그인")');
      
      // 로그인 성공 후 챌린지 목록 페이지로 리다이렉트
      await expect(page).toHaveURL(/\/user\/challenge/, { timeout: 10000 });
    });

    test('유효한 자격증명으로 어드민 로그인이 성공한다', async ({ page }) => {
      await page.fill('input[name="email"]', testUsers.admin.email);
      await page.fill('input[name="password"]', testUsers.admin.password);
      await page.click('button:has-text("로그인")');
      
      // 로그인 성공 후 어드민 페이지로 리다이렉트
      await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
    });

    test('OAuth 로그인 버튼이 표시된다', async ({ page }) => {
      await expect(page.getByText(/구글|카카오/i)).toBeVisible();
    });
  });

  test.describe('로그아웃', () => {
    test('로그인된 사용자가 로그아웃할 수 있다', async ({ page }) => {
      // 로그인
      await page.goto('/auth/login');
      await page.fill('input[name="email"]', testUsers.user.email);
      await page.fill('input[name="password"]', testUsers.user.password);
      await page.click('button:has-text("로그인")');
      await page.waitForURL(/\/user\/challenge/, { timeout: 10000 });
      
      // 로그아웃 버튼 클릭
      const logoutButton = page.locator('button:has-text("로그아웃")').or(page.locator('[aria-label="로그아웃"]'));
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await expect(page).toHaveURL(/\/auth\/login|\//, { timeout: 5000 });
      }
    });
  });
});

