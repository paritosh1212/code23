export const LOGIN_ROLES = ['Admin', 'Faculty', 'Student', 'Parents'];

const ROLE_PAGE_MAP = {
  Admin: 'AdminPortal',
  Faculty: 'FacultyPortal',
  Student: 'StudentPortal',
  Parents: 'ParentsPortal',
};

export const getRoleLandingPage = (role) => ROLE_PAGE_MAP[role] || 'Home';
