/**
 * 테스트에서 사용할 셀렉터 상수
 */

export const selectors = {
  // 인증
  login: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button:has-text("로그인")',
    signupLink: 'a:has-text("회원가입")',
  },
  
  // 챌린지 목록
  challengeList: {
    searchInput: 'input[type="search"]',
    filterButton: 'button:has-text("필터")',
    createButton: 'button:has-text("신규 챌린지 신청")',
    challengeCard: '[data-testid="challenge-card"]',
    pagination: '[data-testid="pagination"]',
  },
  
  // 챌린지 상세
  challengeDetail: {
    challengeTitle: 'h1',
    challengeButton: 'button:has-text("챌린지 도전하기")',
    originalButton: 'button:has-text("원문 보기")',
    participantList: '[data-testid="participant-list"]',
    workCard: '[data-testid="work-card"]',
  },
  
  // 작업물 작성
  workEditor: {
    editor: '[data-testid="markdown-editor"]',
    saveButton: 'button:has-text("임시 저장")',
    submitButton: 'button:has-text("제출하기")',
    loadModal: '[data-testid="load-draft-modal"]',
  },
  
  // GNB
  gnb: {
    logo: '[data-testid="gnb-logo"]',
    profile: '[data-testid="gnb-profile"]',
    logout: 'button:has-text("로그아웃")',
  },
  
  // 모달
  modal: {
    closeButton: 'button[aria-label="닫기"]',
    confirmButton: 'button:has-text("확인")',
    cancelButton: 'button:has-text("취소")',
  },
};

