export const DOMAIN =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://zhengpq.com';
// 请求的 base_url
export const BASE_URL = `${DOMAIN}/api`;
