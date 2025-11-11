/**
 * 인증 관련 픽스처
 */
import { test as base } from '@playwright/test';
import { login, logout, testUsers } from '../helpers/auth.js';

export const test = base.extend({
  // 로그인된 사용자 페이지
  authenticatedPage: async ({ page }, use) => {
    await login(page, testUsers.user);
    await use(page);
    await logout(page);
  },
  
  // 로그인된 어드민 페이지
  adminPage: async ({ page }, use) => {
    await login(page, testUsers.admin);
    await use(page);
    await logout(page);
  },
  
  // 로그인된 전문가 유저 페이지
  expertPage: async ({ page }, use) => {
    await login(page, testUsers.expert);
    await use(page);
    await logout(page);
  },
});

export { expect } from '@playwright/test';

