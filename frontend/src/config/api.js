import { getAuthToken } from './utils/auth';
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const BASE_URL = "http://localhost:3001";
export const BASE_API_URL = BASE_URL;

// Hàm tiện ích tạo header kèm Authorization
export const getAuthHeaders = () => {
  const token = getAuthToken();
  console.log("Token gửi lên API:", token); // Thêm dòng này để debugS
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Hàm fetchWithAuth để gọi fetch kèm token
export const fetchWithAuth = (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
    
  };
  return fetch(url, { ...options, headers, credentials: 'include' });
};

// Các URL API
export const LOGIN_API = `${BASE_URL}/login`;
export const REGISTER_API = `${BASE_URL}/register`;
export const LOGOUT_API = `${BASE_URL}/logout`;

//Tasks
export const GET_TASKS_API = `${BASE_URL}/tasks`;
export const POST_TASK_API = `${BASE_URL}/tasks`;
export const PUT_TASK_API = `${BASE_URL}/tasks/{id}`;
export const DELETE_TASK_API = `${BASE_URL}/tasks/{id}`; //soft delete
export const PATCH_TASK_API = `${BASE_URL}/tasks/{id}`; //hard delete

//Users
export const GET_USERS_API = `${BASE_URL}/users`;
export const PUT_USER_API = `${BASE_URL}/users/{id}`;
export const DELETE_USER_API = `${BASE_URL}/users/{id}`; //soft delete
export const PATCH_USER_API = `${BASE_URL}/users/{id}`; //hard delete
