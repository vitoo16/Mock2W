// utils/auth.js
import Cookies from 'js-cookie';
export const getAuthToken = () => {
  return Cookies.get('access_token');
};
