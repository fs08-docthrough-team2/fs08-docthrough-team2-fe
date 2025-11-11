/**
 * 인증 관련 테스트 헬퍼 함수
 */

/**
 * 로그인 수행
 * @param {import('@playwright/test').Page} page
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 */
export async function login(page, { email, password }) {
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("로그인")');
  await page.waitForURL(/\/user\/challenge|\/admin/, { timeout: 10000 });
}

/**
 * 로그아웃 수행
 * @param {import('@playwright/test').Page} page
 */
export async function logout(page) {
  // GNB에서 로그아웃 버튼 클릭
  const logoutButton = page
    .locator('button:has-text("로그아웃")')
    .or(page.locator('[aria-label="로그아웃"]'));
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/\/auth\/login|\//, { timeout: 5000 });
  }
}

/**
 * 테스트용 사용자 자격증명
 */
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'admin1234',
    role: 'ADMIN',
  },
  user: {
    email: 'test@master.com',
    password: 'test1234',
    role: 'USER',
  },
  expert: {
    email: 'expert1@example.com',
    password: 'expert11234',
    role: 'USER',
    grade: 'EXPERT',
  },
};
