/**
 * API 모킹 및 테스트 헬퍼 함수
 */

/**
 * API 응답 모킹 설정
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {Object} response
 */
export async function mockApiResponse(page, url, response) {
  await page.route(url, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * API 에러 응답 모킹
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {number} status
 * @param {string} message
 */
export async function mockApiError(page, url, status = 500, message = 'Internal Server Error') {
  await page.route(url, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ message }),
    });
  });
}

/**
 * 로그인 API 모킹
 * @param {import('@playwright/test').Page} page
 * @param {Object} user
 */
export async function mockLogin(page, user) {
  await mockApiResponse(page, '**/auth/login', {
    data: {
      accessToken: 'mock-access-token',
      user: {
        id: 1,
        email: user.email,
        role: user.role,
        grade: user.grade || 'NORMAL',
      },
    },
  });
}

/**
 * 챌린지 목록 API 모킹
 * @param {import('@playwright/test').Page} page
 * @param {Array} challenges
 */
export async function mockChallenges(page, challenges = []) {
  await mockApiResponse(page, '**/challenge*', {
    data: {
      items: challenges,
      pagination: {
        page: 1,
        totalPages: Math.ceil(challenges.length / 10),
        totalItems: challenges.length,
      },
    },
  });
}

