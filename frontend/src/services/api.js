import axios from "axios";

const API_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth APIs
export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};

// Task APIs
// For regular users - fetches tasks assigned to the current user
export const getUserTasks = async () => {
  const response = await api.get("/");
  return response.data;
};
export const getAllTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTask = async (taskData) => {
  // Explicitly set content type and format data
  const formattedData = {
    title: taskData.title,
    description: taskData.description,
    startDate: taskData.startDate, // Keep ISO format from component
    dueDate: taskData.dueDate, // Keep ISO format from component
    assignedTo: Array.isArray(taskData.assignedTo) ? taskData.assignedTo : [],
  };

  console.log("Sending task data:", formattedData); // Debug what's being sent

  const response = await api.post("/tasks", formattedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const updateTaskStatus = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/update-status`);
  return response.data;
};

export const softDeleteTask = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/soft-delete`);
  return response.data;
};

export const hardDeleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export default api;


